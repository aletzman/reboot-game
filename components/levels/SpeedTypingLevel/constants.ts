import { TypingLevelData } from './types'

export const TYPING_DATA: Record<string, TypingLevelData> = {
    '2-06': {
        timeLimit: 60,
        bonusTimeFor3Stars: 20,
        lines: [
            'INICIO',
            '  energia = 100',
            '  SI energia > 0 entonces',
            '    MOVER(3)',
            '    ACTIVAR()',
            '  FIN SI',
            'FIN',
        ],
    },
    '4-04': {
        timeLimit: 90,
        bonusTimeFor3Stars: 30,
        lines: [
            'let energia = 100;',
            'let sector = "norte";',
            'function estabilizar(valor) {',
            '  return valor * 2;',
            '}',
            'const resultado = estabilizar(energia);',
            'console.log(resultado);',
        ],
    },
    '4-09': {
        timeLimit: 120,
        bonusTimeFor3Stars: 40,
        lines: [
            'const maquinas = ["A", "B", "C", "D"];',
            'const bunker = {',
            '  nombre: "GENESIS",',
            '  capsulas: 12,',
            '  activo: false',
            '};',
            'function activar(maquina, callback) {',
            '  maquina.activo = true;',
            '  callback(maquina);',
            '}',
            'maquinas.forEach(function(m) {',
            '  console.log("activando: " + m);',
            '});',
        ],
    },
}

export const DEFAULT_TYPING: TypingLevelData = {
    timeLimit: 60,
    bonusTimeFor3Stars: 20,
    lines: [
        'INICIO',
        '  MOVER(3)',
        '  ACTIVAR()',
        'FIN',
    ],
}
