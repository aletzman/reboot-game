import { BorderType } from "@/types/infrastructure";

export const getBorderClasses = (border: BorderType) => {
    if (border === 'all') return 'border';
    if (border === 'none') return 'border-none';

    // Mapeo de direcciones a clases de Tailwind
    const borderMap: Record<string, string> = {
        top: 'border-t',
        bottom: 'border-b',
        left: 'border-l',
        right: 'border-r'
    };

    return Array.isArray(border)
        ? border.map(side => borderMap[side]).join(' ')
        : '';
};
