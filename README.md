# REBOOT 🤖 — Reconstruye el Mundo a través del Código

[![Despliegue en CubePath](https://img.shields.io/badge/Despliegue-CubePath-00E200?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://reboot-game.cubepath.app)
[![Hackathon](https://img.shields.io/badge/Hackathon-CubePath_2026-7F77DD?style=for-the-badge)](https://github.com/midudev/hackaton-cubepath-2026)

**REBOOT** es una aventura educativa post-apocalíptica diseñada para enseñar lógica de programación y JavaScript. En un mundo donde la tecnología ha colapsado, eres un sobreviviente encargado de "reiniciar" la civilización aprendiendo a dominar y reparar antiguos sistemas de hardware.

![Reboot Game Landing Page](AQUÍ_SUBE_LA_IMAGEN_DE_HOME)

---

## 🕹️ Experiencia de Juego

La supervivencia en REBOOT depende de tu habilidad para dominar el lenguaje de las máquinas. El juego te guía a través de una ruta de aprendizaje progresiva:

1.  **Secuencias de Comandos:** Guía a un robot recolector a través de ruinas isométricas usando nodos de dirección.
2.  **Ensamblaje Lógico:** Construye comportamientos complejos con bloques lógicos visuales para automatizar sistemas.
3.  **Diagnóstico de Sistemas:** Repara código "corrupto" encontrando bugs, ordenando instrucciones y llenando vacíos lógicos.
4.  **Protocolos de Emergencia:** Escribe código real bajo presión en brechas de seguridad de tipeo rápido.
5.  **Reinicio del Núcleo:** Interfaz directa con un editor de código real (Monaco) para programar la inteligencia central del planeta.

---

## 🛠️ Stack Tecnológico de Vanguardia

REBOOT está construido con una interfaz industrial de alta fidelidad y las últimas tecnologías web:

-   **Framework:** [Next.js 16.2.0](https://nextjs.org/) (App Router & Turbopack)
-   **Motor:** [React 19](https://react.dev/) + [Phaser.js](https://phaser.io/) (Motor de mapas isométricos)
-   **Estilos:** [Tailwind CSS 4.0](https://tailwindcss.com/) & [Framer Motion](https://www.framer.com/motion/)
-   **Base de Datos y Auth:** [Supabase](https://supabase.com/)
-   **Editor de Código:** [Monaco Editor](https://microsoft.github.io/monaco-editor/)
-   **Despliegue:** [CubePath](https://cubepath.com/)

---

## 📂 Estructura del Proyecto

```text
reboot-game/
├── app/              # Next.js App Router (Páginas y API)
├── components/       # Componentes del juego (Niveles, Robot, Cartas, UI)
├── data/             # JSONs de Niveles, Cartas y Diálogos Narrativos
├── lib/              # Lógica de Supabase, Estado del Juego y Sandbox JS
├── public/           # Recursos del juego (Sprites, Tilesets, Sonidos)
└── styles/           # Tokens visuales globales y colores de identidad
```

---

## 🚀 Instalación Local

1.  **Clona el repositorio:**
    ```bash
    git clone https://github.com/AletzMan/reboot-game.git
    cd reboot-game
    ```

2.  **Instala las dependencias:**
    ```bash
    npm install
    ```

3.  **Configuración del Entorno:** Crea un archivo `.env.local` con tus credenciales de Supabase:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=tu_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_llave
    ```

4.  **Ejecuta el Servidor de Desarrollo:**
    ```bash
    npm run dev
    ```

---

## 🤖 Conoce a FRAG — Tu Compañera de IA

FRAG es tu asistente de IA rescatada. Ella proporciona pistas cuando te quedas atascado, pero recuerda: su ayuda tiene un costo en eficiencia. Lograr 3 estrellas en un nivel requiere resolver los acertijos sin su intervención.

---

## 📜 Licencia

Distribuido bajo la Licencia MIT. Ver `LICENSE` para más información.

---

### 📩 Contacto

Alejandro — [📩 Enviar un Email](mailto:alejo_2986@hotmail.com)

Enlace del Proyecto: [https://github.com/AletzMan/reboot-game](https://github.com/AletzMan/reboot-game)
