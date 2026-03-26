import { EditorLevelData } from './types'

export const EDITOR_DATA: Record<string, EditorLevelData> = {
    '4-02': {
        starterCode: `// 1. Usa console.log para imprimir tu nombre
// 2. Usa console.log para imprimir el mensaje: 'Sistema Activo'
`,
        robotAPI: 'robot.move(n) · robot.activate()',
        tests: [
            { id: 't1', description: 'Imprime al menos dos mensajes', expected: true, input: null },
            { id: 't2', description: 'Usa la función console.log', expected: true, input: null },
        ],
    },
    '4-03': {
        starterCode: `// 1. Declara una constante llamada 'BUNKER' con valor 'Alpha'
// 2. Declara una variable 'energia' con valor 100
// 3. Cambia el valor de 'energia' a 95
`,
        robotAPI: 'robot.move(n) · robot.activate()',
        tests: [
            { id: 't1', description: 'Usa const para BUNKER', expected: true, input: null },
            { id: 't2', description: 'Usa let para energia', expected: true, input: null },
            { id: 't3', description: 'Energía termina en 95', expected: true, input: null },
        ],
    },
    '4-06': {
        starterCode: `// CORRIGE EL BUG: Mueve la declaración arriba del uso
console.log('Radiación:', radiacion);
let radiacion = 0.5;
`,
        robotAPI: 'robot.move(n) · robot.activate()',
        tests: [
            { id: 't1', description: 'Elimina el ReferenceError moviendo let arriba', expected: true, input: null },
        ],
    },
    '4-07': {
        starterCode: `// Usa typeof para clasificar estos datos
let a = "Búnker";
let b = 42;
let c = true;

console.log(typeof a);
`,
        robotAPI: 'robot.move(n) · robot.activate()',
        tests: [
            { id: 't1', description: 'Usa typeof en las variables', expected: true, input: null },
            { id: 't2', description: 'Imprime el tipo en la consola', expected: true, input: null },
        ],
    },
    '4-08': {
        starterCode: `// DIAGNÓSTICO DE MOTOR 08
let energia = 85;
let combustible = 60;

// 1. Calcula el resto de 27 entre 5
let resto = 0; 

// 2. motorListo debe ser true si energia > 80 Y combustible > 50
let motorListo = false; 
`,
        robotAPI: 'robot.move(n) · robot.activate()',
        tests: [
            { id: 't1', description: 'Resto de 27 / 5 es 2', expected: true, input: null },
            { id: 't2', description: 'Usa el operador lógico AND (&&)', expected: true, input: null },
            { id: 't3', description: 'motorListo es true basándose en los datos', expected: true, input: null },
        ],
    },
    '4-10': {
        starterCode: `// ¡SEGURIDAD! Cambia el == por ===
if (5 == '5') {
    console.log('Peligro: Coerción detectada');
}
`,
        robotAPI: 'robot.move(n) · robot.activate()',
        tests: [
            { id: 't1', description: 'Usa igualdad estricta ===', expected: true, input: null },
        ],
    },
    '4-11': {
        starterCode: `// 1. Usa ?? para dar un valor por defecto (50) a 'oxigeno' si es null
// 2. Usa un ternario para asignar 'ESTABLE' o 'CRÍTICO' a 'estado'
let userOxigeno = null;
let energia = 30;

let oxigeno = // ...
let estado = // ...
`,
        robotAPI: 'robot.move(n) · robot.activate()',
        tests: [
            { id: 't1', description: 'Usa el operador ??', expected: true, input: null },
            { id: 't2', description: 'Usa el operador ternario ? :', expected: true, input: null },
        ],
    },
    '4-13': {
        starterCode: `// Implementa: si energia > 80 'ÓPTIMO', si > 40 'ESTABLE', sino 'ALERTA'
let energia = 35;
let diagnostico = '';
`,
        robotAPI: 'robot.move(n) · robot.activate()',
        tests: [
            { id: 't1', description: 'Usa if, else if y else', expected: true, input: null },
            { id: 't2', description: 'Asigna el valor correcto según la energía', expected: true, input: null },
        ],
    },
    '4-14': {
        starterCode: `// switch para comandos 'INICIAR', 'PARAR', 'STBY'
let comando = 'PARAR';
`,
        robotAPI: 'robot.move(n) · robot.activate()',
        tests: [
            { id: 't1', description: 'Implementa un switch', expected: true, input: null },
            { id: 't2', description: 'Incluye un caso default', expected: true, input: null },
        ],
    },
    '4-16': {
        starterCode: `// Imprime los números del 1 al 10 con un bucle for
`,
        robotAPI: 'robot.move(n) · robot.activate()',
        tests: [
            { id: 't1', description: 'Usa un bucle for', expected: true, input: null },
            { id: 't2', description: 'Llega hasta el número 10', expected: true, input: null },
        ],
    },
    '4-17': {
        starterCode: `// Carga la batería hasta 100 de 7 en 7 usando while
let carga = 0;
`,
        robotAPI: 'robot.move(n) · robot.activate()',
        tests: [
            { id: 't1', description: 'Usa bucle while', expected: true, input: null },
            { id: 't2', description: 'La carga llega o supera 100', expected: true, input: null },
        ],
    },
    '4-18': {
        starterCode: `// Recorre 1 a 20. Salta el 13 y para en el 17.
`,
        robotAPI: 'robot.move(n) · robot.activate()',
        tests: [
            { id: 't1', description: 'Usa continue para el 13', expected: true, input: null },
            { id: 't2', description: 'Usa break para el 17', expected: true, input: null },
        ],
    },
    '4-20': {
        starterCode: `// Crea una función 'inyectar' que reciba 'monto'
// y devuelva 'Inyectando ' + monto
`,
        robotAPI: 'robot.move(n) · robot.activate()',
        tests: [
            { id: 't1', description: 'Declara la función correctamente', expected: true, input: null },
            { id: 't2', description: 'Usa return', expected: true, input: null },
        ],
    },
    '4-21': {
        starterCode: `// Crea una función 'convertir' (C a K: C + 273)
// y captura el resultado de llamarla en una variable
`,
        robotAPI: 'robot.move(n) · robot.activate()',
        tests: [
            { id: 't1', description: 'La función retorna el cálculo', expected: true, input: null },
            { id: 't2', description: 'Capturas el resultado en una variable', expected: true, input: null },
        ],
    },
    '4-23': {
        starterCode: `// 1. Crea un array 'nodos' con 3 valores
// 2. Cambia el nodo[0] a 1
// 3. Usa .push() para añadir un nodo
`,
        robotAPI: 'robot.move(n) · robot.activate()',
        tests: [
            { id: 't1', description: 'Usa array literal []', expected: true, input: null },
            { id: 't2', description: 'Usa el método .push()', expected: true, input: null },
        ],
    },
    '4-24': {
        starterCode: `// Baja todos los voltajes un 10% usando .map()
let voltajes = [100, 200, 150, 80];
`,
        robotAPI: 'robot.move(n) · robot.activate()',
        tests: [
            { id: 't1', description: 'Usa el método .map()', expected: true, input: null },
            { id: 't2', description: 'El cálculo reduce un 10%', expected: true, input: null },
        ],
    },
    '4-25': {
        starterCode: `// Filtra solo las temperaturas > 50 usando .filter()
let temps = [30, 55, 20, 80, 45, 90];
`,
        robotAPI: 'robot.move(n) · robot.activate()',
        tests: [
            { id: 't1', description: 'Usa el método .filter()', expected: true, input: null },
            { id: 't2', description: 'El array resultante tiene 3 elementos', expected: true, input: null },
        ],
    },
    '4-27': {
        starterCode: `// Crea un objeto 'bunker' con id, nombre y estado
// Cambia el estado a 'SEGURO'
`,
        robotAPI: 'robot.move(n) · robot.activate()',
        tests: [
            { id: 't1', description: 'Objeto tiene propiedades correctas', expected: true, input: null },
            { id: 't2', description: 'Modificas propiedad con .estado', expected: true, input: null },
        ],
    },
    '4-28': {
        starterCode: `// Convierte esta función a una Arrow Function
function cuadrado(n) { return n * n; }
`,
        robotAPI: 'robot.move(n) · robot.activate()',
        tests: [
            { id: 't1', description: 'Usa la sintaxis =>', expected: true, input: null },
            { id: 't2', description: 'Retorno implícito sin llaves', expected: true, input: null },
        ],
    },
    '4-R': {
        starterCode: `// DESAFÍO FINAL FASE 1
// 1. Filtra sensores con lectura > 0
// 2. Transforma con .map usando Arrow Functions
// 3. Imprime el resultado final
`,
        robotAPI: 'robot.move(n) · robot.turn("left") · robot.activate()',
        tests: [
            { id: 't1', description: 'Usa .filter() y .map()', expected: true, input: null },
            { id: 't2', description: 'Usa arrow functions (=>)', expected: true, input: null },
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
