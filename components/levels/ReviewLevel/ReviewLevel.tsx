'use client'

import { useState, useMemo } from 'react'
import { Activity, Zap } from 'lucide-react'
import type { Level } from '@/types/game'
import dynamic from 'next/dynamic'
import { IntroPhase } from './IntroPhase'
import { QuizPhase } from './QuizPhase'
import { DEFAULT_REVIEW_DATA } from './constants'
import { ReviewLevelProps, Phase } from './types'

// ------------------------------------------------------------
// IMPORTS DINÁMICOS — para las fases finales
// ------------------------------------------------------------

const LightbotLevel = dynamic(() => import('@/components/levels/LightBotLevel/LightBotLevel'), { ssr: false })
const ScratchLevel = dynamic(() => import('@/components/levels/ScratchLevel/ScratchLevel'), { ssr: false })
const PuzzleLevel = dynamic(() => import('@/components/levels/PuzzleLevel/PuzzleLevel'), { ssr: false })
const CodeEditorLevel = dynamic(() => import('@/components/levels/CodeEditorLevel/CodeEditorLevel'), { ssr: false })

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
        setPhase('minigame')
    }

    function handleFinalComplete(stars: number) {
        // Cálculo final de estrellas basado en las 3 fases
        const correctCount = answers.filter(a => a).length
        const totalQ = questions.length || 1
        
        // Simplificado: 3 estrellas si acertaste todo y pasaste el minijuego
        const finalStars = correctCount === totalQ ? 3 : correctCount >= totalQ / 2 ? 2 : 1
        
        onComplete(finalStars as 0|1|2|3, state.fragUsed)
    }

    // ------------------------------------------------------------
    // RENDERS DE FASE
    // ------------------------------------------------------------

    if (phase === 'intro') {
        return <IntroPhase level={level} onStart={handleStart} />
    }

    if (phase === 'quiz') {
        return (
            <QuizPhase 
                question={questions[currentQuestion]}
                currentQuestion={currentQuestion}
                totalQuestions={questions.length}
                showFeedback={showFeedback}
                onAnswer={handleAnswer}
            />
        )
    }

    if (phase === 'puzzle') {
        const puzzleType: Level['type'] = 
            level.act === 1 ? 'puzzle-match' : 
            level.act === 2 ? 'puzzle-sort' : 
            level.act === 3 ? 'puzzle-match' : 
            level.act === 4 ? 'puzzle-bug' : 
            level.act === 5 ? 'puzzle-fill' : 
            level.act === 6 ? 'puzzle-sort' : 
            'puzzle-match'

        const miniLevel: Level = { ...level, type: puzzleType }
        return (
            <div className="flex-1 flex flex-col h-full animate-in slide-in-from-right duration-500">
                <div className="bg-(--bg-surface) py-3 px-8 border-b border-(--bg-hover) flex justify-between items-center shrink-0 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-(--green-light) opacity-40 shadow-[0_0_15px_rgba(85,226,0,0.4)]" />
                    <div className="flex items-center gap-4">
                        <div className="bg-(--green-darkest) p-1.5 border border-(--green-dark) rounded-xs">
                            <Activity size={14} className="text-(--green-light) animate-pulse" />
                        </div>
                        <div className="flex flex-col -gap-1">
                            <span className="font-mono text-[9px] text-(--text-ghost) uppercase tracking-widest leading-none mb-1">protocol_phase_02</span>
                            <span className="font-mono text-[11px] text-(--text-primary) font-bold uppercase tracking-widest">Resolución Ética de Puntos de Control</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex flex-col items-end">
                            <span className="font-mono text-[8px] text-(--text-ghost) uppercase">latency</span>
                            <span className="font-mono text-[10px] text-(--green-muted)">08ms</span>
                        </div>
                        <div className="px-3 py-1 bg-(--bg-deep) border border-(--bg-hover) rounded-xs font-mono text-[10px] text-(--green-base) tracking-tighter">
                            [ STATUS: SYNCING ]
                        </div>
                    </div>
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
                <div className="bg-(--bg-surface) py-3 px-8 border-b border-(--bg-hover) flex justify-between items-center shrink-0 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-(--amber) opacity-40 shadow-[0_0_15px_rgba(239,159,39,0.4)]" />
                    <div className="flex items-center gap-4">
                        <div className="bg-(--green-darkest) p-1.5 border border-(--green-dark) rounded-xs">
                            <Zap size={14} className="text-(--amber) animate-pulse" />
                        </div>
                        <div className="flex flex-col -gap-1">
                            <span className="font-mono text-[9px] text-(--text-ghost) uppercase tracking-widest leading-none mb-1">protocol_phase_03</span>
                            <span className="font-mono text-[11px] text-(--text-primary) font-bold uppercase tracking-widest">Ejecución de Rutina de Emergencia</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex flex-col items-end">
                            <span className="font-mono text-[8px] text-(--text-ghost) uppercase">threat_lvl</span>
                            <span className="font-mono text-[10px] text-(--red)">CRITICAL</span>
                        </div>
                        <div className="px-3 py-1 bg-(--bg-deep) border border-(--amber)/20 rounded-xs font-mono text-[10px] text-(--amber) tracking-tighter shadow-[0_0_10px_rgba(239,159,39,0.1)]">
                            [ STATUS: OVERRIDE ]
                        </div>
                    </div>
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
