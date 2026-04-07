'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import dynamic from 'next/dynamic'
import type { Level, LevelState, Card, GameObject, LevelFailContext } from '@/types/game'
import {
    checkLevelAccess,
    initLevelState,
    completeLevel,
    getReviewHint,
} from '@/lib/levelEngine'
import { requiresLogin, getSave } from '@/lib/gameState'
import LevelComplete from '@/components/ui/LevelComplete'
import { Loading } from '@/components/ui/Loading'
import { useUIStore } from '@/lib/store/useUIStore'

// ------------------------------------------------------------
// IMPORTS DINÁMICOS — cada componente solo carga cuando se necesita
// ------------------------------------------------------------

const CinematicLevel = dynamic(() => import('@/components/levels/CinematicLevel/CinematicLevel'), { ssr: false })
const NodeRoutineLevel = dynamic(() => import('@/components/levels/NodeRoutineLevel/NodeRoutineLevel'), { ssr: false })
const LogicAssemblyLevel = dynamic(() => import('@/components/levels/LogicAssemblyLevel/LogicAssemblyLevel'), { ssr: false })
const PuzzleLevel = dynamic(() => import('@/components/levels/PuzzleLevel/PuzzleLevel'), { ssr: false })
const SpeedTypingLevel = dynamic(() => import('@/components/levels/SpeedTypingLevel/SpeedTypingLevel'), { ssr: false })
const CodeEditorLevel = dynamic(() => import('@/components/levels/CodeEditorLevel/CodeEditorLevel'), { ssr: false })
const DecisionLevel = dynamic(() => import('@/components/levels/DecisionLevel/DecisionLevel'), { ssr: false })
const ReviewLevel = dynamic(() => import('@/components/levels/ReviewLevel'), { ssr: false })
const TheoryOverlay = dynamic(() => import('@/components/levels/TheoryOverlay/TheoryOverlay'), { ssr: false })

// ------------------------------------------------------------
// TIPOS
// ------------------------------------------------------------

interface PageProps {
    initialLevel: Level
    allLevels: Level[]
    allCards: Card[]
    allObjects: GameObject[]
}

type PageStatus =
    | 'loading'
    | 'blocked-objects'
    | 'blocked-login'
    | 'blocked-sequence'
    | 'playing'
    | 'complete'
    | 'error'

// ------------------------------------------------------------
// COMPONENTE PRINCIPAL
// ------------------------------------------------------------

export default function LevelPage({
    initialLevel,
    allLevels,
    allCards,
    allObjects
}: PageProps) {
    const levelId = initialLevel.id
    const router = useRouter()

    const [pageStatus, setPageStatus] = useState<PageStatus>('loading')
    const [level, setLevel] = useState<Level | null>(initialLevel)
    const [levelState, setLevelState] = useState<LevelState | null>(() => initLevelState(initialLevel))
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

    const pathname = usePathname()

    useEffect(() => {
        // Al recibir los props del servidor, ya tenemos el level disponible
        setLevel(initialLevel)

        // verificar login
        if (requiresLogin(initialLevel.id)) {
            const save = getSave()
            if (!save?.player?.name) {
                setPageStatus('blocked-login')
                return
            }
        }

        // verificar acceso dinámico recurriendo a los props
        const access = checkLevelAccess(initialLevel.id, allLevels)
        if (!access.allowed) {
            if (access.blockedBy === 'missing-objects') {
                setMissing(access.missingObjectNames ?? [])
                setPageStatus('blocked-objects')
            } else if (access.blockedBy === 'locked') {
                setPageStatus('blocked-sequence')
            } else {
                setPageStatus('error')
            }
            return
        }

        setLevelState(initLevelState(initialLevel))
        setPageStatus('playing')

        if (initialLevel.theory && initialLevel.theory.length > 0) {
            setShowingTheory(true)
        }
    }, [pathname, initialLevel, allLevels])

    const [customCompletionContent, setCustomContent] = useState<React.ReactNode>(null)

    // ------------------------------------------------------------
    // HANDLERS
    // ------------------------------------------------------------

    function handleComplete(stars: 0 | 1 | 2 | 3, usedFrag: boolean, customContent?: React.ReactNode) {
        if (!level) return
        const result = completeLevel(level, stars, usedFrag, allLevels, allCards, allObjects)
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

    function handleStatusChange(status: LevelState['status'], reason?: LevelState['failReason'], context?: LevelFailContext) {
        setLevelState(prev => prev ? { ...prev, status, failReason: reason, failContext: context } : prev)
    }

    const setFragHint = useUIStore((state) => state.setActiveFragHint)
    const setDirectives = useUIStore((state) => state.setDirectivesState)

    // Al calcular el hint de FRAG, priorizamos los errores específicos
    const fragErrorHint = useMemo(() => {
        if (levelState?.status !== 'failed' || !levelState.failReason) return null
        const ctx = levelState.failContext

        switch (levelState.failReason) {
            case 'infinite-loop': {
                const panels = ctx?.involvedPanels?.map(p => p.toUpperCase()).join(" y ") || "tus funciones"
                return `¡Cuidado! Tu secuencia de órdenes ha caído en un camino sin salida que vuelve siempre al principio. Parece que ${panels} se están llamando entre sí sin poder parar. ¡Dales una forma de terminar!`
            }
            case 'out-of-bounds': {
                const coords = ctx?.coords ? ` en las coordenadas X:${ctx.coords.x}, Y:${ctx.coords.y}` : ""
                return `¡Uy! El robot ha intentado moverse a una zona sin conexión${coords}. Revisa bien tus giros y pasos para que siempre se mantenga dentro de las baldosas seguras.`
            }
            case 'timeout':
                return "¡Vaya! El robot ha tardado demasiado tiempo en terminar su tarea. Puede que la lista de órdenes sea demasiado larga o que se haya quedado esperando algo que no sucede."
            default:
                return null
        }
    }, [levelState?.status, levelState?.failReason, levelState?.failContext])

    const fragHintToDisplay = fragErrorHint || randomizedFragHint

    // Sincronizar el hint con el store en caso de fallo
    useEffect(() => {
        if (levelState?.status === 'failed' && fragHintToDisplay) {
            setFragHint(fragHintToDisplay)
            setDirectives(true, 'info')
        }
    }, [levelState?.status, fragHintToDisplay, setFragHint, setDirectives])

    // ------------------------------------------------------------
    // HANDLERS
    // ------------------------------------------------------------

    function handleNext() {
        if (!completionResult?.nextLevelId) {
            router.push(`/game/${level?.act ?? 0}`)
            return
        }

        const nextLevelId = completionResult.nextLevelId
        const nextLevel = allLevels.find(l => l.id === nextLevelId)
        const targetAct = nextLevel?.act ?? level?.act ?? 0

        if (completionResult.suggestRedirect) {
            const suggestLevel = allLevels.find(l => l.id === completionResult.suggestRedirect)
            const suggestAct = suggestLevel?.act ?? targetAct
            router.push(`/game/${suggestAct}/level/${completionResult.suggestRedirect}`)
        } else if (nextLevelId) {
            router.push(`/game/${targetAct}/level/${nextLevelId}`)
        } else {
            router.push(`/game/${targetAct}`)
        }
    }

    function handleGoToMap() {
        router.push(`/game/${level?.act ?? 0}`)
    }

    function handleRetry() {
        if (!level) return
        setShowComplete(false)
        setResult(null)
        setLevelState(initLevelState(level))
        setResetKey(prev => prev + 1)

        // Limpiar hints de FRAG
        setFragHint(null)
        setDirectives(false)
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

    if (pageStatus === 'blocked-sequence') {
        return (
            <BlockedScreen
                title="SISTEMA BLOQUEADO"
                message="Completa los niveles anteriores de este sector para habilitar el acceso a este nodo."
                onBack={() => router.push(`/game/${level?.act ?? 0}`)}
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

    const reviewHint = getReviewHint(levelId, allLevels)
    const fragHint = level.fragAvailable && levelState.status === 'failed' ? fragHintToDisplay : ""

    if (showingTheory && level.theory) {
        return (
            <TheoryOverlay theory={level.theory} onComplete={() => setShowingTheory(false)} />
        )
    }


    return (
        <div className="flex flex-col h-[calc(100svh-var(--header-height))] bg-(--bg-void)">
            {/*showingTheory && level.theory && (
                <TheoryOverlay theory={level.theory} onComplete={() => setShowingTheory(false)} />
            )*/}

            <main key={resetKey} className="flex-1 flex flex-col">
                {renderLevelComponent(level, levelState, handleComplete, handleFragUse, handleStatusChange)}
            </main>

            {showComplete && completionResult && (
                <LevelComplete
                    stars={completionResult.stars}
                    levelType={level.type}
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
    onStatusChange: (status: LevelState['status'], reason?: LevelState['failReason']) => void,
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
    return (
        <Loading
            message="Sincronizando con FRAG..."
            variant="frag"
            showTips={true}
            icon="cpu"
        />
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
        <div className="flex flex-col items-center justify-center bg-(--bg-void) font-mono gap-4 p-8 text-center">
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
