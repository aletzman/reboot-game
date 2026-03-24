// ============================================================
// REBOOT — app/level/[id]/page.tsx
// Página dinámica de nivel — conecta todo
// ============================================================

'use client'

import { useEffect, useState } from 'react'
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

// ------------------------------------------------------------
// IMPORTS DINÁMICOS — cada componente solo carga cuando se necesita
// ------------------------------------------------------------

const CinematicLevel = dynamic(() => import('@/components/levels/CinematicLevel'), { ssr: false })
const LightbotLevel = dynamic(() => import('@/components/levels/LightBotLevel'), { ssr: false })
const ScratchLevel = dynamic(() => import('@/components/levels/ScratchLevel'), { ssr: false })
const PuzzleLevel = dynamic(() => import('@/components/levels/PuzzleLevel'), { ssr: false })
const SpeedTypingLevel = dynamic(() => import('@/components/levels/SpeedTypingLevel'), { ssr: false })
const CodeEditorLevel = dynamic(() => import('@/components/levels/CodeEditorLevel'), { ssr: false })
const DecisionLevel = dynamic(() => import('@/components/levels/DecisionLevel'), { ssr: false })
const ReviewLevel = dynamic(() => import('@/components/levels/ReviewLevel'), { ssr: false })

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

    console.log(levelId)

    const [pageStatus, setPageStatus] = useState<PageStatus>('loading')
    const [level, setLevel] = useState<Level | null>(null)
    const [levelState, setLevelState] = useState<LevelState | null>(null)
    const [missingObjects, setMissing] = useState<string[]>([])
    const [showComplete, setShowComplete] = useState(false)
    const [completionResult, setResult] = useState<ReturnType<typeof completeLevel> | null>(null)
    const [resetKey, setResetKey] = useState(0)

    // ------------------------------------------------------------
    // INICIALIZACIÓN
    // ------------------------------------------------------------

    useEffect(() => {
        const found = getLevelById(levelId)
        console.log("found", found)
        if (!found) {
            setPageStatus('error')
            return
        }
        setLevel(found)

        // verificar login si el nivel lo requiere
        if (requiresLogin(levelId)) {
            const save = getSave()
            // TODO: reemplazar con verificación real de Supabase auth
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
    }, [levelId])

    // ------------------------------------------------------------
    // HANDLERS — los componentes de nivel llaman a estos callbacks
    // ------------------------------------------------------------

    function handleComplete(stars: 0 | 1 | 2 | 3, usedFrag: boolean) {
        if (!level) return
        const result = completeLevel(levelId, stars, usedFrag)
        setResult(result)

        // actualizar estado local
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

    function handleHintUsed() {
        setLevelState(prev => prev ? {
            ...prev,
            hintsUsed: prev.hintsUsed + 1,
        } : prev)
    }

    function handleNext() {
        if (!completionResult?.nextLevelId) {
            router.push('/game')
            return
        }
        // si hay sugerencia de repaso, mostrarla antes de avanzar
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
    // RENDER — estados de carga y bloqueo
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

    // objetos de pista disponibles para este nivel
    const hintObjects = getAvailableHintObjects(levelId)
    const reviewHint = getReviewHint(levelId)

    // ------------------------------------------------------------
    // RENDER — nivel activo
    // ------------------------------------------------------------

    return (
        <div className="flex flex-col h-[calc(100svh-47px)] bg-(--bg-void)">
            {/* <GameHeader /> */}

            {/* Narrativa del nivel */}
            {level.narrative && pageStatus === 'playing' && (
                <NarrativeBanner text={level.narrative} />
            )}

            {/* Componente del nivel según type */}
            <main key={resetKey} className="flex-1 flex flex-col">
                {renderLevelComponent(level, levelState, handleComplete, handleFragUse)}
            </main>

            {/* FRAG — solo si el nivel lo permite y no se ha usado */}
            {level.fragAvailable && !levelState.fragUsed && (
                <FragAssistant
                    hint={level.fragHint ?? ''}
                    onUse={handleFragUse}
                />
            )}

            {/* Modal de nivel completo */}
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
                />
            )}
        </div>
    )
}

// ------------------------------------------------------------
// SELECTOR DE COMPONENTE POR TYPE
// ------------------------------------------------------------

function renderLevelComponent(
    level: Level,
    state: LevelState,
    onComplete: (stars: 0 | 1 | 2 | 3, usedFrag: boolean) => void,
    onFragUse: () => void,
) {
    const commonProps = { level, state, onComplete, onFragUse }

    console.log(level)

    switch (level.type) {
        case 'cinematic': return <CinematicLevel   {...commonProps} />
        case 'lightbot': return <LightbotLevel    {...commonProps} />
        case 'scratch': return <ScratchLevel     {...commonProps} />
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
// COMPONENTES DE UI INTERNOS
// ------------------------------------------------------------

function LoadingScreen() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-(--bg-void) font-mono text-(--green-base) text-[12px] tracking-[.14em]">
            cargando nivel...
        </div>
    )
}

function ErrorScreen({ message }: { message: string }) {
    return (
        <div className="p-8 font-mono text-(--red) text-[12px]">
            ERROR: {message}
        </div>
    )
}

interface BlockedScreenProps {
    title: string
    message: string
    items?: string[]
    onBack: () => void
    onInventory?: () => void
    onLogin?: () => void
}

function BlockedScreen({ title, message, items, onBack, onInventory, onLogin }: BlockedScreenProps) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-(--bg-void) font-mono gap-4 p-8">
            <div className="text-(--red) text-[11px] tracking-[.14em]">
                // {title}
            </div>
            <div className="text-(--text-muted) text-[13px] text-center">
                {message}
            </div>
            {items && items.length > 0 && (
                <div className="flex flex-col gap-[.375rem]">
                    {items.map(item => (
                        <div key={item} className="bg-(--bg-surface) border border-(--bg-hover) rounded-[6px] py-[6px] px-[14px] text-[12px] text-(--amber)">
                            {item}
                        </div>
                    ))}
                </div>
            )}
            <div className="flex gap-3 mt-2 flex-wrap justify-center">
                <button
                    onClick={onBack}
                    className="bg-(--bg-surface) border border-(--bg-hover) rounded-[6px] py-2 px-5 font-mono text-[12px] text-(--text-muted) cursor-pointer tracking-wide hover:bg-(--bg-hover) transition-colors"
                >
                    ← volver al mapa
                </button>
                {onInventory && (
                    <button
                        onClick={onInventory}
                        className="bg-(--bg-surface) border border-(--green-base) rounded-[6px] py-2 px-5 font-mono text-[12px] text-(--green-light) cursor-pointer tracking-wide hover:bg-(--green-dark) transition-colors"
                    >
                        ver inventario
                    </button>
                )}
                {onLogin && (
                    <button
                        onClick={onLogin}
                        className="bg-(--green-dark) border border-(--green-base) rounded-[6px] py-2 px-5 font-mono text-[12px] text-(--green-light) cursor-pointer tracking-wide hover:bg-(--green-base) transition-colors"
                    >
                        identificarse
                    </button>
                )}
            </div>
        </div>
    )
}

function NarrativeBanner({ text }: { text: string }) {
    const [visible, setVisible] = useState(true)
    if (!visible) return null
    return (
        <div className="bg-(--bg-surface) border-b border-(--bg-hover) py-2.5 px-5 flex items-center justify-between gap-4">
            <button
                onClick={() => setVisible(false)}
                className="bg-transparent border-none text-(--text-ghost) text-[11px] cursor-pointer font-mono shrink-0 hover:text-(--text-muted)"
            >
                [x]
            </button>
            <div className="font-mono text-[11px] text-(--purple) tracking-wide leading-relaxed flex-1">
                {text.split('\n')[0]}
            </div>
        </div>
    )
}