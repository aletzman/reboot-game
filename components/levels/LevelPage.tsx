// ============================================================
// REBOOT — app/level/[id]/page.tsx
// Página dinámica de nivel — conecta todo
// ============================================================

'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import type { Level, LevelState } from '@/types/game'
import {
    getLevelById,
    checkLevelAccess,
    initLevelState,
    completeLevel,
    getReviewHint,
    getAvailableHintObjects,
    LEVEL_COMPONENT_MAP,
} from '@/lib/levelEngine'
import { requiresLogin, getSave } from '@/lib/gameState'
import { Header as GameHeader } from '@/components/ui/Header'
import LevelComplete from '@/components/ui/LevelComplete'
import FragAssistant from '@/components/frag/FragAssistant'
import dialogues from '@/data/dialogues.json'
import { Radio, X as CloseIcon } from 'lucide-react'

// ------------------------------------------------------------
// IMPORTS DINÁMICOS — cada componente solo carga cuando se necesita
// ------------------------------------------------------------

const CinematicLevel = dynamic(() => import('@/components/levels/CinematicLevel/CinematicLevel'), { ssr: false })
const NodeRoutineLevel = dynamic(() => import('@/components/levels/NodeRoutineLevel/NodeRoutineLevel'), { ssr: false })
const LogicAssemblyLevel = dynamic(() => import('@/components/levels/LogicAssemblyLevel/LogicAssemblyLevel'), { ssr: false })
const PuzzleLevel = dynamic(() => import('@/components/levels/PuzzleLevel/PuzzleLevel'), { ssr: false })
const SpeedTypingLevel = dynamic(() => import('@/components/levels/SpeedTypingLevel/SpeedTypingLevel'), { ssr: false })
const CodeEditorLevel = dynamic(() => import('@/components/levels/CodeEditorLevel/CodeEditorLevel'), { ssr: false })
const DecisionLevel = dynamic(() => import('@/components/levels/DecisionLevel'), { ssr: false })
const ReviewLevel = dynamic(() => import('@/components/levels/ReviewLevel'), { ssr: false })
const TheoryOverlay = dynamic(() => import('@/components/levels/TheoryOverlay/TheoryOverlay'), { ssr: false })

// ------------------------------------------------------------
// TIPOS
// ------------------------------------------------------------

interface PageProps {
    levelId: string
}

type PageStatus =
    | 'loading'
    | 'blocked-objects'
    | 'blocked-login'
    | 'playing'
    | 'complete'
    | 'error'

// ------------------------------------------------------------
// COMPONENTE PRINCIPAL
// ------------------------------------------------------------

export default function LevelPage({ levelId }: PageProps) {
    const router = useRouter()

    const [pageStatus, setPageStatus] = useState<PageStatus>('loading')
    const [level, setLevel] = useState<Level | null>(null)
    const [levelState, setLevelState] = useState<LevelState | null>(null)
    const [missingObjects, setMissing] = useState<string[]>([])
    const [showComplete, setShowComplete] = useState(false)
    const [completionResult, setResult] = useState<ReturnType<typeof completeLevel> | null>(null)
    const [resetKey, setResetKey] = useState(0)
    const [showingTheory, setShowingTheory] = useState(false)

    // Memoizar mensaje de FRAG para que sea estable durante el nivel pero aleatorio al inicio
    const randomizedFragHint = useMemo(() => {
        if (!level?.fragHint) return ''
        const hints = Array.isArray(level.fragHint) ? level.fragHint : [level.fragHint]
        return hints[Math.floor(Math.random() * hints.length)]
    }, [level?.id, levelState?.status])

    // ------------------------------------------------------------
    // INICIALIZACIÓN
    // ------------------------------------------------------------

    useEffect(() => {
        const found = getLevelById(levelId)
        if (!found) {
            setPageStatus('error')
            return
        }
        setLevel(found)

        // verificar login si el nivel lo requiere
        if (requiresLogin(levelId)) {
            const save = getSave()
            const isLoggedIn = !!save?.player?.name
            if (!isLoggedIn) {
                setPageStatus('blocked-login')
                return
            }
        }

        // verificar acceso
        const access = checkLevelAccess(levelId)
        if (!access.allowed) {
            if (access.blockedBy === 'missing-objects') {
                setMissing(access.missingObjectNames ?? [])
                setPageStatus('blocked-objects')
            } else {
                setPageStatus('error')
            }
            return
        }

        setLevelState(initLevelState(found))
        setPageStatus('playing')

        if (found.theory && found.theory.length > 0) {
            setShowingTheory(true)
        }
    }, [levelId])

    const [customCompletionContent, setCustomContent] = useState<React.ReactNode>(null)

    // ------------------------------------------------------------
    // HANDLERS
    // ------------------------------------------------------------

    function handleComplete(stars: 0 | 1 | 2 | 3, usedFrag: boolean, customContent?: React.ReactNode) {
        if (!level) return
        const result = completeLevel(levelId, stars, usedFrag)
        setResult(result)
        setCustomContent(customContent)

        setLevelState(prev => prev ? {
            ...prev,
            status: 'success',
            stars,
            fragUsed: usedFrag,
            unlockedCards: result.newCards,
            unlockedObjects: result.newObjects,
        } : prev)

        setShowComplete(true)
    }

    function handleFragUse() {
        setLevelState(prev => prev ? {
            ...prev,
            fragUsed: true,
            fragAvailableThisRun: false,
        } : prev)
    }

    function handleStatusChange(status: LevelState['status']) {
        setLevelState(prev => prev ? { ...prev, status } : prev)
    }

    function handleNext() {
        if (!completionResult?.nextLevelId) {
            router.push('/game')
            return
        }
        if (completionResult.suggestRedirect) {
            router.push(`/level/${completionResult.suggestRedirect}`)
        } else {
            router.push(`/level/${completionResult.nextLevelId}`)
        }
    }

    function handleGoToMap() {
        router.push('/game')
    }

    function handleRetry() {
        if (!level) return
        setShowComplete(false)
        setResult(null)
        setLevelState(initLevelState(level))
        setResetKey(prev => prev + 1)
    }

    // ------------------------------------------------------------
    // RENDER — estados
    // ------------------------------------------------------------

    if (pageStatus === 'loading') {
        return <LoadingScreen />
    }

    if (pageStatus === 'error') {
        return (
            <BlockedScreen
                title="NIVEL NO ENCONTRADO"
                message={`El nivel '${levelId}' no existe en el sistema.`}
                onBack={() => router.push('/game')}
            />
        )
    }

    if (pageStatus === 'blocked-objects') {
        return (
            <BlockedScreen
                title="ACCESO DENEGADO"
                message="Te faltan objetos para acceder a este nivel."
                items={missingObjects}
                onBack={() => router.push('/game')}
                onInventory={() => router.push('/collection')}
            />
        )
    }

    if (pageStatus === 'blocked-login') {
        return (
            <BlockedScreen
                title="IDENTIFICACIÓN REQUERIDA"
                message="Los sistemas avanzados requieren verificación de identidad."
                onBack={() => router.push('/game')}
                onLogin={() => router.push('/auth')}
            />
        )
    }

    if (!level || !levelState) return <LoadingScreen />

    const reviewHint = getReviewHint(levelId)

    return (
        <div className="flex flex-col h-[calc(100svh-47px)] bg-(--bg-void)">
            {showingTheory && level.theory && (
                <TheoryOverlay theory={level.theory} onComplete={() => setShowingTheory(false)} />
            )}

            <main key={resetKey} className="flex-1 flex flex-col">
                {renderLevelComponent(level, levelState, handleComplete, handleFragUse, handleStatusChange)}
            </main>

            {level.fragAvailable && levelState.status === 'failed' && (
                <FragAssistant
                    hint={randomizedFragHint}
                    onUse={handleFragUse}
                    autoOpen={true}
                    feedback="error"
                />
            )}

            {showComplete && completionResult && (
                <LevelComplete
                    stars={completionResult.stars}
                    newCards={completionResult.newCards}
                    newObjects={completionResult.newObjects}
                    secretCardUnlocked={completionResult.secretCardUnlocked}
                    reviewHint={reviewHint.shouldShow ? reviewHint : null}
                    onNext={handleNext}
                    onMap={handleGoToMap}
                    onRetry={handleRetry}
                >
                    {customCompletionContent}
                </LevelComplete>
            )}
        </div>
    )
}

function renderLevelComponent(
    level: Level,
    state: LevelState,
    onComplete: (stars: 0 | 1 | 2 | 3, usedFrag: boolean, customContent?: React.ReactNode) => void,
    onFragUse: () => void,
    onStatusChange: (status: LevelState['status']) => void,
) {
    const commonProps = { level, state, onComplete, onFragUse, onStatusChange }

    switch (level.type) {
        case 'cinematic': return <CinematicLevel   {...commonProps} />
        case 'noderoutine': return <NodeRoutineLevel    {...commonProps} />
        case 'logicassembly': return <LogicAssemblyLevel     {...commonProps} />
        case 'puzzle-sort':
        case 'puzzle-fill':
        case 'puzzle-bug':
        case 'puzzle-match': return <PuzzleLevel      {...commonProps} />
        case 'speedtyping': return <SpeedTypingLevel {...commonProps} />
        case 'codeeditor': return <CodeEditorLevel  {...commonProps} />
        case 'decision': return <DecisionLevel    {...commonProps} />
        case 'review': return <ReviewLevel      {...commonProps} />
        default: return <ErrorScreen message={`Tipo de nivel desconocido: ${level.type}`} />
    }
}

// ------------------------------------------------------------
// COMPONENTES DE UI
// ------------------------------------------------------------

function LoadingScreen() {
    const [tip, setTip] = useState<string>(dialogues.frag.ambient_tips[0])

    useEffect(() => {
        const tips = dialogues.frag.ambient_tips
        const randomTip = tips[Math.floor(Math.random() * tips.length)]
        setTip(randomTip)
    }, [])

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-(--bg-void) font-mono gap-6 p-8">
            <div className="relative">
                <div className="w-12 h-12 border-2 border-(--purple)/30 border-t-(--purple) rounded-full animate-spin" />
                <div className="absolute inset-0 bg-(--purple)/20 blur-xl rounded-full animate-pulse" />
            </div>

            <div className="flex flex-col items-center gap-2 max-w-[400px] text-center">
                <div className="text-(--purple) text-[11px] tracking-[.25em] uppercase font-bold animate-pulse">
                    Sincronizando con FRAG...
                </div>
                <div className="h-px w-24 bg-linear-to-r from-transparent via-(--purple)/40 to-transparent my-2" />
                <div className="text-(--text-muted) text-[12px] italic leading-relaxed px-4">
                    "{tip}"
                </div>
            </div>

            <div className="absolute bottom-12 flex flex-col items-center gap-1 opacity-40">
                <span className="text-[10px] text-(--text-ghost) tracking-widest uppercase font-bold">Cargando Búferes del Sector</span>
                <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-(--purple) animate-[loadingBar_2s_infinite]" />
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes loadingBar {
                    0% { width: 0%; transform: translateX(-100%); }
                    50% { width: 40%; transform: translateX(50%); }
                    100% { width: 100%; transform: translateX(200%); }
                }
            `}} />
        </div>
    )
}

function ErrorScreen({ message }: { message: string }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-(--bg-void) p-8 font-mono text-(--red) text-[12px]">
            ERROR: {message}
        </div>
    )
}

function BlockedScreen({ title, message, items, onBack, onInventory, onLogin }: {
    title: string; message: string; items?: string[]; onBack: () => void; onInventory?: () => void; onLogin?: () => void;
}) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-(--bg-void) font-mono gap-4 p-8 text-center">
            <div className="text-(--red) text-[11px] tracking-[.14em] uppercase font-bold text-center">
                // {title}
            </div>
            <div className="text-(--text-muted) text-[13px] max-w-md mx-auto">
                {message}
            </div>
            {items && items.length > 0 && (
                <div className="flex flex-col gap-2 my-2">
                    {items.map(item => (
                        <div key={item} className="bg-(--bg-surface) border border-(--bg-hover) rounded-md py-2 px-4 text-[12px] text-(--amber)">
                            {item}
                        </div>
                    ))}
                </div>
            )}
            <div className="flex gap-3 mt-4 flex-wrap justify-center">
                <button onClick={onBack} className="bg-(--bg-surface) border border-(--bg-hover) rounded-md py-2 px-5 text-[12px] text-(--text-muted) hover:bg-(--bg-hover) transition-all">
                    ← VOLVER AL MAPA
                </button>
                {onInventory && (
                    <button onClick={onInventory} className="bg-(--bg-surface) border border-(--green-base) rounded-md py-2 px-5 text-[12px] text-(--green-light) hover:bg-(--green-dark) transition-all">
                        VER INVENTARIO
                    </button>
                )}
                {onLogin && (
                    <button onClick={onLogin} className="bg-(--green-dark) border border-(--green-base) rounded-md py-2 px-5 text-[12px] text-(--green-light) hover:bg-(--green-base) transition-all">
                        IDENTIFICARSE
                    </button>
                )}
            </div>
        </div>
    )
}

function NarrativeBanner({ text }: { text: string }) {
    const [visible, setVisible] = useState(true)
    const isFrag = text.toUpperCase().startsWith('FRAG:') || text.startsWith('// FRAG')
    const displayText = isFrag ? text.replace(/^FRAG:\s*/i, '').replace(/^\/\/\s*FRAG\s*/i, '') : text
    const identity = dialogues.frag.identity

    if (!visible) return null

    return (
        <>
            {/* Overlay para cerrar al hacer click fuera */}
            <div
                className="fixed inset-0 z-190 bg-transparent cursor-default pointer-events-auto"
                onClick={() => setVisible(false)}
            />
            <div className="fixed top-20 left-1/2 -translate-x-1/2 z-200 w-full max-w-[500px] px-6 py-4 pointer-events-none group">
                <div className={`
                    bg-(--bg-elevated)/95 backdrop-blur-xl border border-(--purple)/40 rounded-xl p-5 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] pointer-events-auto relative overflow-hidden transition-all hover:scale-[1.02]
                    ${isFrag ? 'border-l-4 border-l-(--purple)' : 'border-t-2 border-t-(--purple)'}
                `}>
                    <div className="absolute inset-0 pointer-events-none opacity-5">
                        <div className="w-full h-[2px] bg-(--purple) animate-[scan_4s_linear_infinite]" />
                    </div>

                    <div className="flex items-center justify-between border-b border-(--purple)/10 pb-2 mb-4">
                        <div className="flex items-center gap-2.5 text-(--purple)">
                            <Radio size={14} className={isFrag ? "animate-pulse" : ""} />
                            <div className="flex flex-col">
                                <span className="font-mono text-[10px] font-bold tracking-[0.2em] uppercase">
                                    {isFrag ? identity.full_name : "SISTEMA_LOCAL"}
                                </span>
                                {isFrag && (
                                    <span className="font-mono text-[7px] opacity-60 tracking-wider">INTEGRIDAD: {identity.memory_integrity}</span>
                                )}
                            </div>
                        </div>
                        <button onClick={() => setVisible(false)} className="text-(--text-ghost) hover:text-(--red) transition-colors p-1">
                            <CloseIcon size={14} />
                        </button>
                    </div>

                    <div className={`font-mono text-[14px] text-(--text-primary) leading-relaxed ${isFrag ? 'italic pl-2' : ''}`}>
                        {isFrag && <span className="text-(--purple) font-mono mr-2">[{">"}]</span>}
                        {displayText}
                    </div>

                    <div className="flex justify-between items-end mt-5">
                        <div className="flex gap-1">
                            <div className="w-1 h-1 bg-(--purple)/30 rounded-full" />
                            <div className="w-1 h-1 bg-(--purple)/60 rounded-full" />
                            <div className="w-1 h-1 bg-(--purple) rounded-full animate-pulse" />
                        </div>
                        <button onClick={() => setVisible(false)} className="font-mono text-[9px] text-(--purple)/60 hover:text-(--purple) transition-all uppercase tracking-[.3em]">
                            [ ARCHIVAR_DATOS ]
                        </button>
                    </div>
                </div>

                <style dangerouslySetInnerHTML={{
                    __html: `
                    @keyframes scan {
                        0% { transform: translateY(-100%); }
                        100% { transform: translateY(400%); }
                    }
                `}} />
            </div>
        </>
    )
}