import { DragDropProvider } from "@dnd-kit/react";
import { PuzzleItem } from "../../PuzzleLevel/types";
import { SortableItem } from "./SortableItem";
import { TheoryButton } from "../../TheoryOverlay/TheoryButton";
import { useState } from "react";
import { Check, ScanLine, X } from "lucide-react";

interface SortableAreaProps {
    items: PuzzleItem[];
    randomOrder: PuzzleItem[];
    onValidate: (isCorrect: boolean) => void;
}

export function SortableArea({ items, randomOrder, onValidate }: SortableAreaProps) {
    const [sortedItems, setSortedItems] = useState<PuzzleItem[]>(randomOrder);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    const handleDragEnd = (event: any) => {
        const operation = event?.operation;
        const { source } = operation;
        const newIndex = source?.index;
        const oldIndex = source?.initialIndex;
        const newItems = [...sortedItems];
        const [movedItem] = newItems.splice(oldIndex, 1);
        newItems.splice(newIndex, 0, movedItem);
        setSortedItems(newItems);
    };

    const handleValidate = () => {
        let isCorrect = 0;
        sortedItems.forEach((item, index) => {
            const number = item.id.split('')[1];
            if (number === `${index + 1}`) {
                isCorrect++;
                return;
            }
        });
        setIsCorrect(isCorrect === items.length);
        setTimeout(() => {
            setIsCorrect(null);
        }, 2000);
        onValidate(isCorrect === items.length);
    };

    console.log('isCorrect', isCorrect);
    return (
        <DragDropProvider
            onDragEnd={handleDragEnd}
        >
            <div className="flex flex-col gap-6 w-full max-w-sm">
                <div className="flex flex-row items-center w-full">
                    <div className="flex flex-col gap-2">
                        {Array.from({ length: items.length }).map((_, index) => (
                            <div key={index} className="flex flex-col items-center justify-center h-11 w-11">
                                <span className="text-(--text-primary)/85 font-bold">{index + 1}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-col justify-center gap-2 w-full">
                        {items && (
                            randomOrder.map((item, index) => (
                                <SortableItem key={item.id} item={item} index={index} />
                            ))
                        )}
                    </div>
                </div>
                <TheoryButton
                    className="ml-11"
                    color={isCorrect === null ? "secondary" : isCorrect ? "success" : "danger"}
                    icon={isCorrect === null ? ScanLine : isCorrect ? Check : X}
                    disabled={isCorrect !== null}
                    onClick={handleValidate}
                >
                    {isCorrect === null ? "Validar" : isCorrect ? "Correcto" : "Incorrecto"}
                </TheoryButton>
            </div>
        </DragDropProvider>
    );
}