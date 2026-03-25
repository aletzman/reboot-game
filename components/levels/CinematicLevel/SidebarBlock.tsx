export function SidebarBlock({ label, value, valueColor }: { label: string; value: string; valueColor: string }) {
    return (
        <div>
            <div className="text-[10px] tracking-[.18em] uppercase mb-1" style={{ color: 'var(--text-ghost)' }}>
                {label}
            </div>
            <div
                className="text-[12px] tracking-widest"
                style={{ color: valueColor, textShadow: `0 0 10px ${valueColor}44` }}
            >
                {value}
            </div>
        </div>
    )
}
