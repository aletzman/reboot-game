export function move<T>(items: T[], event: any): T[] {
    const { source, target } = event.operation
    if (target && source.id !== target.id) {
        const oldIndex = items.findIndex((i: any) => i.id === source.id)
        const newIndex = items.findIndex((i: any) => i.id === target.id)
        if (oldIndex !== -1 && newIndex !== -1) {
            const updated = [...items]
            const [moved] = updated.splice(oldIndex, 1)
            updated.splice(newIndex, 0, moved)
            return updated
        }
    }
    return items
}

export function SyntaxHighlighter({ text }: { text: string }) {
    // Palabras clave comunes de REBOOT y JS
    const keywords = ["INICIO", "FIN", "MOVER", "SI", "ACTIVAR", "REPETIR", "entonces", "const", "let", "function", "return", "robot"]
    const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]

    const parts = text.split(/(\b\w+\b|\s+)/g)

    return (
        <code className="bg-transparent font-mono whitespace-pre">
            {parts.map((part, i) => {
                if (keywords.includes(part)) {
                    return <span key={i} className="text-(--cyan) font-bold">{part}</span>
                }
                if (part.includes("(") || part.includes(")")) {
                    return <span key={i} className="text-(--amber)">{part}</span>
                }
                if (part.startsWith('"') || part.startsWith("'")) {
                    return <span key={i} className="text-(--purple)">{part}</span>
                }
                if (numbers.some(n => part.includes(n))) {
                    return <span key={i} className="text-(--amber)">{part}</span>
                }
                if (part.toUpperCase() === part && part.length > 2 && !keywords.includes(part)) {
                    return <span key={i} className="text-(--green-muted)">{part}</span>
                }
                return <span key={i}>{part}</span>
            })}
        </code>
    )
}
