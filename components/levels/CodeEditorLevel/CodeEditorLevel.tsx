'use client'

import { useRef, useState, useCallback, useMemo } from 'react'
import dynamic from 'next/dynamic'
import type { CodeEditorState } from '@/types/game'
import { CodeEditorLevelProps } from './types'
import { EDITOR_DATA, DEFAULT_EDITOR } from './constants'
import { runTests } from './utils'
import { EditorHeader } from './EditorHeader'
import { EditorFooter } from './EditorFooter'
import { TestPanel } from './TestPanel'
import { OutputPanel } from './OutputPanel'

// Monaco se importa dinámicamente — nunca SSR
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

export default function CodeEditorLevel({
    level,
    state,
    onComplete,
}: CodeEditorLevelProps) {
    const data = EDITOR_DATA[level.id] ?? DEFAULT_EDITOR

    const [editorState, setEditorState] = useState<CodeEditorState>({
        code: data.starterCode,
        running: false,
        output: [],
        error: null,
        tests: data.tests.map(t => ({ ...t, passed: null })),
        allTestsPassed: false,
    })

    const [attempts, setAttempts] = useState(0)
    const [phase, setPhase] = useState<'editing' | 'running' | 'passed' | 'failed'>('editing')
    const [activePanel, setActivePanel] = useState<'output' | 'tests'>('tests')
    const editorRef = useRef<unknown>(null)

    const lineCount = useMemo(() =>
        editorState.code.split('\n').filter(l => l.trim()).length
        , [editorState.code])

    // ------------------------------------------------------------
    // EJECUTAR
    // ------------------------------------------------------------

    const handleRun = useCallback(async () => {
        if (editorState.running) return
        setAttempts(a => a + 1)
        setPhase('running')
        setEditorState(prev => ({ ...prev, running: true, output: [], error: null }))

        await new Promise(r => setTimeout(r, 600)) // simula ejecución

        const code = editorState.code

        // verificar sintaxis básica
        let syntaxError: string | null = null
        try {
            new Function(code) // eslint-disable-line no-new-func
        } catch (e) {
            syntaxError = (e as Error).message
        }

        if (syntaxError) {
            setEditorState(prev => ({
                ...prev,
                running: false,
                error: syntaxError,
                output: [`ERROR: ${syntaxError}`],
            }))
            setPhase('failed')
            return
        }

        // correr tests de análisis estático
        const results = runTests(code, data.tests)
        const allPassed = results.every(t => t.passed)
        const passedCount = results.filter(t => t.passed).length

        // simular output del robot
        const output: string[] = []
        if (code.includes('console.log')) {
            output.push('> ejecutando...')
            output.push(`> ${passedCount}/${results.length} verificaciones pasadas`)
        }
        if (allPassed) {
            output.push('> sistema reactivado ✓')
        }

        setEditorState(prev => ({
            ...prev,
            running: false,
            tests: results,
            allTestsPassed: allPassed,
            output,
            error: null,
        }))

        if (allPassed) {
            setPhase('passed')
            const lines = code.split('\n').filter(l => l.trim()).length
            const max = data.maxLines ?? 10
            const stars = attempts === 0
                ? lines <= max * 0.6 ? 3 : 2
                : attempts <= 2 ? 2 : 1
            setTimeout(() => onComplete(stars as 1 | 2 | 3, state.fragUsed), 800)
        } else {
            setPhase('failed')
        }
    }, [editorState.code, editorState.running, data, attempts, onComplete, state.fragUsed])

    return (
        <div className="flex-1 flex flex-col bg-(--bg-void) min-h-[70vh] h-full">

            <EditorHeader
                level={level}
                robotAPI={data.robotAPI}
                running={editorState.running}
                phase={phase}
                onRun={handleRun}
            />

            {/* Editor + Panel derecho */}
            <div className="flex-1 flex min-h-0 flex-wrap">

                {/* Monaco Editor */}
                <div className="flex-[1_1_400px] min-h-[400px]">
                    <MonacoEditor
                        height="100%"
                        defaultLanguage="javascript"
                        value={editorState.code}
                        onChange={val => setEditorState(prev => ({ ...prev, code: val ?? '' }))}
                        onMount={(editor: unknown) => { editorRef.current = editor }}
                        theme="vs-dark"
                        options={{
                            fontSize: 14,
                            fontFamily: "'Geist Mono', 'Fira Code', monospace",
                            lineHeight: 24,
                            minimap: { enabled: false },
                            scrollBeyondLastLine: false,
                            renderLineHighlight: 'line',
                            cursorBlinking: 'smooth',
                            smoothScrolling: true,
                            tabSize: 2,
                            wordWrap: 'on',
                            padding: { top: 16, bottom: 16 },
                            overviewRulerBorder: false,
                            hideCursorInOverviewRuler: true,
                            renderWhitespace: 'none',
                            folding: false,
                            glyphMargin: false,
                            lineDecorationsWidth: 0,
                            lineNumbersMinChars: 3,
                        }}
                    />
                </div>

                {/* Panel derecho — tests + output */}
                <div className="flex-[0_0_260px] bg-(--bg-surface) border-l border-(--bg-hover) flex flex-col">

                    {/* Tabs */}
                    <div className="flex border-b border-(--bg-hover)">
                        {(['tests', 'output'] as const).map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActivePanel(tab)}
                                className={`flex-1 bg-transparent border-none p-2 font-mono text-[10px] tracking-widest cursor-pointer transition-all border-b-2 ${activePanel === tab ? 'bg-(--bg-elevated) border-(--green-base) text-(--green-light)' : 'border-transparent text-(--text-ghost)'
                                    }`}
                            >
                                {tab}
                                {tab === 'tests' && (
                                    <span className="ml-[5px] opacity-60">
                                        ({editorState.tests.filter(t => t.passed).length}/{editorState.tests.length})
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Contenido paneles */}
                    {activePanel === 'tests' ? (
                        <TestPanel tests={editorState.tests} level={level} />
                    ) : (
                        <OutputPanel output={editorState.output} error={editorState.error} />
                    )}
                </div>
            </div>

            <EditorFooter
                phase={phase}
                tests={editorState.tests}
                lineCount={lineCount}
                attempts={attempts}
            />
        </div>
    )
}
