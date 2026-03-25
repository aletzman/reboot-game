import { EditorLevelData } from './types'

export const EDITOR_DATA: Record<string, EditorLevelData> = {
    '4-01': {
        starterCode: `// Declara una variable con el número de pasos
// y úsala para mover el robot

`,
        robotAPI: 'robot.move(n) · robot.turn("left"|"right") · robot.activate()',
        tests: [
            {
                id: 't1',
                description: 'Declara una variable con let o const',
                expected: true,
                input: null,
            },
            {
                id: 't2',
                description: 'Usa la variable en robot.move()',
                expected: true,
                input: null,
            },
        ],
    },

    '4-03': {
        starterCode: `// Define una función llamada 'reactivar'
// que reciba un parámetro y mueva el robot

`,
        robotAPI: 'robot.move(n) · robot.turn("left"|"right") · robot.activate()',
        tests: [
            {
                id: 't1',
                description: 'Define una función con function',
                expected: true,
                input: null,
            },
            {
                id: 't2',
                description: 'La función recibe al menos un parámetro',
                expected: true,
                input: null,
            },
            {
                id: 't3',
                description: 'La función es llamada al menos una vez',
                expected: true,
                input: null,
            },
        ],
    },

    '4-05': {
        starterCode: `// Crea un array con los generadores
// y recórrelo con forEach para activarlos

`,
        robotAPI: 'robot.move(n) · robot.activate(gen)',
        tests: [
            {
                id: 't1',
                description: 'Declara un array con [ ]',
                expected: true,
                input: null,
            },
            {
                id: 't2',
                description: 'Usa forEach para recorrer el array',
                expected: true,
                input: null,
            },
            {
                id: 't3',
                description: 'Llama a robot.activate() dentro del forEach',
                expected: true,
                input: null,
            },
        ],
    },

    '4-07': {
        starterCode: `// Crea un objeto para la máquina A
// con propiedades: potencia, estado, tipo

`,
        robotAPI: 'robot.move(n) · robot.activate()',
        tests: [
            {
                id: 't1',
                description: 'Declara un objeto con { }',
                expected: true,
                input: null,
            },
            {
                id: 't2',
                description: 'El objeto tiene al menos 2 propiedades',
                expected: true,
                input: null,
            },
            {
                id: 't3',
                description: 'Accede a una propiedad con punto (.)',
                expected: true,
                input: null,
            },
        ],
    },

    '4-08': {
        starterCode: `// Escribe una función que reciba
// una máquina y un callback

`,
        robotAPI: 'robot.move(n) · robot.activate()',
        tests: [
            {
                id: 't1',
                description: 'Define una función con 2 parámetros',
                expected: true,
                input: null,
            },
            {
                id: 't2',
                description: 'El segundo parámetro es llamado como función',
                expected: true,
                input: null,
            },
            {
                id: 't3',
                description: 'La función es llamada con un callback anónimo',
                expected: true,
                input: null,
            },
        ],
    },

    '4-10': {
        starterCode: `// Programa completo: reactiva el sector 3
// Usa variables, funciones, arrays y objetos

`,
        robotAPI: 'robot.move(n) · robot.turn("left"|"right") · robot.activate() · robot.jump()',
        maxLines: 20,
        tests: [
            {
                id: 't1',
                description: 'Usa al menos una variable (let/const)',
                expected: true,
                input: null,
            },
            {
                id: 't2',
                description: 'Define al menos una función',
                expected: true,
                input: null,
            },
            {
                id: 't3',
                description: 'Usa un array',
                expected: true,
                input: null,
            },
            {
                id: 't4',
                description: 'Usa un objeto',
                expected: true,
                input: null,
            },
            {
                id: 't5',
                description: 'Llama a robot.activate() al menos una vez',
                expected: true,
                input: null,
            },
        ],
    },

    '5-02': {
        starterCode: `// PROTOCOLO DE ACTIVACIÓN — PROYECTO GÉNESIS
// Escribe el código que active las 12 máquinas
// Tienes todo lo que necesitas

`,
        robotAPI: 'genesis.activar(id) · genesis.verificar(id) · genesis.estado()',
        tests: [
            {
                id: 't1',
                description: 'Declara variables con let o const',
                expected: true,
                input: null,
            },
            {
                id: 't2',
                description: 'Define al menos una función',
                expected: true,
                input: null,
            },
            {
                id: 't3',
                description: 'Usa un array',
                expected: true,
                input: null,
            },
            {
                id: 't4',
                description: 'Usa un objeto',
                expected: true,
                input: null,
            },
            {
                id: 't5',
                description: 'Usa forEach o un loop',
                expected: true,
                input: null,
            },
            {
                id: 't6',
                description: 'Usa una condición if',
                expected: true,
                input: null,
            },
            {
                id: 't7',
                description: 'Usa un callback',
                expected: true,
                input: null,
            },
            {
                id: 't8',
                description: 'Llama a genesis.activar() al menos una vez',
                expected: true,
                input: null,
            },
        ],
    },
}

export const DEFAULT_EDITOR: EditorLevelData = {
    starterCode: '// escribe tu código aquí\n\n',
    robotAPI: 'robot.move(n) · robot.activate()',
    tests: [
        { id: 't1', description: 'El código no tiene errores de sintaxis', expected: true, input: null },
    ],
}
