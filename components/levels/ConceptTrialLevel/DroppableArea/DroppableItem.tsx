import { useDroppable } from "@dnd-kit/react";

export function Droppable({ id, occupied, children, isOrigin = false }: { id: string; occupied: boolean; children?: React.ReactNode, isOrigin?: boolean }) {
    const { ref, isDropTarget } = useDroppable({ id });

    const classIsDropTarget = isDropTarget && !isOrigin ? 'active' : '';
    const classIsOccupied = occupied && !isOrigin ? 'bg-(--text-primary)/10 border-(--text-primary)/40' : '';
    const classIsOrigin = isOrigin ? 'bg-(--bg-hover)/0 border-(--border-color)/0 gap-2' : '';
    const classCommon = !isOrigin ? 'bg-(--bg-hover)/50 border border-(--border-color)' : "";

    return (
        <div
            ref={ref}
            className={`
                relative flex items-center justify-center p-2 w-full
                rounded-xs
                ${classCommon}
                ${classIsDropTarget}
                ${classIsOccupied}
                ${classIsOrigin}
            `}
        >
            <strong className={`absolute -top-7 select-none bg-(--bg-elevated)`}>{id}</strong>
            {children}
        </div>
    );
}