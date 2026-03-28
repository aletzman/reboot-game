import { LanguageOption } from './types'

export const LANGUAGES: LanguageOption[] = [
    {
        id: 'javascript',
        name: 'JavaScript',
        status: 'active',
        description: 'El lenguaje de la web. Corre en el browser y en el servidor.',
        detail: 'Sobrevivió El Silencio en el sistema más aislado del laboratorio. Operativo al 100%.',
        year: 'creado en 1995',
    },
    {
        id: 'python',
        name: 'Python',
        status: 'damaged',
        description: 'Simple y poderoso. Usado en ciencia de datos e IA.',
        detail: 'Sistema dañado durante El Silencio. Requiere reparación del compilador.',
        year: 'creado en 1991',
    },
    {
        id: 'csharp',
        name: 'C#',
        status: 'damaged',
        description: 'Robusto y tipado. Base del ecosistema .NET.',
        detail: 'Módulo de runtime corrompido. No disponible.',
        year: 'creado en 2000',
    },
    {
        id: 'rust',
        name: 'Rust',
        status: 'damaged',
        description: 'Velocidad y seguridad de memoria sin garbage collector.',
        detail: 'Error crítico en el linker. Requiere reconstrucción completa.',
        year: 'creado en 2010',
    },
    {
        id: 'go',
        name: 'Go',
        status: 'damaged',
        description: 'Concurrencia nativa. Diseñado para sistemas distribuidos.',
        detail: 'Paquetes de red dañados. Parcialmente recuperable.',
        year: 'creado en 2009',
    },
]
