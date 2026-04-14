import { useSortable } from "@dnd-kit/react/sortable";
import { PuzzleItem } from "../../PuzzleLevel/types";
import { GripVertical } from "lucide-react";

interface SortableItemProps {
    item: PuzzleItem;
    index: number;
}

export function SortableItem({ item, index }: SortableItemProps) {
    const { ref, isDragging, isDropTarget } = useSortable({
        id: item.id,
        index: index
    })
    return (
        <div
            ref={ref}
            className="flex items-center bg-(--purple)/20 border border-(--border-color) select-none cursor-grab rounded-sm h-11 group hover:border-(--text-primary)/20 hover:bg-(--purple)/40  transition-all duration-200 relative overflow-hidden"
        >
            {/* Línea de acento lateral que aparece en hover */}
            <div className="absolute left-0 top-0 bottom-0 opacity-[0.5] bg-[linear-gradient(45deg,rgba(0,0,0,0)_45%,#fff_50%,rgba(0,0,0,0)_55%)] bg-size-[3px_3px]" />

            <div className="flex items-center justify-center w-8 h-full bg-(--bg-deep)/60 border-r border-(--border-color) text-(--text-muted) group-hover:text-(--text-primary)/80 group-hover:bg-(--bg-deep)/85 transition-colors">
                <GripVertical size={16} />
            </div>

            <span className="ml-3 text-(--text-primary) font-mono text-sm uppercase tracking-wider group-hover:text-white transition-colors">
                {item.text}
            </span>
        </div>
    )
}