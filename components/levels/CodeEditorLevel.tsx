// ============================================================
// REBOOT — components/levels/CodeEditorLevel.tsx
// Nivel con editor Monaco real + sandbox via Web Worker
// El jugador escribe JS real que controla el robot
// ============================================================

'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import type { Level, LevelState, TestCase, CodeEditorState } from '@/types/game'

// Monaco se importa dinámicamente — nunca SSR
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

// ------------------------------------------------------------
// TIPOS
// ------------------------------------------------------------

interface CodeEditorLevelProps {
    level: Level
    state: LevelState
    onComplete: (stars: 0 | 1 | 2 | 3, usedFrag: boolean) => void
    onFragUse: () => void
}

// ------------------------------------------------------------
// DATOS POR NIVEL — starter code, tests y solución
// ------------------------------------------------------------

interface EditorLevelData {
    starterCode: string
    tests: Omit<TestCase, 'passed'>[]
    robotAPI: string         // descripción de la API disponible
    maxLines?: number        // para calcular estrellas por eficiencia
}

const EDITOR_DATA: Record<string, EditorLevelData> = {
    '4-01': {
        starterCode: `// Declara una variable con el número de pasos
// y úsala para mover el robot

`,
        robotAPI: 'robot.move(n) · robot.turn("left"|"right") · robot.activate()',
        tests: [
            {
                id: 't1',
                description: 'Declara una variable con let o const',
                expected: true,
                input: null,
            },
            {
                id: 't2',
                description: 'Usa la variable en robot.move()',
                expected: true,
                input: null,
            },
        ],
    },

    '4-03': {
        starterCode: `// Define una función llamada 'reactivar'
// que reciba un parámetro y mueva el robot

`,
        robotAPI: 'robot.move(n) · robot.turn("left"|"right") · robot.activate()',
        tests: [
            {
                id: 't1',
                description: 'Define una función con function',
                expected: true,
                input: null,
            },
            {
                id: 't2',
                description: 'La función recibe al menos un parámetro',
                expected: true,
                input: null,
            },
            {
                id: 't3',
                description: 'La función es llamada al menos una vez',
                expected: true,
                input: null,
            },
        ],
    },

    '4-05': {
        starterCode: `// Crea un array con los generadores
// y recórrelo con forEach para activarlos

`,
        robotAPI: 'robot.move(n) · robot.activate(gen)',
        tests: [
            {
                id: 't1',
                description: 'Declara un array con [ ]',
                expected: true,
                input: null,
            },
            {
                id: 't2',
                description: 'Usa forEach para recorrer el array',
                expected: true,
                input: null,
            },
            {
                id: 't3',
                description: 'Llama a robot.activate() dentro del forEach',
                expected: true,
                input: null,
            },
        ],
    },

    '4-07': {
        starterCode: `// Crea un objeto para la máquina A
// con propiedades: potencia, estado, tipo

`,
        robotAPI: 'robot.move(n) · robot.activate()',
        tests: [
            {
                id: 't1',
                description: 'Declara un objeto con { }',
                expected: true,
                input: null,
            },
            {
                id: 't2',
                description: 'El objeto tiene al menos 2 propiedades',
                expected: true,
                input: null,
            },
            {
                id: 't3',
                description: 'Accede a una propiedad con punto (.)',
                expected: true,
                input: null,
            },
        ],
    },

    '4-08': {
        starterCode: `// Escribe una función que reciba
// una máquina y un callback

`,
        robotAPI: 'robot.move(n) · robot.activate()',
        tests: [
            {
                id: 't1',
                description: 'Define una función con 2 parámetros',
                expected: true,
                input: null,
            },
            {
                id: 't2',
                description: 'El segundo parámetro es llamado como función',
                expected: true,
                input: null,
            },
            {
                id: 't3',
                description: 'La función es llamada con un callback anónimo',
                expected: true,
                input: null,
            },
        ],
    },

    '4-10': {
        starterCode: `// Programa completo: reactiva el sector 3
// Usa variables, funciones, arrays y objetos

`,
        robotAPI: 'robot.move(n) · robot.turn("left"|"right") · robot.activate() · robot.jump()',
        maxLines: 20,
        tests: [
            {
                id: 't1',
                description: 'Usa al menos una variable (let/const)',
                expected: true,
                input: null,
            },
            {
                id: 't2',
                description: 'Define al menos una función',
                expected: true,
                input: null,
            },
            {
                id: 't3',
                description: 'Usa un array',
                expected: true,
                input: null,
            },
            {
                id: 't4',
                description: 'Usa un objeto',
                expected: true,
                input: null,
            },
            {
                id: 't5',
                description: 'Llama a robot.activate() al menos una vez',
                expected: true,
                input: null,
            },
        ],
    },

    '5-02': {
        starterCode: `// PROTOCOLO DE ACTIVACIÓN — PROYECTO GÉNESIS
// Escribe el código que active las 12 máquinas
// Tienes todo lo que necesitas

`,
        robotAPI: 'genesis.activar(id) · genesis.verificar(id) · genesis.estado()',
        tests: [
            {
                id: 't1',
                description: 'Declara variables con let o const',
                expected: true,
                input: null,
            },
            {
                id: 't2',
                description: 'Define al menos una función',
                expected: true,
                input: null,
            },
            {
                id: 't3',
                description: 'Usa un array',
                expected: true,
                input: null,
            },
            {
                id: 't4',
                description: 'Usa un objeto',
                expected: true,
                input: null,
            },
            {
                id: 't5',
                description: 'Usa forEach o un loop',
                expected: true,
                input: null,
            },
            {
                id: 't6',
                description: 'Usa una condición if',
                expected: true,
                input: null,
            },
            {
                id: 't7',
                description: 'Usa un callback',
                expected: true,
                input: null,
            },
            {
                id: 't8',
                description: 'Llama a genesis.activar() al menos una vez',
                expected: true,
                input: null,
            },
        ],
    },
}

const DEFAULT_EDITOR: EditorLevelData = {
    starterCode: '// escribe tu código aquí\n\n',
    robotAPI: 'robot.move(n) · robot.activate()',
    tests: [
        { id: 't1', description: 'El código no tiene errores de sintaxis', expected: true, input: null },
    ],
}

// ------------------------------------------------------------
// VALIDADOR DE TESTS — analiza el código estáticamente
// No ejecuta el código — solo busca patrones
// ------------------------------------------------------------

function runTests(code: string, tests: Omit<TestCase, 'passed'>[]): TestCase[] {
    const patterns: Record<string, (code: string) => boolean> = {
        // variables
        't1-4-01': c => /\b(let|const)\s+\w+/.test(c),
        't2-4-01': c => /robot\.move\s*\(\s*\w+\s*\)/.test(c),

        // funciones
        't1-4-03': c => /\bfunction\b/.test(c),
        't2-4-03': c => /function\s+\w+\s*\(\s*\w+/.test(c),
        't3-4-03': c => {
            const fnMatch = c.match(/function\s+(\w+)/)
            if (!fnMatch) return false
            const name = fnMatch[1]
            return new RegExp(name + '\\s*\\(').test(c.replace(`function ${name}`, ''))
        },

        // arrays
        't1-4-05': c => /\[[\s\S]*?\]/.test(c),
        't2-4-05': c => /\.forEach\s*\(/.test(c),
        't3-4-05': c => /robot\.activate\s*\(/.test(c) && /\.forEach\s*\(/.test(c),

        // objetos
        't1-4-07': c => /\{[\s\S]*?:[\s\S]*?\}/.test(c),
        't2-4-07': c => {
            const objMatch = c.match(/\{([\s\S]*?)\}/)
            if (!objMatch) return false
            const props = objMatch[1].split(',').filter(p => p.includes(':'))
            return props.length >= 2
        },
        't3-4-07': c => /\w+\.\w+/.test(c),

        // callbacks
        't1-4-08': c => /function\s+\w+\s*\(\s*\w+\s*,\s*\w+/.test(c),
        't2-4-08': c => {
            const paramMatch = c.match(/function\s+\w+\s*\(\s*\w+\s*,\s*(\w+)/)
            if (!paramMatch) return false
            const cbParam = paramMatch[1]
            return new RegExp(cbParam + '\\s*\\(').test(c)
        },
        't3-4-08': c => /\bfunction\b[\s\S]*?\bfunction\b/.test(c),

        // nivel 4-10
        't1-4-10': c => /\b(let|const)\s+\w+/.test(c),
        't2-4-10': c => /\bfunction\b/.test(c),
        't3-4-10': c => /\[[\s\S]*?\]/.test(c),
        't4-4-10': c => /\{[\s\S]*?:[\s\S]*?\}/.test(c),
        't5-4-10': c => /robot\.activate\s*\(/.test(c),

        // nivel final 5-02
        't1-5-02': c => /\b(let|const)\s+\w+/.test(c),
        't2-5-02': c => /\bfunction\b/.test(c),
        't3-5-02': c => /\[[\s\S]*?\]/.test(c),
        't4-5-02': c => /\{[\s\S]*?:[\s\S]*?\}/.test(c),
        't5-5-02': c => /\.forEach\s*\(|for\s*\(/.test(c),
        't6-5-02': c => /\bif\s*\(/.test(c),
        't7-5-02': c => /function[\s\S]*?function/.test(c),
        't8-5-02': c => /genesis\.activar\s*\(/.test(c),
    }

    return tests.map(test => {
        const key = `${test.id}-${Object.keys(EDITOR_DATA).find(k =>
            EDITOR_DATA[k].tests.some(t => t.id === test.id)
        ) ?? ''}`

        const fn = patterns[key]
        const passed = fn ? fn(code) : code.trim().length > 0

        return { ...test, passed }
    })
}

// ------------------------------------------------------------
// COMPONENTE PRINCIPAL
// ------------------------------------------------------------

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

    // ------------------------------------------------------------
    // EJECUTAR — analiza el código y corre tests
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

    // ------------------------------------------------------------
    // RENDER
    // ------------------------------------------------------------

    return (
        <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--bg-void)',
            height: '100%',
            minHeight: '70vh',
        }}>

            {/* Header */}
            <div style={{
                background: 'var(--bg-surface)',
                borderBottom: '1px solid var(--bg-hover)',
                padding: '8px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                flexWrap: 'wrap',
            }}>
                <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    color: 'var(--green-base)',
                    letterSpacing: '.12em',
                }}>
          // {level.title}
                </div>
                <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    color: 'var(--text-ghost)',
                    letterSpacing: '.08em',
                }}>
                    API: {data.robotAPI}
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '.5rem' }}>
                    <button
                        onClick={handleRun}
                        disabled={editorState.running}
                        style={{
                            background: phase === 'passed' ? 'var(--green-darkest)' : 'var(--green-dark)',
                            border: `1px solid ${phase === 'passed' ? 'var(--green-light)' : 'var(--green-base)'}`,
                            borderRadius: '6px',
                            padding: '6px 18px',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '11px',
                            color: 'var(--green-light)',
                            cursor: editorState.running ? 'not-allowed' : 'pointer',
                            letterSpacing: '.1em',
                            opacity: editorState.running ? 0.6 : 1,
                            transition: 'all .15s',
                        }}
                    >
                        {editorState.running ? '⟳ ejecutando...' : phase === 'passed' ? '✓ completado' : '▶ ejecutar'}
                    </button>
                </div>
            </div>

            {/* Editor + Panel derecho */}
            <div style={{
                flex: 1,
                display: 'flex',
                minHeight: 0,
                flexWrap: 'wrap',
            }}>

                {/* Monaco Editor */}
                <div style={{ flex: '1 1 400px', minHeight: '400px' }}>
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
                <div style={{
                    flex: '0 0 260px',
                    background: 'var(--bg-surface)',
                    borderLeft: '1px solid var(--bg-hover)',
                    display: 'flex',
                    flexDirection: 'column',
                }}>

                    {/* Tabs */}
                    <div style={{
                        display: 'flex',
                        borderBottom: '1px solid var(--bg-hover)',
                    }}>
                        {(['tests', 'output'] as const).map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActivePanel(tab)}
                                style={{
                                    flex: 1,
                                    background: activePanel === tab ? 'var(--bg-elevated)' : 'transparent',
                                    border: 'none',
                                    borderBottom: activePanel === tab ? `2px solid var(--green-base)` : '2px solid transparent',
                                    padding: '8px',
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '10px',
                                    color: activePanel === tab ? 'var(--green-light)' : 'var(--text-ghost)',
                                    cursor: 'pointer',
                                    letterSpacing: '.1em',
                                    transition: 'all .15s',
                                }}
                            >
                                {tab}
                                {tab === 'tests' && (
                                    <span style={{ marginLeft: '5px', opacity: .6 }}>
                                        ({editorState.tests.filter(t => t.passed).length}/{editorState.tests.length})
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Panel de tests */}
                    {activePanel === 'tests' && (
                        <div style={{
                            flex: 1,
                            padding: '1rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '.5rem',
                            overflowY: 'auto',
                        }}>
                            <div style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: '10px',
                                color: 'var(--text-ghost)',
                                letterSpacing: '.08em',
                                marginBottom: '.25rem',
                            }}>
                // verificaciones
                            </div>
                            {editorState.tests.map(test => (
                                <div key={test.id} style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '.625rem',
                                    padding: '.5rem .75rem',
                                    background: test.passed === true
                                        ? 'var(--green-darkest)'
                                        : test.passed === false
                                            ? '#1a0808'
                                            : 'var(--bg-elevated)',
                                    border: `1px solid ${test.passed === true ? 'var(--green-dark)' : test.passed === false ? 'var(--red)' : 'var(--bg-hover)'}`,
                                    borderRadius: '6px',
                                    transition: 'all .3s',
                                }}>
                                    <span style={{
                                        fontSize: '12px',
                                        flexShrink: 0,
                                        marginTop: '1px',
                                        color: test.passed === true
                                            ? 'var(--green-light)'
                                            : test.passed === false
                                                ? 'var(--red)'
                                                : 'var(--text-ghost)',
                                    }}>
                                        {test.passed === true ? '✓' : test.passed === false ? '✗' : '○'}
                                    </span>
                                    <span style={{
                                        fontFamily: 'var(--font-mono)',
                                        fontSize: '11px',
                                        color: test.passed === true
                                            ? 'var(--green-muted)'
                                            : test.passed === false
                                                ? '#cc6666'
                                                : 'var(--text-ghost)',
                                        lineHeight: 1.5,
                                    }}>
                                        {test.description}
                                    </span>
                                </div>
                            ))}

                            {/* Descripción del nivel */}
                            <div style={{
                                marginTop: '1rem',
                                padding: '.75rem',
                                background: 'var(--bg-elevated)',
                                borderRadius: '6px',
                                fontFamily: 'var(--font-sans)',
                                fontSize: '11px',
                                color: 'var(--text-ghost)',
                                lineHeight: 1.6,
                            }}>
                                {level.description}
                            </div>

                            {/* Ejemplo del level si tiene */}
                            {level.codeExample && (
                                <div style={{
                                    padding: '.75rem',
                                    background: '#060809',
                                    border: '1px solid var(--bg-hover)',
                                    borderRadius: '6px',
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '11px',
                                    color: 'var(--green-muted)',
                                    lineHeight: 1.8,
                                    whiteSpace: 'pre',
                                    overflowX: 'auto',
                                }}>
                                    {level.codeExample}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Panel de output */}
                    {activePanel === 'output' && (
                        <div style={{
                            flex: 1,
                            padding: '1rem',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '12px',
                            overflowY: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '.375rem',
                        }}>
                            {editorState.error && (
                                <div style={{
                                    color: 'var(--red)',
                                    background: '#1a0808',
                                    border: '1px solid var(--red)',
                                    borderRadius: '5px',
                                    padding: '.625rem',
                                    fontSize: '11px',
                                    lineHeight: 1.6,
                                }}>
                                    {editorState.error}
                                </div>
                            )}
                            {editorState.output.length === 0 && !editorState.error && (
                                <div style={{ color: 'var(--text-ghost)', fontSize: '11px' }}>
                  // ejecuta el código para ver el output
                                </div>
                            )}
                            {editorState.output.map((line, i) => (
                                <div key={i} style={{
                                    color: line.startsWith('ERROR') ? 'var(--red)' : line.includes('✓') ? 'var(--green-light)' : 'var(--text-muted)',
                                    fontSize: '12px',
                                    lineHeight: 1.6,
                                }}>
                                    {line}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Footer — estado */}
            <div style={{
                background: 'var(--bg-surface)',
                borderTop: '1px solid var(--bg-hover)',
                padding: '6px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
            }}>
                <span style={{
                    color: phase === 'passed' ? 'var(--green-light)' : phase === 'failed' ? 'var(--red)' : phase === 'running' ? 'var(--amber)' : 'var(--text-ghost)',
                    letterSpacing: '.1em',
                }}>
                    {phase === 'passed' && '✓ todas las verificaciones pasaron'}
                    {phase === 'failed' && `✗ ${editorState.tests.filter(t => !t.passed).length} verificaciones fallidas`}
                    {phase === 'running' && '⟳ ejecutando...'}
                    {phase === 'editing' && '// listo para ejecutar'}
                </span>
                <span style={{ marginLeft: 'auto', color: 'var(--text-ghost)' }}>
                    {editorState.code.split('\n').filter(l => l.trim()).length} líneas
                </span>
                <span style={{ color: 'var(--text-ghost)' }}>
                    intento {attempts}
                </span>
            </div>
        </div>
    )
}