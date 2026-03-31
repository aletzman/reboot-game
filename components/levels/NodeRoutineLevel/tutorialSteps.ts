import { DriveStep } from "driver.js";

/**
 * Pasos del tutorial para el modo NodeRoutine (primer nivel).
 * Estos diálogos son didácticos y están adaptados para principiantes.
 */
export const NODE_ROUTINE_TUTORIAL: DriveStep[] = [
    {
        element: '#mission-objective',
        popover: {
            title: '¿QUÉ HAY QUE HACER?',
            description: 'Aquí verás el objetivo actual. Lee con atención: te dirá a dónde debe llegar el robot para avanzar.',
            side: "bottom",
            align: 'center'
        }
    },
    {
        element: '#game-canvas-container',
        popover: {
            title: 'VISTA DEL MUNDO',
            description: 'Este es el lugar donde está el robot. Tu meta es llevarlo hasta las baldosas que brillan para encenderlas.',
            side: "right",
            align: 'center'
        }
    },
    {
        element: '#command-bank',
        popover: {
            title: 'TUS TARJETAS',
            description: 'Estas son las acciones que el robot puede hacer. Haz clic en una para ponerla en tu lista.',
        }
    },
    {
        element: '#main-routine',
        popover: {
            title: 'EL CAMINO DEL ROBOT',
            description: 'Aquí verás las tarjetas que has elegido. El robot las leerá una por una, de izquierda a derecha, de arriba hacia abajo para moverse.',
        }
    },
    {
        element: '#execute-button',
        popover: {
            title: '¡A MOVERSE!',
            description: 'Cuando creas que tienes la ruta lista, pulsa este botón para que el robot empiece a caminar.',
        }
    },
    {
        element: '#system-logs',
        popover: {
            title: 'AVISOS DE FRAG',
            description: 'Echa un vistazo aquí si algo no funciona. Yo te daré pistas si el robot se pierde o si hay algún problema.',
        }
    }
];

/**
 * Configuración base de Driver.js para mantener la estética de REBOOT.
 */
export const TUTORIAL_CONFIG = {
    showProgress: true,
    animate: true,
    smoothScroll: true,
    popoverClass: 'reboot-tutorial-popover',
    popoverOffset: 12,
    progressText: 'PASO {{current}} DE {{total}}',
    nextBtnText: 'SIGUIENTE',
    prevBtnText: 'ANTERIOR',
    doneBtnText: 'ENTENDIDO',
};
