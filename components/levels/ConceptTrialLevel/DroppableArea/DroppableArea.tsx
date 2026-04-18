import { useState } from "react";
import { DragDropProvider } from "@dnd-kit/react";
import { Draggable } from "./DraggableItem";
import { Droppable } from "./DroppableItem";
import { TheoryButton } from "../../TheoryOverlay/TheoryButton";
import { MatchPair } from "../../PuzzleLevel/types";
import { PuzzleItem } from "../../PuzzleLevel/types";
import { Check, ScanLine, X } from "lucide-react";


interface DroppableAreaProps {
    items: PuzzleItem[];
    boxes: PuzzleItem[];
    pairs: MatchPair[];
    originLabel?: string;
    onValidate?: (isCorrect: boolean) => void;
}

export function DroppableArea({ items, boxes, pairs, originLabel = 'Origen', onValidate }: DroppableAreaProps) {
    // Cada item apunta al id de su caja, o undefined si está suelto
    const [parents, setParents] = useState<Record<string, string | undefined>>({});
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    const validateResponse = () => {
        let correct = 0;
        pairs.forEach(pair => {
            const item = items.find(item => item.id === pair.rightId);
            const box = boxes.find(box => box.id === pair.leftId);
            if (!item?.text || !box?.text) return;
            const currentBoxId = parents[item.text];
            if (currentBoxId === box.text) correct++;
        });
        const isCorrectCurrent = correct === pairs.length;
        setIsCorrect(isCorrectCurrent);
        if (!isCorrectCurrent) {
            setTimeout(() => {
                setIsCorrect(null);
            }, 2000);
        }
        if (onValidate) {
            onValidate(isCorrectCurrent);
        }
    };

    return (
        <DragDropProvider
            onDragEnd={(event) => {
                if (event.canceled) return;
                const itemId = event.operation.source?.id as string;
                const targetId = event.operation.target?.id as string | undefined;

                // Si suelta en origen, limpiar su parent
                if (targetId === originLabel) {
                    setParents((prev) => ({ ...prev, [itemId]: undefined }));
                    return;
                }

                // Si no hay target (soltó en el aire), no hacer nada
                if (!targetId) return;

                // Verificar que la caja destino no tenga ya un item
                const boxOccupied = Object.values(parents).includes(targetId);
                if (boxOccupied) return;

                setParents((prev) => ({ ...prev, [itemId]: targetId }));
            }}
        >
            <div className="flex flex-col gap-10 w-96">

                {/* Zona de items sin asignar */}
                <div className="relative flex flex-row gap-2 p-3 border border-dashed border-gray-300/25 h-20">
                    <Droppable id={originLabel} occupied={false} isOrigin={true}>
                        {items.filter((item) => item.text && !parents[item.text]).map((item) => (
                            <Draggable key={item.id} id={item.text || ''} />
                        ))}
                    </Droppable>
                </div>

                <div className="grid grid-cols-3 gap-2 h-20">
                    {/* 3 cajas destino */}
                    {boxes.map((box) => {
                        const occupied = items.some((item) => item.text && parents[item.text] === box.text);
                        return (
                            <Droppable key={box.id} id={box.text || ''} occupied={occupied}>
                                {items.filter((item) => item.text && parents[item.text] === box.text).map((item) => (
                                    <Draggable key={item.id} id={item.text || ''} />
                                ))}
                            </Droppable>
                        );
                    })}
                </div>
                <TheoryButton
                    variant="solid"
                    color={isCorrect === null ? "secondary" : isCorrect ? "success" : "danger"}
                    icon={isCorrect === null ? ScanLine : isCorrect ? Check : X}
                    disabled={isCorrect !== null}
                    onClick={validateResponse}
                >
                    {isCorrect === null ? "Validar" : isCorrect ? "Correcto" : "Incorrecto"}
                </TheoryButton>
            </div>
        </DragDropProvider>
    );
}