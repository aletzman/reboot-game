import { Question } from './types'

export const DEFAULT_REVIEW_DATA: Record<string, { questions: Question[] }> = {
    '1-R': {
        questions: [
            {
                id: 'q1',
                text: '¿Cuál es el concepto que define un conjunto de instrucciones ejecutadas una tras otra?',
                options: ['Bucle / Loop', 'Secuencia', 'Función', 'Condicional'],
                correctIndex: 1,
                concept: 'secuencia'
            },
            {
                id: 'q2',
                text: 'Si el robot necesita repetir un patrón fijo de 4 pasos, ¿qué estructura es la más eficiente?',
                options: ['SI (Condicional)', 'REPETIR (Bucle)', 'SALTAR', 'GIRAR'],
                correctIndex: 1,
                concept: 'loop'
            },
            {
                id: 'q3',
                text: 'En un flujo lógico, el bloque SI (IF) sirve para:',
                options: ['Aumentar la velocidad del robot', 'Ejecutar código solo si se cumple una condición', 'Repetir pasos infinitamente', 'Definir el nombre del programa'],
                correctIndex: 1,
                concept: 'condicional'
            }
        ]
    },
    '2-R': {
        questions: [
            {
                id: 'q1',
                text: '¿Qué estructura permite agrupar una secuencia de bloques bajo un nombre para reutilizarla?',
                options: ['Variable', 'Bucle', 'Función / Procedimiento', 'Asignación'],
                correctIndex: 2,
                concept: 'funcion'
            },
            {
                id: 'q2',
                text: '¿Para qué sirve una variable en pseudocódigo?',
                options: ['Para mover al robot', 'Para almacenar información que puede cambiar', 'Para detener el programa', 'Para repetir una acción'],
                correctIndex: 1,
                concept: 'variable'
            },
            {
                id: 'q3',
                text: 'El proceso de encontrar y corregir errores en la lógica de un bloque se conoce como:',
                options: ['Compilación', 'Iteración', 'Debugging', 'Identificación'],
                correctIndex: 2,
                concept: 'debugging'
            }
        ]
    },
    '3-R': {
        questions: [
            {
                id: 'q1',
                text: '¿Cuál es la principal diferencia entre el pseudocódigo y un lenguaje real como JavaScript?',
                options: ['El pseudocódigo no usa lógica', 'El lenguaje real tiene reglas de sintaxis estrictas', 'El pseudocódigo es más rápido de ejecutar', 'JavaScript no permite usar bucles'],
                correctIndex: 1,
                concept: 'pseudocodigo_a_js'
            },
            {
                id: 'q2',
                text: 'Al pasar de bloques visuales a JavaScript, los comandos ahora se escriben como:',
                options: ['Dibujos técnicos', 'Funciones con paréntesis y punto y coma', 'Solo números', 'Comandos de voz'],
                correctIndex: 1,
                concept: 'pseudocodigo_a_js'
            }
        ]
    },
    '4-R': {
        questions: [
            {
                id: 'q1',
                text: '¿Qué palabra clave usamos en JavaScript para declarar un valor que NUNCA debe cambiar?',
                options: ['let', 'var', 'const', 'fix'],
                correctIndex: 2,
                concept: 'variables'
            },
            {
                id: 'q2',
                text: '¿Cuál es la instrucción estándar para enviar información a la consola del sistema?',
                options: ['console.log()', 'print()', 'system.out()', 'log.write()'],
                correctIndex: 0,
                concept: 'salida'
            },
            {
                id: 'q3',
                text: 'Los tipos de datos booleanos solo admiten dos valores posibles. ¿Cuáles son?',
                options: ['0 y 1', 'true y false', 'YES y NO', 'null y defined'],
                correctIndex: 1,
                concept: 'logica'
            }
        ]
    }
}
