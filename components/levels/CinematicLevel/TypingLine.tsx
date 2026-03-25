import { TextLine, LINE_COLORS, LINE_PREFIX } from './types'

export function TypingLine({ line, currentText }: { line: TextLine; currentText: string }) {
    if (line.text === '') return <div className="h-4" />

    return (
        <div className="flex items-baseline gap-3 py-[3px]">
            <span
                className="select-none shrink-0 w-7 text-right text-[11px] leading-none"
                style={{ color: 'var(--green-base)', fontVariantNumeric: 'tabular-nums' }}
            >
                &gt;
            </span>
            <span className="shrink-0 w-px self-stretch" style={{ background: 'var(--green-dark)' }} />
            <span
                className="shrink-0 text-[13px] leading-none select-none"
                style={{ color: LINE_COLORS[line.color], opacity: 0.9 }}
            >
                {LINE_PREFIX[line.color]}
            </span>
            <span
                className="leading-relaxed"
                style={{ color: LINE_COLORS[line.color], fontFamily: 'var(--font-mono)', fontSize: '15px' }}
            >
                {currentText}
                <span
                    className="inline-block w-[9px] h-[15px] align-middle ml-[6px] animate-cursor"
                    style={{ background: LINE_COLORS[line.color], opacity: 0.85 }}
                />
            </span>
        </div>
    )
}
