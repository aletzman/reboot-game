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
 * Tutorial para el nivel 1-11: Introducción a REPETIR (Bucles).
 */
export const REPEAT_TUTORIAL: DriveStep[] = [
    {
        element: '#command-bank',
        popover: {
            title: 'NUEVO BOTÓN: REPETIR',
            description: 'He añadido un botón nuevo de color morado. Te ayudará a llegar muy lejos sin tener que usar tantas tarjetas.',
            side: "left"
        }
    },
    {
        element: '#command-bank',
        popover: {
            title: '¿PARA QUÉ SIRVE?',
            description: 'Este botón hace que el robot vuelva a hacer todo lo que ya habías puesto en tu lista. ¡Es como volver a empezar el camino!',
            side: "left"
        }
    },
    {
        element: '#command-bank',
        popover: {
            title: 'ELIGE LAS VECES',
            description: 'Cuando pulses el botón morado, elige cuántas veces quieres repetir.',
            side: "left"
        }
    },
    {
        element: '#main-routine',
        popover: {
            title: 'EL ORDEN DEL CAMINO',
            description: 'Primero pon tus flechas y, al final de todo, añade el botón de REPETIR. ¡Así el robot sabrá qué partes debe repetir!',
            side: "left"
        }
    }
];

/**
 * Tutorial para el nivel 1-16: Introducción a Funciones (SUB F1).
 */
export const FUNCTION_TUTORIAL: DriveStep[] = [
    {
        element: '#f1-routine',
        popover: {
            title: 'NUEVA CAJA: SUB F1',
            description: 'He añadido esta caja azul. Es como un cajón especial donde puedes guardar un grupo de movimientos.',
            side: "left"
        }
    },
    {
        element: '#f1-routine',
        popover: {
            title: '¿CÓMO SE USA?',
            description: 'Pon aquí dentro las flechas que quieras. El robot las "aprenderá" para usarlas cuando tú se lo pidas.',
            side: "left"
        }
    },
    {
        element: '#command-bank',
        popover: {
            title: 'USA LA TARJETA AZUL',
            description: 'Ahora, pon la tarjeta azul de F1 en tu lista de arriba. Cuando el robot la lea, hará todo lo que guardaste en la caja azul.',
            side: "left"
        }
    },
    {
        element: '#f1-routine',
        popover: {
            title: 'AHORRA ESPACIO',
            description: 'Esto sirve para que el robot haga muchas cosas usando solo una tarjeta en la lista principal. ¡Es muy útil!',
            side: "top"
        }
    }
];

/**
 * Tutorial para el nivel 1-23: Introducción a SUB F2.
 */
export const FUNCTION_F2_TUTORIAL: DriveStep[] = [
    {
        element: '#f2-routine',
        popover: {
            title: 'OTRA CAJA MÁS: SUB F2',
            description: '¡Ahora tienes dos cajones! He habilitado la caja morada SUB F2 para que guardes todavía más movimientos.',
            side: "left"
        }
    },
    {
        element: '#command-bank',
        popover: {
            title: 'TARJETA MORADA',
            description: 'Usa la tarjeta morada de F2 en tu lista para que el robot haga lo que guardaste en el segundo cajón.',
            side: "left"
        }
    },
    {
        element: '#f2-routine',
        popover: {
            title: 'COMBÍNALAS TODAS',
            description: 'Puedes usar F1 para una cosa y F2 para otra. ¡Incluso puedes meter una dentro de la otra para hacer trucos increíbles!',
            side: "top"
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
