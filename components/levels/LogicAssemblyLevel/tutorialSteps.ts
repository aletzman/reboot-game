import { DriveStep } from "driver.js";

/**
 * Pasos del tutorial para el modo LogicAssembly.
 * Introducción a la programación por bloques visuales.
 */
export const LOGIC_ASSEMBLY_TUTORIAL: DriveStep[] = [
    {
        element: '#logic-level-header',
        popover: {
            title: 'NUEVA INTERFAZ',
            description: 'Bienvenido. Esta es la nueva pantalla para reparar sistemas. Aquí aprenderás a dar órdenes más complejas para que el robot se mueva.',
            side: "bottom",
            align: 'center'
        }
    },
    {
        element: '#logic-palette',
        popover: {
            title: 'LISTA DE ACCIONES',
            description: 'En el panel izquierdo tienes las acciones disponibles. Puedes hacer clic en ellas o arrastrarlas al centro para usarlas.',
            side: "right",
            align: 'center'
        }
    },
    {
        element: '#root-workspace',
        popover: {
            title: 'ZONA DE TRABAJO',
            description: 'Aquí es donde pones tus órdenes. El robot las hará una tras otra, empezando por la que esté más arriba.',
            side: "top",
            align: 'center'
        }
    },
    {
        element: '#logic-simulator',
        popover: {
            title: 'VISOR DEL ROBOT',
            description: 'En este lado verás al robot moviéndose por el mapa siguiendo tus órdenes en tiempo real.',
            side: "left",
            align: 'center'
        }
    },
    {
        element: '#logic-execute-button',
        popover: {
            title: 'PROBAR SECUENCIA',
            description: 'Cuando creas que ya tienes la respuesta, pulsa este botón para que el robot empiece a moverse.',
            side: "top",
            align: 'center'
        }
    }
];

export const LOGIC_ASSEMBLY_REPEAT_BLOCK: DriveStep[] = [
    {
        element: '#palette-block-REPETIR',
        popover: {
            title: 'BLOQUE REPETIR',
            description: 'Este bloque te permite ejecutar varias veces una secuencia de órdenes. Es muy útil para simplificar tu código.',
            side: "right",
            align: 'center'
        },
        onDeselected: () => {
            const paletteBlock = document.getElementById('palette-block-REPETIR');
            if (paletteBlock) {
                (paletteBlock.children[0] as HTMLElement).click();
            }
        }
    },
    {
        element: '#root-workspace',
        popover: {
            title: 'USANDO REPETIR',
            description: 'Al agregar el bloque REPETIR, puedes colocar dentro las órdenes que quieres que se repitan. El robot las hará tantas veces como indiques.',
            side: "top",
            align: 'center'
        },
        onDeselected: () => {
            const clearButton = document.getElementById('logic-clear-button');
            if (clearButton) {
                clearButton.click();
            }
        }
    },
];

export const LOGIC_ASSEMBLY_ASSIGN_AND_SI_BLOCK: DriveStep[] = [
    {
        element: '#palette-block-ASIGNAR',
        popover: {
            title: 'BLOQUE ASIGNAR',
            description: 'Este bloque te permite guardar valores en variables. Puedes usar variables numéricas o marcar celdas del mapa.',
            side: "right",
            align: 'center'
        },
        onDeselected: () => {
            const paletteBlock = document.getElementById('palette-block-ASIGNAR');
            if (paletteBlock) {
                (paletteBlock.children[0] as HTMLElement).click();
            }
        }
    },
    {
        element: '#root-workspace',
        popover: {
            title: 'VARIABLES NUMÉRICAS',
            description: "Puedes crear variables como ASIGNAR x = 1 o ASIGNAR contador = 5. Luego puedes usar estas variables en condiciones SI, como SI x == 1.",
            side: "top",
            align: 'center'
        },
        onDeselected: () => {
            const clearButton = document.getElementById('logic-clear-button');
            if (clearButton) {
                clearButton.click();
            }
        }
    },
    {
        element: '#root-workspace',
        popover: {
            title: 'MARCAR CELDAS',
            description: "También puedes usar ASIGNAR celda = VERDE para marcar la celda actual del robot con un color. Esto cambia el estado de la celda en el mapa.",
            side: "top",
            align: 'center'
        },
        onDeselected: () => {
            const clearButton = document.getElementById('logic-clear-button');
            if (clearButton) {
                clearButton.click();
            }
        }
    },
    {
        element: '#palette-block-SI',
        popover: {
            title: 'BLOQUE SI',
            description: 'Este bloque te permite ejecutar órdenes solo si se cumple una condición. Es muy útil para tomar decisiones en tu código.',
            side: "right",
            align: 'center'
        },
        onDeselected: () => {
            const paletteBlock = document.getElementById('palette-block-SI');
            if (paletteBlock) {
                (paletteBlock.children[0] as HTMLElement).click();
            }
        }
    },
    {
        element: '#root-workspace',
        popover: {
            title: 'CONDICIONES CON POSICIÓN',
            description: "En las condiciones de SI, las letras x e y se refieren a la posición actual del robot en el mapa. Por ejemplo: SI x == 4 evalúa si el robot está en la columna 4.",
            side: "top",
            align: 'center'
        },
        onDeselected: () => {
            const clearButton = document.getElementById('logic-clear-button');
            if (clearButton) {
                clearButton.click();
            }
        }
    },
    {
        element: '#root-workspace',
        popover: {
            title: 'CONDICIONES CON CELDA',
            description: "La palabra celda en condiciones se refiere al estado de la celda actual del robot. Por ejemplo: SI celda == VERDE verifica si la celda donde está el robot está marcada como VERDE.",
            side: "top",
            align: 'center'
        },
        onDeselected: () => {
            const clearButton = document.getElementById('logic-clear-button');
            if (clearButton) {
                clearButton.click();
            }
        }
    },
    {
        element: '#root-workspace',
        popover: {
            title: 'USAR TUS VARIABLES',
            description: "También puedes usar en condiciones las variables que creaste con ASIGNAR. Por ejemplo: SI contador > 3 usa el valor que guardaste en la variable contador.",
            side: "top",
            align: 'center'
        },
        onDeselected: () => {
            const clearButton = document.getElementById('logic-clear-button');
            if (clearButton) {
                clearButton.click();
            }
        }
    },
];

export const LOGIC_ASSEMBLY_SI_NO_BLOCK: DriveStep[] = [
    {
        element: '#palette-block-SI_NO',
        popover: {
            title: 'BLOQUE SINO',
            description: 'Este bloque es el plan B. Cuando el SI no puede hacer sus órdenes porque no se cumplió lo que pediste, el SINO las hace en su lugar.',
            side: "right",
            align: 'center'
        },
        onDeselected: () => {
            const paletteBlock = document.getElementById('palette-block-SI_NO');
            if (paletteBlock) {
                (paletteBlock.children[0] as HTMLElement).click();
            }
        }
    },
    {
        element: '#root-workspace',
        popover: {
            title: 'COMO USAR SINO',
            description: "Pon el bloque SINO justo después de un bloque SI. Si lo que pediste en el SI se cumple, el robot hace las órdenes de adentro del SI. Si no se cumple, hace las órdenes de adentro del SINO.",
            side: "top",
            align: 'center'
        },
        onDeselected: () => {
            const clearButton = document.getElementById('logic-clear-button');
            if (clearButton) {
                clearButton.click();
            }
        }
    },
    {
        element: '#root-workspace',
        popover: {
            title: 'SI Y SINO JUNTOS',
            description: "Con estos dos bloques siempre pasa algo: SI funciona haces una cosa, SI NO funciona haces otra. El robot nunca se queda sin hacer nada.",
            side: "top",
            align: 'center'
        },
        onDeselected: () => {
            const clearButton = document.getElementById('logic-clear-button');
            if (clearButton) {
                clearButton.click();
            }
        }
    },
];

export const LOGIC_TUTORIAL_CONFIG = {
    showProgress: true,
    animate: true,
    smoothScroll: true,
    popoverClass: 'reboot-tutorial-popover',
    popoverOffset: 12,
    progressText: 'PASO {{current}} DE {{total}}',
    nextBtnText: 'CONTINUAR',
    prevBtnText: 'REGRESAR',
    doneBtnText: 'LISTO',
};
