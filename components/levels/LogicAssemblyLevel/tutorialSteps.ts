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
        element: '#logic-workspace',
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
