
import { useState } from 'react'
import { LevelHeader } from '../LevelHeader'
import { ConceptTrialLevelProps } from './types'
import { TheoryButton } from '../TheoryOverlay/TheoryButton'
import { Activity, Check, ChevronLeft, ChevronRight, Lightbulb, Network } from 'lucide-react'
import { FragLogo } from '@/components/frag/FragLogo'
import { PUZZLE_DATA } from '../PuzzleLevel/types'
import { DragDropProvider } from '@dnd-kit/react'
import { SortableItem } from './SortableItem'
import { DroppableArea } from './DroppableArea/DroppableArea'

export default function ConceptTrialLevel({ level, state, onComplete, onFragUse, onStatusChange }: ConceptTrialLevelProps) {
    const [currentStep, setCurrentStep] = useState(0)
    const [isCorrect, setIsCorrect] = useState(false)
    let data = PUZZLE_DATA[level.id]
    const randomOrder = data?.items?.sort(() => Math.random() - 0.5) || []
    const randomOrderRight = data?.rightItems?.sort(() => Math.random() - 0.5) || []

    const handleValidate = (isCorrect: boolean) => {
        setIsCorrect(isCorrect)
        if (isCorrect) {
            onStatusChange('success')
            //onComplete(3, state.fragUsed)
        }

    }

    return (
        <div>
            <LevelHeader level={level} status={state.status} isRunning={state.status === 'playing'} />
            <div className="flex flex-col p-2 md:p-8">
                <div className="relative flex flex-col justify-between bg-(--bg-elevated) h-[calc(100svh-250px)] w-full max-w-6xl mx-auto">

                    {level.theory && level.theory.length > 0 && (
                        <>
                            <header className="flex items-center gap-4 px-6 py-4 bg-(--bg-surface) border-b border-(--border-color)">
                                <div className='border border-(--purple)/35 p-2 shadow-[inset_0_0_25px_rgba(127,119,221,0.2)]'>
                                    <Network className="w-6 h-6 text-(--purple)" />
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <span className="text-xs uppercase font-bold tracking-[0.2em] text-(--purple)">
                                            Pensar_como_una_Máquina
                                        </span>
                                        <div className="h-px w-8 bg-(--purple)/30" />
                                        <Activity size={10} className="text-(--purple)" />
                                    </div>
                                    <h2 className="text-2xl font-bold font-(family-name:--font-title) text-(--text-primary)">
                                        {level.concept}
                                    </h2>
                                </div>
                            </header>
                            <div className="flex flex-col items-center gap-8">
                                <h2 className='text-4xl font-bold font-(family-name:--font-title)'> {level.theory[currentStep]?.title}</h2>
                                <p className="max-w-[64ch] text-(--text-primary)/85 text-pretty mx-0">{level.theory[currentStep]?.content}</p>
                                {currentStep === 0 && level.narrative && (
                                    <div className="relative flex items-center justify-center flex-row gap-6 mt-18">
                                        <div className="absolute -left-4 top-0 bottom-0 w-0.5 bg-linear-to-b from-(--purple)/60 via-(--purple)/10 to-transparent" />
                                        <FragLogo size={65} />
                                        <p className="max-w-[64ch] text-pretty mx-0">{level.narrative}</p>
                                    </div>

                                )}
                                {level.theory[currentStep]?.explanation && (
                                    <p className="max-w-[64ch] text-pretty mx-0">{level.theory[currentStep]?.explanation}</p>
                                )}
                                <DragDropProvider>
                                    {level.id === '3-01' && currentStep === 1 &&
                                        <div className="flex flex-row items-center max-w-sm w-full">
                                            <div className="flex flex-col gap-2">
                                                {Array.from({ length: 5 }).map((_, index) => (
                                                    <div key={index} className="flex flex-col items-center justify-center h-11 w-11">
                                                        <span className="text-(--text-primary)/85 font-bold">{index + 1}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex flex-col justify-center gap-2 w-full">
                                                {data && data.items && (
                                                    randomOrder.map((item, index) => (
                                                        <SortableItem key={item.id} item={item} index={index} />
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    }
                                </DragDropProvider>
                                {level.id === '3-02' && currentStep === 1 &&
                                    <DroppableArea
                                        items={randomOrderRight}
                                        boxes={randomOrder}
                                        pairs={data?.pairs || []}
                                        originLabel="Datos"
                                        onValidate={handleValidate}
                                    />
                                }
                            </div>
                        </>
                    )}

                    <footer className="flex justify-between p-4 bg-(--bg-surface) border-t border-(--border-color)">
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center w-32">
                                <span className="text-sm text-(--text-muted) font-mono">COMPLETADO:</span>
                                <span className="text-sm text-(--purple) font-mono">{Math.round(((currentStep + 1) / 3) * 100)}%</span>
                            </div>
                            <div className="flex gap-1">
                                {[0, 1, 2].map((i) => (
                                    <div
                                        key={i}
                                        className={`h-2 transition-all duration-500 rounded-xs ${i === currentStep
                                            ? 'w-6 bg-(--purple) shadow-[0_0_10px_rgba(127,119,221,0.5)]'
                                            : i < currentStep ? 'w-4 bg-(--purple)/40' : 'w-4 bg-(--bg-hover)'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-2">
                            {currentStep > 0 && (
                                <TheoryButton
                                    color='primary'
                                    onClick={() => setCurrentStep(currentStep - 1)}
                                    icon={ChevronLeft}
                                    disabled={currentStep === 0}>
                                    Anterior
                                </TheoryButton>
                            )}
                            {currentStep < level.theory!.length - 1 && (
                                <TheoryButton
                                    color='primary'
                                    onClick={() => setCurrentStep(currentStep + 1)}
                                    icon={ChevronRight}
                                    iconPosition='right'
                                    disabled={currentStep === 2 || (currentStep === 1 && !isCorrect)}   >
                                    Siguiente
                                </TheoryButton>
                            )}
                            {currentStep === 2 && (
                                <TheoryButton
                                    color='success'
                                    icon={Check}
                                    iconPosition='right'
                                    onClick={() => onComplete(3, state.fragUsed)}>
                                    Completar
                                </TheoryButton>
                            )}
                        </div>
                    </footer>
                    {/* Tactical Frame Elements */}
                    <div className="absolute -top-px -left-px w-12 h-12 border-t-2 border-l-2 border-(--purple)/50 z-10" />
                    <div className="absolute -top-px -right-px w-12 h-12 border-t-2 border-r-2 border-(--purple)/50 z-10" />
                    <div className="absolute -bottom-px -left-px w-12 h-12 border-b-2 border-l-2 border-(--purple)/50 z-10" />
                    <div className="absolute -bottom-px -right-px w-12 h-12 border-b-2 border-r-2 border-(--purple)/50 z-10" />
                </div>
            </div>
        </div>
    )
}