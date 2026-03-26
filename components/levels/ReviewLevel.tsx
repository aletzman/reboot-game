// ============================================================
// REBOOT — components/levels/ReviewLevel.tsx
// Nivel de repaso: orquestador de fases (Quiz, Puzzls, Mini-juego)
// ============================================================

'use client'

import { useState, useMemo } from 'react'
import type { Level, LevelState } from '@/types/game'
import { Button } from '@/components/ui/Button'
import { Check, X, ArrowRight, Brain, Zap, Terminal } from 'lucide-react'
import dynamic from 'next/dynamic'

// ------------------------------------------------------------
// IMPORTS DINÁMICOS — para las fases finales
// ------------------------------------------------------------

const LightbotLevel = dynamic(() => import('@/components/levels/LightBotLevel/LightBotLevel'), { ssr: false })
const ScratchLevel = dynamic(() => import('@/components/levels/ScratchLevel/ScratchLevel'), { ssr: false })
const PuzzleLevel = dynamic(() => import('@/components/levels/PuzzleLevel/PuzzleLevel'), { ssr: false })
const CodeEditorLevel = dynamic(() => import('@/components/levels/CodeEditorLevel/CodeEditorLevel'), { ssr: false })

// ------------------------------------------------------------
// TIPOS
// ------------------------------------------------------------

interface ReviewLevelProps {
    level: Level
    state: LevelState
    onComplete: (stars: 0 | 1 | 2 | 3, usedFrag: boolean) => void
    onFragUse: () => void
}

interface Question {
    id: string
    text: string
    options: string[]
    correctIndex: number
    concept: string // para el redirect si falla
}

type Phase = 'intro' | 'quiz' | 'puzzle' | 'minigame' | 'summary'

// ------------------------------------------------------------
// DATA DE REPASO POR DEFECTO (Actos 1, 2, 3)
// ------------------------------------------------------------

const DEFAULT_REVIEW_DATA: Record<string, { questions: Question[] }> = {
    '1-R': {
        questions: [
            {
                id: 'q1',
                text: '¿Cuál es el concepto que define un conjunto de instrucciones ejecutadas una tras otra?',
                options: ['Bucle / Loop', 'Secuencia', 'Función', 'Condicional'],
                correctIndex: 1,
                concept: 'secuencia'
            },
            {
                id: 'q2',
                text: 'Si el robot necesita repetir un patrón fijo de 4 pasos, ¿qué estructura es la más eficiente?',
                options: ['SI (Condicional)', 'REPETIR (Bucle)', 'SALTAR', 'GIRAR'],
                correctIndex: 1,
                concept: 'loop'
            },
            {
                id: 'q3',
                text: 'En un flujo lógico, el bloque SI (IF) sirve para:',
                options: ['Aumentar la velocidad del robot', 'Ejecutar código solo si se cumple una condición', 'Repetir pasos infinitamente', 'Definir el nombre del programa'],
                correctIndex: 1,
                concept: 'condicional'
            }
        ]
    },
    '2-R': {
        questions: [
            {
                id: 'q1',
                text: '¿Qué estructura permite agrupar una secuencia de bloques bajo un nombre para reutilizarla?',
                options: ['Variable', 'Bucle', 'Función / Procedimiento', 'Asignación'],
                correctIndex: 2,
                concept: 'funcion'
            },
            {
                id: 'q2',
                text: '¿Para qué sirve una variable en pseudocódigo?',
                options: ['Para mover al robot', 'Para almacenar información que puede cambiar', 'Para detener el programa', 'Para repetir una acción'],
                correctIndex: 1,
                concept: 'variable'
            },
            {
                id: 'q3',
                text: 'El proceso de encontrar y corregir errores en la lógica de un bloque se conoce como:',
                options: ['Compilación', 'Iteración', 'Debugging', 'Identificación'],
                correctIndex: 2,
                concept: 'debugging'
            }
        ]
    },
    '3-R': {
        questions: [
            {
                id: 'q1',
                text: '¿Cuál es la principal diferencia entre el pseudocódigo y un lenguaje real como JavaScript?',
                options: ['El pseudocódigo no usa lógica', 'El lenguaje real tiene reglas de sintaxis estrictas', 'El pseudocódigo es más rápido de ejecutar', 'JavaScript no permite usar bucles'],
                correctIndex: 1,
                concept: 'pseudocodigo_a_js'
            },
            {
                id: 'q2',
                text: 'Al pasar de bloques visuales a JavaScript, los comandos ahora se escriben como:',
                options: ['Dibujos técnicos', 'Funciones con paréntesis y punto y coma', 'Solo números', 'Comandos de voz'],
                correctIndex: 1,
                concept: 'pseudocodigo_a_js'
            }
        ]
    },
    '4-R': {
        questions: [
            {
                id: 'q1',
                text: '¿Qué palabra clave usamos en JavaScript para declarar un valor que NUNCA debe cambiar?',
                options: ['let', 'var', 'const', 'fix'],
                correctIndex: 2,
                concept: 'variables'
            },
            {
                id: 'q2',
                text: '¿Cuál es la instrucción estándar para enviar información a la consola del sistema?',
                options: ['console.log()', 'print()', 'system.out()', 'log.write()'],
                correctIndex: 0,
                concept: 'salida'
            },
            {
                id: 'q3',
                text: 'Los tipos de datos booleanos solo admiten dos valores posibles. ¿Cuáles son?',
                options: ['0 y 1', 'true y false', 'YES y NO', 'null y defined'],
                correctIndex: 1,
                concept: 'logica'
            }
        ]
    }
}

// ------------------------------------------------------------
// COMPONENTE PRINCIPAL
// ------------------------------------------------------------

export default function ReviewLevel({
    level,
    state,
    onComplete,
    onFragUse,
}: ReviewLevelProps) {
    const [phase, setPhase] = useState<Phase>('intro')
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [answers, setAnswers] = useState<boolean[]>([])
    const [showFeedback, setShowFeedback] = useState<number | null>(null)

    // Obtener data del nivel (desde JSON o fallback)
    const reviewData = useMemo(() => {
        // @ts-ignore
        const fromLevel = level.reviewData || DEFAULT_REVIEW_DATA[level.id]
        return fromLevel || { questions: [] }
    }, [level.id])

    const questions = reviewData.questions

    // ------------------------------------------------------------
    // HANDLERS
    // ------------------------------------------------------------

    function handleStart() {
        if (questions.length > 0) setPhase('quiz')
        else setPhase('puzzle')
    }

    function handleAnswer(index: number) {
        if (showFeedback !== null) return
        
        setShowFeedback(index)
        const isCorrect = index === questions[currentQuestion].correctIndex
        setAnswers(prev => [...prev, isCorrect])

        setTimeout(() => {
            setShowFeedback(null)
            if (currentQuestion < questions.length - 1) {
                setCurrentQuestion(prev => prev + 1)
            } else {
                setPhase('puzzle')
            }
        }, 1500)
    }

    function handlePuzzleComplete(stars: number) {
        // En niveles de repaso, si fallas el puzzle a veces pasas directo a summary
        // pero aquí seguiremos la lógica de 3 fases
        setPhase('minigame')
    }

    function handleFinalComplete(stars: number) {
        // Cálculo final de estrellas basado en las 3 fases
        const correctCount = answers.filter(a => a).length
        const totalQ = questions.length || 1
        const quizScore = correctCount / totalQ // 0 a 1

        // Simplificado: 3 estrellas si acertaste todo y pasaste el minijuego
        // En un sistema real usaríamos una fórmula más compleja
        const finalStars = correctCount === totalQ ? 3 : correctCount >= totalQ / 2 ? 2 : 1
        
        onComplete(finalStars as 0|1|2|3, state.fragUsed)
    }

    // ------------------------------------------------------------
    // RENDERS DE FASE
    // ------------------------------------------------------------

    if (phase === 'intro') {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-(--bg-void) transition-all animate-in fade-in duration-700">
                <div className="max-w-md w-full bg-(--bg-surface) border border-(--bg-hover) rounded-xl p-8 flex flex-col gap-6 shadow-2xl relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Terminal size={120} className="text-(--green-base) -rotate-12 translate-x-8 -translate-y-8" />
                    </div>

                    <div className="flex flex-col gap-2">
                        <div className="text-(--green-base) font-mono text-[10px] tracking-[.25em] uppercase">Protocolo de Repaso :: {level.id}</div>
                        <h1 className="text-2xl font-bold text-(--text-primary) leading-tight">{level.title}</h1>
                    </div>

                    <p className="text-(--text-muted) text-[15px] leading-relaxed">
                        {level.description}
                    </p>

                    <div className="bg-(--bg-deep) rounded-lg p-5 border-l-4 border-l-(--amber)">
                        <div className="flex items-center gap-2 mb-2 text-(--amber) font-mono text-[11px] font-bold uppercase tracking-widest">
                            <Zap size={14} /> fase de certificación
                        </div>
                        <div className="text-(--text-muted) text-[13px] italic">
                            &quot;{level.narrative.replace('FRAG: ', '')}&quot;
                        </div>
                    </div>

                    <button 
                        onClick={handleStart}
                        className="group flex items-center justify-center gap-3 bg-(--green-dark) hover:bg-(--green-base) border border-(--green-base) text-(--green-light) font-mono py-4 px-6 rounded-lg transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(85,226,0,0.1)] hover:shadow-[0_0_30px_rgba(85,226,0,0.2)]"
                    >
                        INICIAR PROTOCOLO <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    
                    <div className="flex justify-around items-center pt-2">
                        {[1, 2, 3].map((i: number) => (
                            <div key={i} className="flex flex-col items-center gap-2">
                                <div className={`w-3 h-3 rounded-full border border-(--bg-hover) ${i === 1 ? 'bg-(--green-base) shadow-[0_0_8px_var(--green-base)]' : 'bg-(--bg-deep)'}`} />
                                <span className="text-[9px] text-(--text-ghost) uppercase tracking-tighter">Fase {i}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    if (phase === 'quiz') {
        const q = questions[currentQuestion]
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-(--bg-void) transition-all animate-in zoom-in-95 duration-500">
                <div className="max-w-xl w-full flex flex-col gap-8">
                    {/* Progress indicator bar */}
                    <div className="w-full flex gap-1.5 h-1">
                        {questions.map((_: any, i: number) => (
                            <div 
                                key={i} 
                                className={`flex-1 rounded-full transition-all duration-500 ${
                                    i < currentQuestion ? 'bg-(--green-light)' : 
                                    i === currentQuestion ? 'bg-(--green-base) animate-pulse' : 
                                    'bg-(--bg-hover)'
                                }`} 
                            />
                        ))}
                    </div>

                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-(--purple) font-mono text-[10px] tracking-widest uppercase">
                            <Brain size={14} /> Evaluación Teórica :: Pregunta {currentQuestion + 1} de {questions.length}
                        </div>
                        <h2 className="text-xl md:text-2xl text-(--text-primary) font-medium leading-snug">
                            {q.text}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        {q.options.map((opt: string, i: number) => {
                            const isCorrect = i === q.correctIndex
                            const isSelected = showFeedback === i
                            
                            let borderColor = 'var(--bg-hover)'
                            let bgColor = 'var(--bg-surface)'
                            let textColor = 'var(--text-primary)'
                            
                            if (showFeedback !== null) {
                                if (isCorrect) {
                                    borderColor = 'var(--green-base)'
                                    bgColor = 'var(--green-darkest)'
                                    textColor = 'var(--green-light)'
                                } else if (isSelected) {
                                    borderColor = 'var(--red)'
                                    bgColor = '#2a0a0a'
                                    textColor = 'var(--red)'
                                }
                            }

                            return (
                                <button
                                    key={i}
                                    onClick={() => handleAnswer(i)}
                                    disabled={showFeedback !== null}
                                    className={`
                                        group relative flex items-center gap-4 text-left p-5 rounded-xl border transition-all duration-200
                                        ${showFeedback === null ? 'hover:border-(--green-base) hover:bg-(--bg-hover) hover:translate-x-1 active:scale-[0.99] cursor-pointer' : 'cursor-default'}
                                    `}
                                    style={{ borderColor, backgroundColor: bgColor, color: textColor }}
                                >
                                    <div className={`
                                        w-8 h-8 flex items-center justify-center rounded-lg border font-mono text-xs
                                        ${showFeedback === null ? 'border-(--bg-hover) group-hover:border-(--green-base) group-hover:bg-(--green-darkest)' : 'border-current'}
                                    `}>
                                        {String.fromCharCode(65 + i)}
                                    </div>
                                    <span className="flex-1 font-sans text-[15px]">{opt}</span>
                                    
                                    {showFeedback !== null && isCorrect && <Check className="text-(--green-light)" size={20} />}
                                    {showFeedback !== null && isSelected && !isCorrect && <X className="text-(--red)" size={20} />}
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>
        )
    }

    if (phase === 'puzzle') {
        // Selecciono el tipo basándome en el acto
        const puzzleType: Level['type'] = 
            level.act === 1 ? 'puzzle-match' : 
            level.act === 2 ? 'puzzle-sort' : 
            level.act === 3 ? 'puzzle-match' : 
            level.act === 4 ? 'puzzle-bug' : 
            level.act === 5 ? 'puzzle-fill' : 
            level.act === 6 ? 'puzzle-sort' : 
            'puzzle-match' // Acto 7 y fallback

        const miniLevel: Level = { ...level, type: puzzleType }
        return (
            <div className="flex-1 flex flex-col h-full animate-in slide-in-from-right duration-500">
                <div className="bg-(--bg-deep) py-2 px-8 border-b border-(--bg-hover) flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-(--green-light) animate-pulse shadow-[0_0_8px_var(--green-light)]" />
                        <span className="font-mono text-[10px] text-(--text-muted) tracking-widest uppercase">Fase 2: Resolución Ética de Puntos de Control</span>
                    </div>
                    <div className="text-[10px] font-mono text-(--green-base)">[ STATUS: SYNCING ]</div>
                </div>
                <PuzzleLevel 
                    level={miniLevel} 
                    state={state} 
                    onComplete={() => handlePuzzleComplete(3)} 
                    onFragUse={onFragUse} 
                />
            </div>
        )
    }

    if (phase === 'minigame') {
        const miniLevel: Level = {
            ...level,
            type: level.act === 1 ? 'lightbot' : level.act === 2 ? 'scratch' : level.act >= 4 ? 'codeeditor' : 'lightbot'
        }
        return (
            <div className="flex-1 flex flex-col h-full animate-in slide-in-from-bottom duration-700">
                 <div className="bg-(--bg-deep) py-2 px-8 border-b border-(--bg-hover) flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-(--amber) animate-pulse shadow-[0_0_8px_var(--amber)]" />
                        <span className="font-mono text-[10px] text-(--text-muted) tracking-widest uppercase">Fase 3: Ejecución de Rutina de Emergencia</span>
                    </div>
                    <div className="text-[10px] font-mono text-(--amber)">[ STATUS: OVERRIDE ]</div>
                </div>
                {level.act === 2 ? (
                     <ScratchLevel
                        level={miniLevel}
                        state={state}
                        onComplete={(s) => handleFinalComplete(s)}
                        onFragUse={onFragUse}
                    />
                ) : level.act >= 4 ? (
                    <CodeEditorLevel
                        level={miniLevel}
                        state={state}
                        onComplete={(s) => handleFinalComplete(s)}
                        onFragUse={onFragUse}
                    />
                ) : (
                    <LightbotLevel
                        level={miniLevel}
                        state={state}
                        onComplete={(s) => handleFinalComplete(s)}
                        onFragUse={onFragUse}
                    />
                )}
            </div>
        )
    }

    return null
}