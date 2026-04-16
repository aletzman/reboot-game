import React, { useState } from "react";

type Action = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Mode = "sequence" | "function";

interface Props {
    mode?: Mode;
    onComplete?: (isCorrect: boolean) => void;
}

const CELL = 36;
const GAP = 4;
const GRID_COLS = 5;
const GRID_ROWS = 5;

const MOVE_MAP = {
    UP: { x: 0, y: -1 },
    DOWN: { x: 0, y: 1 },
    LEFT: { x: -1, y: 0 },
    RIGHT: { x: 1, y: 0 },
};

const REPETITIVE_SEQUENCE: Action[] = [
    "RIGHT", "DOWN",
    "RIGHT", "DOWN",
    "RIGHT", "DOWN",
    "RIGHT", "DOWN",
];

const FUNCTION_DEFINITION: Action[] = ["RIGHT", "DOWN"];
const FUNCTION_CALLS = ["FUNC", "FUNC", "FUNC", "FUNC"];

const goal = { x: 4, y: 4 };

// Convierte posición lógica a píxeles considerando el gap
const toPixel = (n: number) => n * (CELL + GAP);

// Grid reutilizable (solo las celdas, sin robot)
function GridCells({ highlightPos }: { highlightPos?: { x: number; y: number } }) {
    return (
        <>
            {[...Array(GRID_ROWS)].map((_, y) =>
                [...Array(GRID_COLS)].map((_, x) => {
                    const isGoal = goal.x === x && goal.y === y;
                    const isStart = x === 0 && y === 0;
                    const isHighlight = highlightPos?.x === x && highlightPos?.y === y;

                    return (
                        <div
                            key={`${x}-${y}`}
                            style={{
                                width: CELL,
                                height: CELL,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 16,
                                backgroundColor: isGoal
                                    ? "var(--green-dark)"
                                    : isStart
                                        ? "var(--surface-2)"
                                        : "var(--bg-elevated)",
                                border: `1px solid ${isHighlight ? "var(--green-light)" : "var(--border-color)"}`,
                                borderRadius: 4,
                            }}
                        >
                            {isGoal ? "🎯" : isStart ? "S" : ""}
                        </div>
                    );
                })
            )}
        </>
    );
}

// Wrapper del grid con robot absoluto encima
function GridWithRobot({
    robotPos,
    borderColor = "var(--green-light)",
    comparePos,
}: {
    robotPos: { x: number; y: number };
    borderColor?: string;
    comparePos?: { x: number; y: number }; // solo para modo comparación (robot en celda)
}) {
    const gridW = GRID_COLS * CELL + (GRID_COLS - 1) * GAP;
    const gridH = GRID_ROWS * CELL + (GRID_ROWS - 1) * GAP;

    return (
        <div
            style={{
                position: "relative",
                width: gridW + 8,
                height: gridH + 8,
                backgroundColor: "var(--bg-surface)",
                borderRadius: 4,
                padding: 0,
            }}
        >
            {/* Grid de celdas */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${GRID_COLS}, ${CELL}px)`,
                    gridTemplateRows: `repeat(${GRID_ROWS}, ${CELL}px)`,
                    gap: GAP,
                    position: "absolute",
                    top: 4,
                    left: 4,
                }}
            >
                <GridCells />
            </div>

            {/* Robot absoluto, perfectamente alineado */}
            <div
                style={{
                    position: "absolute",
                    width: CELL,
                    height: CELL,
                    top: toPixel(robotPos.y) + 4,
                    left: toPixel(robotPos.x) + 4,
                    transition: "top 0.4s ease, left 0.4s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                    border: `2px solid ${borderColor}`,
                    borderRadius: 4,
                    backgroundColor: "var(--bg-elevated)",
                    zIndex: 10,
                    pointerEvents: "none",
                }}
            >
                🤖
            </div>
        </div>
    );
}

export function FunctionPuzzle({ mode = "sequence", onComplete }: Props) {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [positionSeq, setPositionSeq] = useState({ x: 0, y: 0 });
    const [positionFunc, setPositionFunc] = useState({ x: 0, y: 0 });
    const [isRunning, setIsRunning] = useState(false);
    const [stepCount, setStepCount] = useState(0);
    const [stepCountSeq, setStepCountSeq] = useState(0);
    const [stepCountFunc, setStepCountFunc] = useState(0);

    const run = async () => {
        setIsRunning(true);
        setPosition({ x: 0, y: 0 });
        setStepCount(0);
        await new Promise((r) => setTimeout(r, 300));

        let pos = { x: 0, y: 0 };
        let steps = 0;

        const sequence =
            mode === "sequence"
                ? REPETITIVE_SEQUENCE
                : FUNCTION_CALLS.flatMap(() => FUNCTION_DEFINITION);

        for (const step of sequence) {
            const move = MOVE_MAP[step as Action];
            pos = { x: pos.x + move.x, y: pos.y + move.y };
            steps++;
            setPosition({ ...pos });
            setStepCount(steps);
            await new Promise((r) => setTimeout(r, 500));
        }

        onComplete?.(pos.x === goal.x && pos.y === goal.y);
        setIsRunning(false);
    };

    const runSequence = async () => {
        let pos = { x: 0, y: 0 };
        let steps = 0;
        for (const step of REPETITIVE_SEQUENCE) {
            const move = MOVE_MAP[step];
            pos = { x: pos.x + move.x, y: pos.y + move.y };
            steps++;
            setPositionSeq({ ...pos });
            setStepCountSeq(steps);
            await new Promise((r) => setTimeout(r, 200));
        }
    };

    const runFunction = async () => {
        let pos = { x: 0, y: 0 };
        let steps = 0;
        for (const _ of FUNCTION_CALLS) {
            for (const act of FUNCTION_DEFINITION) {
                const move = MOVE_MAP[act];
                pos = { x: pos.x + move.x, y: pos.y + move.y };
                steps++;
                setPositionFunc({ ...pos });
                setStepCountFunc(steps);
                await new Promise((r) => setTimeout(r, 200));
            }
        }
    };

    const runBoth = async () => {
        setIsRunning(true);
        setPositionSeq({ x: 0, y: 0 });
        setPositionFunc({ x: 0, y: 0 });
        setStepCountSeq(0);
        setStepCountFunc(0);
        await Promise.all([runSequence(), runFunction()]);
        setIsRunning(false);
    };

    // ── MODO INDIVIDUAL ──────────────────────────────────────────
    if (mode === "sequence" || mode === "function") {
        return (
            <div className="flex flex-row gap-4" style={{ color: "var(--text-primary)" }}>
                <div className="flex flex-col items-center gap-3 bg-white/4 rounded-xs p-2">
                    <h3 className="font-bold">
                        {mode === "sequence" ? (
                            <span style={{ color: "var(--red-light)" }}>Paso a paso</span>
                        ) : (
                            //Explicar sin decir la palabra funcion
                            <span style={{ color: "var(--purple)" }}>Instrucciones reutilizables</span>
                        )}
                    </h3>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                        {mode === "sequence" ? "8 pasos individuales" : "4 llamadas × 2 pasos"}
                    </p>

                    <GridWithRobot
                        robotPos={position}
                        borderColor={mode === "sequence" ? "var(--green-light)" : "var(--purple)"}
                    />


                </div>
                <div className="flex flex-col items-center justify-center gap-3 bg-white/4 rounded-xs p-2 min-w-55">
                    {/* Pasos / función */}
                    {mode === "sequence" ? (
                        <div
                            className="flex flex-col items-center p-2 rounded text-xs font-mono w-full max-w-[220px]"
                        >
                            <p className="mb-1" style={{ color: "var(--text-muted)" }}>Pasos:</p>
                            <div className="flex flex-wrap justify-center gap-1">
                                {REPETITIVE_SEQUENCE.map((s, i) => (
                                    <span
                                        key={i}
                                        className="px-1 rounded"
                                        style={{
                                            backgroundColor: i < stepCount ? "var(--green-dark)" : "var(--bg-surface)",
                                            color: i < stepCount ? "var(--green-light)" : "var(--text-muted)",
                                        }}
                                    >
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <>
                            <div
                                className="p-2 rounded text-xs font-mono w-full max-w-[220px]" >
                                <p className="mb-1 font-bold" style={{ color: "var(--block-funcion)" }}>
                                    subrutina escalera():
                                </p>
                                <div className="flex gap-1">
                                    {FUNCTION_DEFINITION.map((s, i) => (
                                        <span
                                            key={i}
                                            className="px-1 rounded"
                                            style={{ backgroundColor: "var(--block-funcion)", color: "var(--bg-deep)" }}
                                        >
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div
                                className="p-2 rounded text-xs font-mono w-full max-w-[220px]"
                                style={{ backgroundColor: "var(--bg-elevated)" }}
                            >
                                <p className="mb-1" style={{ color: "var(--text-muted)" }}>Llamadas:</p>
                                <div className="flex gap-2 flex-wrap">
                                    {FUNCTION_CALLS.map((_, i) => (
                                        <span
                                            key={i}
                                            className="px-2 py-1 rounded font-bold"
                                            style={{
                                                backgroundColor:
                                                    i < Math.ceil(stepCount / FUNCTION_DEFINITION.length)
                                                        ? "var(--purple)"
                                                        : "var(--bg-surface)",
                                                color:
                                                    i < Math.ceil(stepCount / FUNCTION_DEFINITION.length)
                                                        ? "var(--bg-deep)"
                                                        : "var(--text-muted)",
                                            }}
                                        >
                                            escalera
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                    <div className="flex flex-col items-center justify-center gap-3 w-full">
                        <p className="text-sm">
                            Pasos ejecutados:{" "}
                            <span
                                className="font-bold"
                                style={{ color: mode === "sequence" ? "var(--red-light)" : "var(--purple)" }}
                            >
                                {stepCount}
                            </span>
                        </p>
                        <div className="flex justify-center">
                            <button
                                onClick={run}
                                disabled={isRunning}
                                className="px-6 py-2 rounded font-bold"
                                style={{
                                    backgroundColor: isRunning ? "var(--bg-hover)" : "var(--green-base)",
                                    color: "var(--text-primary)",
                                    cursor: isRunning ? "not-allowed" : "pointer",
                                }}
                            >
                                {isRunning ? "Ejecutando..." : "▶ Ejecutar"}
                            </button>
                        </div>

                        <div className="text-center text-xs" style={{ color: "var(--text-muted)" }}>
                            S = Inicio | 🎯 = Meta
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ── MODO COMPARACIÓN ─────────────────────────────────────────
    return (
        <div className="flex flex-col gap-4" style={{ color: "var(--text-primary)" }}>
            <div className="flex gap-8 justify-center flex-wrap">

                {/* Sin función */}
                <div className="flex flex-col items-center gap-2">
                    <h3 className="font-bold" style={{ color: "var(--red-light)" }}>Sin función</h3>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>8 pasos individuales</p>

                    <GridWithRobot robotPos={positionSeq} borderColor="var(--green-light)" />

                    <div
                        className="p-2 rounded text-xs font-mono w-full max-w-[200px]"
                        style={{ backgroundColor: "var(--bg-elevated)" }}
                    >
                        <p className="mb-1" style={{ color: "var(--text-muted)" }}>Pasos:</p>
                        <div className="flex flex-wrap gap-1">
                            {REPETITIVE_SEQUENCE.map((s, i) => (
                                <span
                                    key={i}
                                    className="px-1 rounded"
                                    style={{
                                        backgroundColor: i < stepCountSeq ? "var(--green-dark)" : "var(--bg-surface)",
                                        color: i < stepCountSeq ? "var(--green-light)" : "var(--text-muted)",
                                    }}
                                >
                                    {s}
                                </span>
                            ))}
                        </div>
                    </div>
                    <p className="text-sm">
                        Pasos: <span className="font-bold" style={{ color: "var(--red-light)" }}>{stepCountSeq}</span>
                    </p>
                </div>

                {/* Con función */}
                <div className="flex flex-col items-center gap-2">
                    <h3 className="font-bold" style={{ color: "var(--purple)" }}>Con función</h3>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>4 llamadas × 2 pasos</p>

                    <GridWithRobot robotPos={positionFunc} borderColor="var(--purple)" />

                    <div
                        className="p-2 rounded text-xs font-mono w-full max-w-[200px]"
                        style={{ backgroundColor: "var(--block-funcion-dark)" }}
                    >
                        <p className="mb-1 font-bold" style={{ color: "var(--block-funcion)" }}>
                            subrutina escalera():
                        </p>
                        <div className="flex gap-1">
                            {FUNCTION_DEFINITION.map((s, i) => (
                                <span
                                    key={i}
                                    className="px-1 rounded"
                                    style={{ backgroundColor: "var(--block-funcion)", color: "var(--bg-deep)" }}
                                >
                                    {s}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div
                        className="p-2 rounded text-xs font-mono w-full max-w-[200px]"
                        style={{ backgroundColor: "var(--bg-elevated)" }}
                    >
                        <p className="mb-1" style={{ color: "var(--text-muted)" }}>Llamadas:</p>
                        <div className="flex gap-2">
                            {FUNCTION_CALLS.map((_, i) => (
                                <span
                                    key={i}
                                    className="px-2 py-1 rounded font-bold"
                                    style={{
                                        backgroundColor:
                                            i < Math.ceil(stepCountFunc / FUNCTION_DEFINITION.length)
                                                ? "var(--purple)"
                                                : "var(--bg-surface)",
                                        color:
                                            i < Math.ceil(stepCountFunc / FUNCTION_DEFINITION.length)
                                                ? "var(--bg-deep)"
                                                : "var(--text-muted)",
                                    }}
                                >
                                    F1
                                </span>
                            ))}
                        </div>
                    </div>
                    <p className="text-sm">
                        Pasos: <span className="font-bold" style={{ color: "var(--purple)" }}>{stepCountFunc}</span>
                    </p>
                </div>
            </div>

            <div className="flex justify-center">
                <button
                    onClick={runBoth}
                    disabled={isRunning}
                    className="px-6 py-2 rounded font-bold"
                    style={{
                        backgroundColor: isRunning ? "var(--bg-hover)" : "var(--green-base)",
                        color: "var(--text-primary)",
                        cursor: isRunning ? "not-allowed" : "pointer",
                    }}
                >
                    {isRunning ? "Ejecutando..." : "▶ Ejecutar comparación"}
                </button>
            </div>

            <div className="text-center text-xs" style={{ color: "var(--text-muted)" }}>
                S = Inicio | 🎯 = Meta | Mismo resultado, menos código con funciones
            </div>
        </div>
    );
}