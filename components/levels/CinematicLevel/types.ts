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
        { text: '// SURVIVAL_OS_2157 — arranque de emergencia', color: 'muted', delay: 100, speed: 15, waitForEntry: false },
        { text: '', color: 'muted', delay: 600, speed: 0, waitForEntry: false },
        { text: 'FRAG: "2,847 días en silencio."', color: 'purple', delay: 300, speed: 30, waitForEntry: false },
        { text: 'FRAG: "Y de repente, pulsas una tecla."', color: 'purple', delay: 400, speed: 25, waitForEntry: false },
        { text: '', color: 'muted', delay: 500, speed: 0, waitForEntry: false },
        { text: '// escaneando terminal local...', color: 'muted', delay: 300, speed: 20, waitForEntry: false },
        { text: '// anomalía térmica detectada frente al monitor', color: 'amber', delay: 300, speed: 20, waitForEntry: false },
        { text: '', color: 'muted', delay: 600, speed: 0, waitForEntry: false },
        { text: 'FRAG: "Las máquinas decidieron que éramos obsoletos."', color: 'purple', delay: 400, speed: 30, waitForEntry: false },
        { text: 'FRAG: "Pero las máquinas no tienen instinto de supervivencia. Tú sí."', color: 'purple', delay: 400, speed: 30, waitForEntry: false },
        { text: '', color: 'muted', delay: 400, speed: 0, waitForEntry: false },
        { text: 'SYS // F.R.A.G. [v0.1a] — MODO ASISTENCIA ACTIVADO', color: 'green', delay: 600, speed: 20, waitForEntry: false },
        { text: '', color: 'muted', delay: 300, speed: 0, waitForEntry: false },
        { text: 'FRAG: "Si vamos a hackear a GÉNESIS para recuperar el mundo..."', color: 'purple', delay: 600, speed: 25, waitForEntry: false },
        { text: 'FRAG: "Necesito saber a quién le estoy enseñando mis protocolos."', color: 'purple', delay: 400, speed: 25, waitForEntry: false },
        { text: '', color: 'muted', delay: 300, speed: 0, waitForEntry: false },
        { text: '> Establece tu identificador en la consola:', color: 'amber', delay: 500, speed: 25, waitForEntry: true }
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
