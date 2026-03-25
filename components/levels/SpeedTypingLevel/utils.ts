import { TypingLine } from '@/types/game'

export function getTimerColor(timeLeft: number, totalLimit: number): string {
    const ratio = timeLeft / totalLimit
    if (ratio > 0.5) return 'var(--green-light)'
    if (ratio > 0.25) return 'var(--amber)'
    return 'var(--red)'
}

export function formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return m > 0 ? `${m}:${s.toString().padStart(2, '0')}` : `${s}s`
}

export function getLineColor(line: TypingLine, idx: number, currentLineIndex: number): string {
    if (line.correct === true) return 'var(--green-light)'
    if (line.correct === false) return 'var(--red)'
    if (idx === currentLineIndex) return 'var(--text-primary)'
    if (idx < currentLineIndex) return 'var(--text-muted)'
    return 'var(--text-ghost)'
}

export function getCharColor(char: string, charIdx: number, lineIdx: number, currentLineIndex: number, typed: string): string {
    if (lineIdx !== currentLineIndex) return 'inherit'
    if (charIdx >= typed.length) return 'var(--text-ghost)'
    return typed[charIdx] === char ? 'var(--green-light)' : 'var(--red)'
}
