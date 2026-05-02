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
import { DirectivesPanel } from '@/components/ui/DirectivesPanel'
import { useUIStore } from '@/lib/store/useUIStore'
import { LevelHeader } from '../LevelHeader'
import { MissionStatusMonitor } from '../NodeRoutineLevel/MissionStatusMonitor'
import { Button } from '@/components/ui/Button'
import { Panel } from '@/components/ui/Panel'
import SectionHeader from '@/components/ui/SectionHeader'

// Monaco se importa dinámicamente — nunca SSR
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

export default function CodeEditorLevel({
    level,
    state,
    onComplete,
    onFragUse,
    onStatusChange,
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

    const closeDirectives = useUIStore(state => state.closeDirectives)

    const handleRun = useCallback(async () => {
        if (editorState.running) return
        closeDirectives()
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
        const results = runTests(code, data.tests, level.id)
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
            const stars = 3
            setTimeout(() => onComplete(stars as 1 | 2 | 3, state.fragUsed), 800)
        } else {
            setPhase('failed')
        }
    }, [editorState.code, editorState.running, data, attempts, onComplete, state.fragUsed])

    return (
        <div className="flex-1 flex flex-col bg-(--bg-void) min-h-[70vh] h-full overflow-hidden border border-(--bg-hover) rounded-xl shadow-2xl">

            <LevelHeader
                level={level}
                isRunning={editorState.running}
                status={phase === 'passed' ? 'success' : phase === 'running' ? 'playing' : 'idle'}
            >
                <div className='min-w-[348px]'>
                    <DirectivesPanel
                        infoText={level.fragHint}
                        missionText={level.description}
                    />
                </div>
                <MissionStatusMonitor
                    className="min-w-[398px]"
                    status={phase === 'passed' ? 'success' : phase === 'running' ? 'playing' : phase === 'failed' ? 'failed' : 'idle'}
                />
            </LevelHeader>

            <div className="flex-1 flex min-h-0 overflow-hidden">
                {/* Editor + Console Column */}
                <div className="flex-1 flex flex-col min-w-0 bg-(--bg-deep) relative">
                    <div className="flex-1 relative group overflow-hidden">
                        {/* Industrial Border Accent */}
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-linear-to-b from-(--green-dark) via-transparent to-(--green-darkest) opacity-30 z-10" />

                        <MonacoEditor
                            height="100%"
                            defaultLanguage="javascript"
                            value={editorState.code}
                            onChange={val => setEditorState(prev => ({ ...prev, code: val ?? '' }))}
                            onMount={(editor: any) => { editorRef.current = editor }}
                            theme="vs-dark"
                            options={{
                                fontSize: 14,
                                fontFamily: "var(--font-mono)",
                                lineHeight: 24,
                                minimap: { enabled: false },
                                scrollBeyondLastLine: false,
                                renderLineHighlight: 'all',
                                cursorBlinking: 'phase',
                                cursorSmoothCaretAnimation: 'on',
                                smoothScrolling: true,
                                tabSize: 2,
                                wordWrap: 'on',
                                padding: { top: 20, bottom: 20 },
                                overviewRulerBorder: false,
                                hideCursorInOverviewRuler: true,
                                renderWhitespace: 'none',
                                folding: false,
                                glyphMargin: false,
                                lineDecorationsWidth: 4,
                                lineNumbersMinChars: 3,
                                scrollbar: {
                                    vertical: 'visible',
                                    horizontal: 'hidden',
                                    verticalSliderSize: 4,
                                    verticalScrollbarSize: 4,
                                }
                            }}
                        />
                    </div>

                    {/* ALWAYS VISIBLE CONSOLE */}
                    <div className="h-48 border-t border-(--bg-hover) flex flex-col bg-(--bg-void)">
                        <div className="px-4 py-2 bg-(--bg-surface) border-b border-(--bg-hover) flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-(--green-base) animate-pulse" />
                                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-(--text-muted)">Terminal de Salida</span>
                            </div>
                            <span className="text-[9px] font-mono text-(--text-ghost)">STDOUT / STDERR</span>
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <OutputPanel output={editorState.output} error={editorState.error} />
                        </div>
                    </div>
                </div>

                {/* Right Panel — Tests Only or Context */}
                <Panel typePanel='main' className="w-[400px] flex flex-col relative overflow-hidden shrink-0">
                    <SectionHeader title='Pruebas de Sistema' ></SectionHeader>

                    <div className={`flex items-center gap-2.5 px-3 py-2 border transition-all duration-500 rounded-[2px] ${editorState.allTestsPassed
                        ? 'bg-[#0d1510] border-(--green-base)/30 text-(--green-light) shadow-[0_0_15px_rgba(34,197,94,0.1)]'
                        : 'bg-black/40 border-white/5 text-zinc-200'}`}>
                        {/* Status LED Dot */}
                        <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${editorState.allTestsPassed
                            ? 'bg-(--green-base) shadow-[0_0_8px_var(--green-base)] animate-pulse'
                            : 'bg-zinc-800'
                            }`} />

                        <span className="text-sm font-mono font-black uppercase leading-none">
                            {editorState.tests.filter(t => t.passed).length}/{editorState.tests.length} VERIFICADO
                        </span>

                        {/* Micro decoración de cierre */}
                        <div className="w-px h-3 bg-white/5 ml-1" />
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar h-[calc(100svh-292px)] relative z-0 flex flex-col p-1">
                        <TestPanel tests={editorState.tests} level={level} />
                    </div>

                    <Button
                        onClick={handleRun}
                        disabled={editorState.running}
                        className='w-full'
                    >
                        Transmitir
                    </Button>
                </Panel>
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
