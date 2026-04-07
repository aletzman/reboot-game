import { TestCase } from '@/types/game'
import { EDITOR_DATA } from './constants'

export function runTests(code: string, tests: Omit<TestCase, 'passed'>[], levelId: string): TestCase[] {
    const patterns: Record<string, (c: string) => boolean> = {

        // PRUEBA 1: Validar que el primer console.log tenga UN nombre (cualquier texto que no sea el mensaje del paso 2)
        '4-02-t1': c => {
            const matches = [...c.matchAll(/console\.log\s*\(\s*(['"`])(.*?)\1\s*\)/g)];
            // Buscamos un log que NO sea 'Sistema Activo' y que tenga contenido
            return matches.some(m =>
                m[2].toLowerCase() !== 'sistema activo' &&
                m[2].trim().length > 0
            );
        },

        // PRUEBA 2: Validar específicamente el mensaje 'Sistema Activo'
        '4-02-t2': c => /console\.log\s*\(\s*(['"`])Sistema Activo\1\s*\)/i.test(c),

        // 4-03: let/const
        // 1. Constante BUNKER con valor 'Alpha'
        // Verifica: const + nombre + asignación + 'Alpha' (soporta comillas simples, dobles o backticks)
        '4-03-t1': c => /\bconst\s+BUNKER\s*=\s*(['"`])Alpha\1/.test(c),

        // 2. Variable energia con valor inicial 100
        // Verifica: let + nombre + asignación + 100
        '4-03-t2': c => /\blet\s+energia\s*=\s*100\b/.test(c),

        // 3. Reasignación de energia a 95
        // Verifica: que energia cambie a 95 (sin usar let/const de nuevo)
        '4-03-t3': c => {
            // Buscamos la reasignación específica energia = 95
            // Asegurándonos de que no lleve 'let' antes para que sea reasignación real
            const reasignacion = /(?<!let\s+)energia\s*=\s*95\b/.test(c);
            return reasignacion;
        },

        // 4-06: Hoisting/TDZ
        '4-06-t1': c => {
            const decl = c.indexOf('let radiacion');
            const use = c.indexOf('console.log');
            return decl !== -1 && use !== -1 && decl < use;
        },

        // 4-07: Types
        '4-07-t1': c => /typeof\b/.test(c),
        '4-07-t2': c => /console\.log\b/.test(c),

        // 4-08: Operators (Diagnosis)
        '4-08-t1': c => /resto\s*=\s*(2|27\s*%\s*5)/.test(c),
        '4-08-t2': c => /&&/.test(c),
        '4-08-t3': c => /motorListo\s*=\s*true/.test(c) || /motorListo\s*=\s*\(?energia\s*>\s*80\s*&&\s*combustible\s*>\s*50\)?/.test(c),
        '4-10-t1': c => c.includes('===') && !c.includes('== '),

        // 4-11: ?? / Ternary
        '4-11-t1': c => /\?\?/.test(c),
        '4-11-t2': c => /\?\s*.*:/.test(c),

        // 4-13: if/else
        '4-13-t1': c => /\bif\b[\s\S]*\belse\s+if\b[\s\S]*\belse\b/.test(c),
        '4-13-t2': c => /'ÓPTIMO'|'ESTABLE'|'ALERTA'/.test(c),

        // 4-14: switch
        '4-14-t1': c => /\bswitch\b/.test(c) && /\bcase\b/.test(c),
        '4-14-t2': c => /\bdefault\b/.test(c) && /\bbreak\b/.test(c) || c.includes('default'),

        // 4-16: for
        '4-16-t1': c => /\bfor\b/.test(c),
        '4-16-t2': c => /10/.test(c),

        // 4-17: while
        '4-17-t1': c => /\bwhile\b/.test(c),
        '4-17-t2': c => /100/.test(c) && /carga\s*(\+|=)/.test(c),

        // 4-18: break/continue
        '4-18-t1': c => /\bcontinue\b/.test(c),
        '4-18-t2': c => /\bbreak\b/.test(c),

        // 4-20: Functions
        '4-20-t1': c => /\bfunction\s+inyectar\b/.test(c),
        '4-20-t2': c => /\breturn\b/.test(c),

        // 4-21: Return/Params
        '4-21-t1': c => /\breturn\b/.test(c) && /\+/.test(c),
        '4-21-t2': c => /\bconst|let\s+\w+\s*=\s*\w+\(/.test(c),

        // 4-23: Arrays
        '4-23-t1': c => /\[.*,.*,.*\]/.test(c),
        '4-23-t2': c => /\.push\s*\(/.test(c),

        // 4-24: map
        '4-24-t1': c => /\.map\s*\(/.test(c),
        '4-24-t2': c => /\*|0\.9/.test(c),

        // 4-25: filter
        '4-25-t1': c => /\.filter\s*\(/.test(c),
        '4-25-t2': c => />\s*50/.test(c),

        // 4-27: Objects
        '4-27-t1': c => /\{[\s\S]*id[\s\S]*nombre[\s\S]*estado[\s\S]*\}/.test(c),
        '4-27-t2': c => /\.estado\s*=/.test(c),

        // 4-28: Arrow Functions
        '4-28-t1': c => /=>/.test(c),
        '4-28-t2': c => /=>\s*[^\{]/.test(c),

        // 4-R: Final Review
        '4-R-t1': c => /\.filter\s*\(/.test(c) && /\.map\s*\(/.test(c),
        '4-R-t2': c => /=>/.test(c),
    }

    return tests.map(test => {
        const key = `${levelId}-${test.id}`
        const fn = patterns[key]
        const passed = fn ? fn(code) : code.trim().length > 0

        return { ...test, passed } as TestCase
    })
}
