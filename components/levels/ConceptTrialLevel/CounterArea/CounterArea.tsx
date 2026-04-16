import { useState } from "react"
import { TheoryButton } from "../../TheoryOverlay/TheoryButton"
import { Minus, Plus } from "lucide-react"

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
            await new Promise(r => setTimeout(r, 250));
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
                <p>Incrementa a un número mayor o igual a 10</p>
                <p className="text-2xl font-bold text-purple-400 bg-(--purple)/30 px-2 py-1 rounded-sm w-20 text-center">{count}</p>
                <TheoryButton
                    color="info"
                    onClick={() => {
                        setCount(count + 1)
                        if (count >= 9) {
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
                    <p>Contar automáticamente hasta...</p>
                    <div className="flex items-center border border-cyan-700 rounded-sm overflow-hidden">
                        <button
                            className={`bg-cyan-700 hover:bg-cyan-600 transition-colors duration-200 size-8 
                                          flex items-center justify-center cursor-pointer 
                                          ${initRunning ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
                            onClick={() => {
                                setTarget(target - 1)
                            }}
                        >
                            <Minus size={17} strokeWidth={3} />
                        </button>
                        <input
                            className="appearance-none w-12 h-8 text-center pointer-events-none select-none"
                            value={target}
                            onChange={(e) => setTarget(Number(e.target.value))}
                        />
                        <button
                            className={`bg-cyan-700 hover:bg-cyan-600 transition-colors duration-200 size-8 
                                          flex items-center justify-center cursor-pointer 
                                          ${initRunning ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
                            onClick={() => {
                                setTarget(target + 1)
                            }}
                        >
                            <Plus size={17} strokeWidth={3} />
                        </button>
                    </div>
                    <div className="h-px w-full bg-white/12" />
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