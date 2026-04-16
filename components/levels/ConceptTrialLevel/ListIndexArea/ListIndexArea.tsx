"use client";

import React, { useState } from "react";
import { TheoryButton } from "../../TheoryOverlay/TheoryButton";
import { Play, RotateCcw } from "lucide-react";

interface ListItem {
    id: string;
    name?: string;
    icon?: string;
    text?: string;
}

interface ListIndexAreaProps {
    items: ListItem[];
    targetIndex: number;
    question: string;
    onValidate: (isCorrect: boolean) => void;
}

export function ListIndexArea({
    items,
    targetIndex,
    question,
    onValidate,
}: ListIndexAreaProps) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [currentHighlight, setCurrentHighlight] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    const reset = () => {
        setSelectedIndex(null);
        setCurrentHighlight(null);
        setShowResult(false);
        setIsCorrect(false);
        setIsRunning(false);
    };

    const run = async () => {
        if (selectedIndex === null) return;

        setIsRunning(true);
        setShowResult(false);

        // Animación de recorrido de la lista
        for (let i = 0; i <= targetIndex; i++) {
            setCurrentHighlight(i);
            await new Promise((r) => setTimeout(r, 600));
        }

        // Verificar si el índice seleccionado es correcto
        const correct = selectedIndex === targetIndex;
        setIsCorrect(correct);
        setShowResult(true);
        setIsRunning(false);

        onValidate(correct);
    };

    return (
        <div className="flex flex-col items-center gap-4 w-full max-w-2xl mx-auto">
            {/* Pregunta */}
            <div className="w-full p-2 rounded-sm text-center bg-(--bg-surface) border border-(--border-color)">
                <p className="text-md text-(--text-primary)">
                    {question}
                </p>
            </div>

            {/* Lista visual con índices */}
            <div className="flex flex-col items-center gap-2">
                <div className="flex flex-row items-center gap-2">

                    {/* Label de array */}
                    <div className="flex items-center gap-2 pt-7">
                        <span className="px-3 py-1 rounded text-sm font-mono bg-(--bg-elevated) text-(--purple) border border-(--purple)">
                            inventario
                        </span>
                        <span className="text-(--text-muted)">=</span>
                        <span className="text-4xl font-mono text-(--text-muted)">[</span>
                    </div>
                    <div>

                        {/* Índices arriba de la caja */}
                        <div className="flex">
                            {items.map((_, index) => {
                                const isHighlighted = currentHighlight === index;
                                return (
                                    <div
                                        key={`index-${index}`}
                                        className={`w-18 h-8 flex items-center justify-center text-sm font-mono font-bold transition-all duration-300 ${isHighlighted
                                            ? 'bg-(--purple) text-(--bg-deep) shadow-[0_0_15px_var(--purple)]'
                                            : 'bg-(--bg-elevated) text-(--text-muted)'
                                            }`}
                                    >
                                        {index}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Caja dividida en 3 con objetos dentro */}
                        <div className="flex overflow-hidden bg-(--bg-surface) border border-(--border-color)">
                            {items.map((item, index) => {
                                const isHighlighted = currentHighlight === index;
                                const isSelected = selectedIndex === index;
                                const showSuccess = showResult && isSelected && isCorrect;
                                const showError = showResult && isSelected && !isCorrect;

                                return (
                                    <div
                                        key={item.id}
                                        onClick={() => !isRunning && setSelectedIndex(index)}
                                        className={`w-18 h-18 flex flex-col items-center justify-center gap-1 transition-all duration-300 border-2 cursor-pointer ${showSuccess
                                            ? 'bg-(--green-dark) border-(--green-light)'
                                            : showError
                                                ? 'bg-(--red-dark) border-(--red)'
                                                : isSelected
                                                    ? 'bg-(--bg-elevated) border-(--purple) border-2 shadow-[inset_0_0_15px_rgba(127,119,221,0.3)]'
                                                    : isHighlighted
                                                        ? 'bg-(--bg-deep) border-(--purple)'
                                                        : 'bg-(--bg-deep) border-(--border-color)'
                                            }`}
                                    >
                                        <span className="text-2xl">{item.icon || '📦'}</span>
                                        <span className="text-xs text-center px-1 text-(--text-primary)">
                                            {item.name || item.text || 'Item'}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <span className="text-4xl font-mono text-(--text-muted) pt-7">]</span>
                </div>

                {/* Nota sobre índices */}
                <div className="flex items-center gap-3 p-2 py-1 rounded text-sm bg-(--block-funcion-dark) border border-(--block-funcion)">
                    <span className="font-bold text-(--block-funcion)">ℹ</span>
                    <span className="text-(--text-muted)">
                        Los índices siempre empiezan en{" "}
                        <span className="font-mono font-bold text-(--block-funcion)">
                            0
                        </span>
                        , no en 1
                    </span>
                </div>
            </div>

            {/* Resultado */}
            {showResult && (
                <div className={`px-4 py-2 rounded-sm text-center animate-in fade-in slide-in-from-bottom-2 border ${isCorrect ? 'bg-(--green-dark) border-(--green-light)' : 'bg-(--red-dark) border-(--red)'
                    }`}>
                    <p className={`font-bold text-xs ${isCorrect ? 'text-(--green-light)' : 'text-(--red-light)'}`}>
                        {isCorrect
                            ? "¡Correcto! El índice seleccionado es el correcto."
                            : "Incorrecto. Observa la animación para ver el índice correcto."}
                    </p>
                    {/*!isCorrect && (
                        <p className="text-sm mt-1 text-(--text-muted)">
                            La respuesta correcta era el índice{" "}
                            <span className="font-mono font-bold">{targetIndex}</span>
                        </p>
                    )*/}
                </div>
            )}

            {/* Controles */}
            <div className="flex items-center gap-4">
                <TheoryButton
                    onClick={reset}
                    size="sm"
                    color="secondary"
                    icon={RotateCcw}
                    disabled={isRunning}
                    className={`px-4 py-2 rounded font-bold transition-all bg-(--bg-hover) text-(--text-muted) ${isRunning ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                        }`}
                >
                    Reiniciar
                </TheoryButton>

                <TheoryButton
                    onClick={run}
                    size="sm"
                    color={isRunning ? 'success' : 'secondary'}
                    icon={Play}
                    disabled={isRunning || selectedIndex === null}
                    className="px-6 py-2 rounded font-bold transition-all text-(--text-primary)"
                >
                    {isRunning ? "Verificando..." : "Verificar índice"}
                </TheoryButton>
            </div>

            {/* Leyenda */}
            <div className="text-center text-xs text-(--text-muted)">
                Haz clic en un elemento para seleccionarlo, luego presiona Verificar
            </div>
        </div>
    );
}
