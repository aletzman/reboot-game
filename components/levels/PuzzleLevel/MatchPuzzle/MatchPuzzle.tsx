import { useEffect, useState } from 'react'
import { OctagonAlert, RefreshCw } from 'lucide-react'
import { PuzzleLevelProps, PuzzleData, CONNECTION_COLORS, MATCH_RIGHT } from '../types'
import { PuzzleWrapper } from '../PuzzleWrapper'
import { TheoryButton } from '../../TheoryOverlay/TheoryButton'
import { MatchItem } from './MatchItem'
import { Screw } from '@/components/ui/Screw'
import { motion } from 'motion/react'
import { StatusMonitor } from './StatusMonitor'

interface ConnectionCoords {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}

export function MatchPuzzle({ level, state, data, onComplete }: PuzzleLevelProps & { data: PuzzleData }) {
    const rightItems = data.rightItems ?? MATCH_RIGHT[level.id] ?? []
    const [shuffledRight] = useState(() => [...rightItems].sort(() => Math.random() - 0.5))
    const [connections, setConnections] = useState<Record<string, string>>({})
    const [selectedLeft, setSelectedLeft] = useState<string | null>(null)
    const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle')
    const [correctCount, setCorrectCount] = useState(0)
    const [attempts, setAttempts] = useState(0)
    const [coords, setCoords] = useState<Record<string, ConnectionCoords>>({});

    // --- CÁLCULO DE COORDENADAS ---
    useEffect(() => {
        const updateCoords = () => {
            // Al crear un objeto vacío aquí, nos aseguramos de que 
            // cualquier conexión eliminada o cambiada desaparezca del estado de coordenadas.
            const newCoords: Record<string, ConnectionCoords> = {};
            const svgEl = document.getElementById("svg-canvas");
            const svgRect = svgEl?.getBoundingClientRect();

            if (!svgRect) return;

            // Iteramos sobre las conexiones ACTUALES
            Object.entries(connections).forEach(([leftId, rightId]) => {
                const leftEl = document.getElementById(leftId)?.querySelector("#led");
                const rightEl = document.getElementById(rightId)?.querySelector("#led");

                if (leftEl && rightEl) {
                    const r1 = leftEl.getBoundingClientRect();
                    const r2 = rightEl.getBoundingClientRect();

                    // Generamos la llave única para esta conexión
                    newCoords[`${leftId}-${rightId}`] = {
                        x1: r1.left - svgRect.left + r1.width / 2,
                        y1: r1.top - svgRect.top + r1.height / 2,
                        x2: r2.left - svgRect.left + r2.width / 2,
                        y2: r2.top - svgRect.top + r2.height / 2
                    };
                }
            });

            // IMPORTANTE: Sobrescribimos el estado completo. 
            // Si una conexión vieja ya no está en 'connections', no estará en 'newCoords'.
            setCoords(newCoords);
        };

        const timer = setTimeout(updateCoords, 50);
        window.addEventListener('resize', updateCoords);
        window.addEventListener('scroll', updateCoords, true);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', updateCoords);
            window.removeEventListener('scroll', updateCoords, true);
        };
    }, [connections, data]); // Al depender de 'connections', se limpia cada vez que cambias un cable.

    // --- HANDLERS ---
    function handleLeftClick(id: string) {
        if (feedback === 'correct') return;
        setSelectedLeft(prev => prev === id ? null : id)
    }

    function handleRightClick(rightId: string) {
        if (!selectedLeft || feedback === 'correct') return;

        setConnections(prev => {
            const newCons = { ...prev };

            // borramos cualquier conexión previa que apuntara a este mismo 'rightId'
            Object.keys(newCons).forEach(key => {
                if (newCons[key] === rightId) delete newCons[key];
            });

            newCons[selectedLeft] = rightId;
            return newCons;
        });

        setSelectedLeft(null);
    }

    function handleCheck() {
        if (!data.pairs) return

        let correct = 0
        data.pairs.forEach(pair => {
            if (connections[pair.leftId] === pair.rightId) correct++
        })

        setCorrectCount(correct)
        setAttempts(a => a + 1)

        if (correct === data.pairs.length) {
            setFeedback('correct')
            const stars = attempts === 0 ? 3 : attempts === 1 ? 2 : 1
            setTimeout(() => onComplete(stars as 1 | 2 | 3, state.fragUsed), 2000)
        } else {
            setFeedback('wrong')
            setTimeout(() => { setFeedback('idle') }, 3000)
        }
    }

    function handleReset() {
        setConnections({})
        setSelectedLeft(null)
        setFeedback('idle')
        setCorrectCount(0)
        setAttempts(0)
    }

    const allConnected = data.items.every(item => connections[item.id])
    const connectionCount = Object.keys(connections).length;
    const progress = (connectionCount / data.items.length) * 100;

    return (
        <PuzzleWrapper
            level={level}
            title="emparejar"
            onCheck={handleCheck}
            checkLabel="verificar pares"
            disabled={!allConnected || feedback === 'correct'}
        >
            <div className='flex flex-col gap-2 items-end w-full'>
                <TheoryButton onClick={handleReset} size='sm' color='warning' variant='outline' icon={RefreshCw}>
                    LIMPIAR TODO
                </TheoryButton>
                {/* DISPLAY CENTRAL DE ESTADO: MÓDULO DE SINCRONIZACIÓN CRT */}
                <StatusMonitor status={feedback} progress={progress} current={connectionCount} total={data.items.length} />
            </div>

            <div className="relative grid grid-cols-2 gap-x-12 gap-y-4 my-8">
                {/* COLUMNA IZQUIERDA */}
                <div className="flex flex-col gap-2.5 z-20">
                    {data.items.map((item, idx) => {
                        const isConnected = !!connections[item.id]
                        const relationColor = isConnected ? CONNECTION_COLORS[idx % CONNECTION_COLORS.length] : null
                        const isHinted = state.fragUsed && data.pairs?.[0]?.leftId === item.id && !isConnected

                        return (
                            <MatchItem
                                key={item.id}
                                id={item.id}
                                text={item.text}
                                isSelected={selectedLeft === item.id}
                                isConnected={isConnected}
                                isCorrect={feedback === 'correct' && isConnected}
                                isWrong={false}
                                isHinted={isHinted}
                                onClick={() => handleLeftClick(item.id)}
                                relationColor={relationColor}
                                isCode={item.isCode}
                            />
                        )
                    })}
                </div>

                {/* COLUMNA DERECHA */}
                <div className="flex flex-col gap-2.5 z-20">
                    {shuffledRight.map(item => {
                        const connectedLeftId = Object.entries(connections).find(([, v]) => v === item.id)?.[0]
                        const isConnectedTo = !!connectedLeftId
                        const leftIdx = connectedLeftId ? data.items.findIndex(i => i.id === connectedLeftId) : -1
                        const relationColor = isConnectedTo ? CONNECTION_COLORS[leftIdx % CONNECTION_COLORS.length] : null
                        const isHinted = state.fragUsed && data.pairs?.[0]?.rightId === item.id && !isConnectedTo

                        return (
                            <MatchItem
                                key={item.id}
                                id={item.id}
                                isRight
                                selectedLeft={!!selectedLeft}
                                text={item.text}
                                isConnectedTo={isConnectedTo}
                                isCorrect={feedback === 'correct' && isConnectedTo}
                                isWrong={false}
                                isHinted={isHinted}
                                onClick={() => handleRightClick(item.id)}
                                relationColor={relationColor}
                                isCode={item.isCode ?? data.isCode}
                            />
                        )
                    })}
                </div>

                {/* SVG DE CONEXIONES LÁSER */}
                <svg
                    id="svg-canvas"
                    className="absolute inset-0 pointer-events-none z-10 overflow-visible"
                    width="100%"
                    height="100%"
                >
                    {Object.entries(connections).map(([leftId, rightId]) => {
                        const c = coords[`${leftId}-${rightId}`];
                        if (!c) return null;

                        const leftIdx = data.items.findIndex(i => i.id === leftId);
                        const relationColor = CONNECTION_COLORS[leftIdx % CONNECTION_COLORS.length];

                        return (
                            <g key={`${leftId}-${rightId}`} className="transition-all duration-500">
                                <line
                                    x1={c.x1} y1={c.y1} x2={c.x2} y2={c.y2}
                                    stroke={relationColor}
                                    strokeWidth={6}
                                    strokeLinecap="round"
                                    className="opacity-20 blur-[3px]"
                                />
                                <line
                                    x1={c.x1} y1={c.y1} x2={c.x2} y2={c.y2}
                                    stroke={relationColor}
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    className="drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]"
                                />
                            </g>
                        );
                    })}
                </svg>
            </div>
        </PuzzleWrapper>
    )
}