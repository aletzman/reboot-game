import { useDraggable } from "@dnd-kit/react";

export function Draggable({ id, children }: { id: string, children?: React.ReactNode }) {
    const { ref } = useDraggable({ id });

    return (
        <button ref={ref} className="w-24 h-12 bg-(--cyan)/80 cursor-grab active:cursor-grabbing rounded-xs">
            {id}
        </button>
    );
}