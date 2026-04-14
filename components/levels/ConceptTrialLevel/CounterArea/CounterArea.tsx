import { useState } from "react"
import { TheoryButton } from "../../TheoryOverlay/TheoryButton"

interface CounterAreaProps {
    onComplete: (isCorrect: boolean) => void
    type: "manual" | "auto"
}

export const CounterArea = ({ onComplete, type }: CounterAreaProps) => {
    const [count, setCount] = useState(0)
    const [initRunning, setIsRunning] = useState(false)
    const [target, setTarget] = useState(10);

    const startAuto = async () => {
        setIsRunning(true);
        setCount(0);

        for (let i = 1; i <= target; i++) {
            await new Promise(r => setTimeout(r, 500));
            setCount(i);
            if (i === target) {
                onComplete(true);
            }
        }

        setIsRunning(false);
    };

    return (
        <>
            {type === "manual" && (<div className="flex flex-col items-center gap-4 bg-white/5 p-4 rounded-sm">
                <p>Llega hasta 10 para avanzar</p>
                <p className="text-2xl font-bold text-purple-400 bg-(--purple)/30 px-2 py-1 rounded-sm w-20 text-center">{count}</p>
                <TheoryButton
                    color="info"
                    onClick={() => {
                        setCount(count + 1)
                        if (count >= 10) {
                            onComplete(true)
                        }
                    }}
                >
                    Incrementar
                </TheoryButton>
            </div>)
            }
            {type === "auto" && (
                <div className="flex flex-col items-center gap-4 bg-white/5 p-4 rounded-sm">
                    <p>Contando automáticamente...</p>
                    <p className="text-2xl font-bold text-purple-400 bg-(--purple)/30 px-2 py-1 rounded-sm w-20 text-center">{count}</p>
                    <TheoryButton
                        color="info"
                        disabled={initRunning}
                        onClick={() => {
                            startAuto()
                        }}
                    >
                        Iniciar
                    </TheoryButton>
                </div>
            )}
        </>
    )
}