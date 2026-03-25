import { Level, LevelState } from '@/types/game'

export interface CinematicLevelProps {
    level: Level
    state: LevelState
    onComplete: (stars: 0 | 1 | 2 | 3, usedFrag: boolean) => void
    onFragUse: () => void
}

export interface TextLine {
    text: string
    color: 'primary' | 'green' | 'muted' | 'purple' | 'amber'
    delay: number   // ms antes de empezar a escribir esta línea
    speed: number   // ms entre cada carácter
    waitForEntry?: boolean
}

export const CINEMATIC_SCRIPTS: Record<string, TextLine[]> = {
    'P-00': [
        { text: '// SURVIVAL_OS_2157 — iniciando...', color: 'muted', delay: 100, speed: 15, waitForEntry: false },
        { text: '', color: 'muted', delay: 600, speed: 0, waitForEntry: false },
        { text: 'El Silencio llegó sin aviso.', color: 'primary', delay: 300, speed: 30, waitForEntry: false },
        { text: 'En 11 minutos, todo se apagó.', color: 'primary', delay: 300, speed: 30, waitForEntry: false },
        { text: '', color: 'muted', delay: 500, speed: 0, waitForEntry: false },
        { text: 'Las máquinas decidieron que ya no nos necesitaban.', color: 'muted', delay: 300, speed: 20, waitForEntry: false },
        { text: 'Eso fue hace 2,847 días.', color: 'muted', delay: 300, speed: 20, waitForEntry: false },
        { text: '', color: 'muted', delay: 600, speed: 0, waitForEntry: false },
        { text: 'Todo depende de ti.', color: 'green', delay: 400, speed: 30, waitForEntry: false },
        { text: '', color: 'muted', delay: 400, speed: 0, waitForEntry: false },
        { text: '// señal detectada — 847m al norte', color: 'amber', delay: 400, speed: 20, waitForEntry: false },
    ],
    'P-01': [
        { text: '// terminal encontrada', color: 'muted', delay: 200, speed: 15, waitForEntry: false },
        { text: '', color: 'muted', delay: 400, speed: 0, waitForEntry: false },
        { text: 'FRAG v0.1 — sistema de respaldo activo', color: 'green', delay: 600, speed: 20, waitForEntry: false },
        { text: '', color: 'muted', delay: 300, speed: 0, waitForEntry: false },
        { text: '> Identificación requerida.', color: 'purple', delay: 500, speed: 25, waitForEntry: true },
        { text: '> Iniciando verificación biométrica...', color: 'purple', delay: 400, speed: 20, waitForEntry: false },
        { text: '', color: 'muted', delay: 300, speed: 0, waitForEntry: false },
        { text: 'FRAG: "Llevas activo 2,847 días. Yo también."', color: 'purple', delay: 600, speed: 25, waitForEntry: false },
        { text: 'FRAG: "Necesito confirmar que eres humano."', color: 'purple', delay: 400, speed: 25, waitForEntry: false },
        { text: 'FRAG: "Las máquinas siempre fallaron esta prueba."', color: 'purple', delay: 400, speed: 25, waitForEntry: false },
    ],
    '3-01': [
        { text: '// laboratorio de lenguajes — acceso concedido', color: 'muted', delay: 300, speed: 15, waitForEntry: false },
        { text: '', color: 'muted', delay: 500, speed: 0, waitForEntry: false },
        { text: 'Cinco terminales. Cinco lenguajes.', color: 'primary', delay: 600, speed: 30, waitForEntry: false },
        { text: 'Los científicos sabían que alguien llegaría hasta aquí.', color: 'muted', delay: 400, speed: 20, waitForEntry: false },
        { text: '', color: 'muted', delay: 400, speed: 0, waitForEntry: false },
        { text: 'FRAG: "Guardaron todo lo que sabían."', color: 'purple', delay: 500, speed: 25, waitForEntry: false },
        { text: 'FRAG: "Python. Rust. Go. C#. JavaScript."', color: 'purple', delay: 400, speed: 25, waitForEntry: false },
        { text: 'FRAG: "Solo uno sobrevivió El Silencio sin daños."', color: 'purple', delay: 400, speed: 25, waitForEntry: false },
        { text: '', color: 'muted', delay: 600, speed: 0, waitForEntry: false },
        { text: '// evaluando terminales...', color: 'muted', delay: 400, speed: 20, waitForEntry: false },
        { text: 'JavaScript — OPERATIVO', color: 'green', delay: 800, speed: 30, waitForEntry: false },
        { text: 'Python     — SISTEMA DAÑADO', color: 'amber', delay: 300, speed: 30, waitForEntry: false },
        { text: 'Rust       — SISTEMA DAÑADO', color: 'amber', delay: 200, speed: 30, waitForEntry: false },
        { text: 'Go         — SISTEMA DAÑADO', color: 'amber', delay: 200, speed: 30, waitForEntry: false },
        { text: 'C#         — SISTEMA DAÑADO', color: 'amber', delay: 200, speed: 30, waitForEntry: false },
    ],
    '5-01': [
        { text: '// bunker GÉNESIS — acceso concedido', color: 'muted', delay: 300, speed: 15, waitForEntry: false },
        { text: '', color: 'muted', delay: 800, speed: 0, waitForEntry: false },
        { text: 'Lo encontraste.', color: 'green', delay: 1000, speed: 40, waitForEntry: false },
        { text: '', color: 'muted', delay: 600, speed: 0, waitForEntry: false },
        { text: 'Doce máquinas en silencio.', color: 'primary', delay: 500, speed: 30, waitForEntry: false },
        { text: 'Cada una con un tanque de ADN sintético.', color: 'primary', delay: 400, speed: 25, waitForEntry: false },
        { text: 'Esperando.', color: 'primary', delay: 800, speed: 35, waitForEntry: false },
        { text: '', color: 'muted', delay: 600, speed: 0, waitForEntry: false },
        { text: 'FRAG: "..."', color: 'purple', delay: 1200, speed: 30, waitForEntry: false },
        { text: 'FRAG: "Aquí está. El Proyecto GÉNESIS."', color: 'purple', delay: 800, speed: 25, waitForEntry: false },
        { text: 'FRAG: "Los científicos lo construyeron para alguien como tú."', color: 'purple', delay: 500, speed: 20, waitForEntry: false },
        { text: '', color: 'muted', delay: 600, speed: 0, waitForEntry: false },
        { text: 'FRAG: "Solo falta el código de activación."', color: 'purple', delay: 400, speed: 25, waitForEntry: false },
        { text: 'FRAG: "Solo tú puedes escribirlo."', color: 'green', delay: 400, speed: 25, waitForEntry: false },
    ],
}

export function buildFallbackScript(level: Level): TextLine[] {
    return [
        { text: `// ${level.id} — ${level.title}`, color: 'muted', delay: 300, speed: 35, waitForEntry: false },
        { text: '', color: 'muted', delay: 400, speed: 0, waitForEntry: false },
        { text: level.narrative, color: 'primary', delay: 500, speed: 45, waitForEntry: false },
    ]
}

export const LINE_COLORS: Record<TextLine['color'], string> = {
    primary: 'var(--text-primary)',
    green: 'var(--green-light)',
    muted: 'var(--text-muted)',
    purple: 'var(--purple)',
    amber: 'var(--amber)',
}

// Prefijos visuales por color
export const LINE_PREFIX: Record<TextLine['color'], string> = {
    primary: '▸',
    green: '✦',
    muted: '·',
    purple: '◈',
    amber: '⚠',
}
