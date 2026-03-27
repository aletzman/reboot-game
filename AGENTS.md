# AGENTS.md — REBOOT

Guía para agentes de IA que trabajen en este proyecto.
Lee este archivo completo antes de tocar cualquier cosa.

---

## Qué es este proyecto

**REBOOT** es un juego educativo de programación con estética post-apocalíptica.
El jugador es un sobreviviente que aprende a programar para reconstruir el mundo.

Stack: Next.js 14 (App Router) + Tailwind CSS + Phaser.js + Supabase.
Deploy: CubePath (un solo servidor Next.js).

---

## Estructura de carpetas

```
reboot/
├── app/
│   ├── page.tsx                  # Pantalla de inicio + creación de personaje
│   ├── game/page.tsx             # Mapa del mundo con sectores
│   ├── level/[id]/page.tsx       # Nivel dinámico (detecta tipo por JSON)
│   ├── collection/page.tsx       # Colección de cartas del jugador
│   └── api/
│       ├── validate/route.ts     # Valida código JS del usuario (sandbox)
│       └── progress/route.ts     # Guarda/lee progreso en Supabase
├── components/
│   ├── levels/
│   │   ├── NodeRoutineLevel.tsx     # Nivel tipo NodeRoutine (flechas arrastrables)
│   │   ├── LogicAssemblyLevel.tsx      # Nivel tipo LogicAssembly (bloques visuales)
│   │   ├── PuzzleLevel.tsx       # Puzzles intermedios (4 subtipos)
│   │   ├── SpeedTypingLevel.tsx  # Speed typing contra el reloj
│   │   └── CodeEditorLevel.tsx   # Editor Monaco con JS real
│   ├── robot/
│   │   ├── IsometricMap.tsx      # Mapa isométrico con Phaser.js
│   │   └── RobotSprite.tsx       # Sprite y animaciones del robot
│   ├── cards/
│   │   ├── CardDrop.tsx          # Animación de carta desbloqueada
│   │   └── CardCollection.tsx    # Vista de colección completa
│   ├── frag/
│   │   └── FragAssistant.tsx     # IA auxiliar (1 uso por nivel)
│   └── ui/
│       ├── Button.tsx
│       ├── Modal.tsx
│       └── StarRating.tsx
├── data/
│   ├── levels.json               # Definición de todos los niveles
│   ├── cards.json                # 24 cartas con rareza y descripción
│   └── dialogues.json            # Textos narrativos de FRAG y la historia
├── lib/
│   ├── supabase.ts               # Cliente de Supabase (server + client)
│   ├── gameState.ts              # Lógica de progreso (localStorage + Supabase)
│   └── sandbox.ts                # Ejecutar JS del usuario de forma segura
└── public/
    └── assets/                   # Sprites, tilesets, sonidos
```

---

## Paleta de colores — SIEMPRE usar estas variables

```css
/* Fondos (de más oscuro a más claro) */ 
--bg-void:        #010101   /* fondo base de la app */
--bg-deep:        #060809   /* pantallas de juego */
--bg-surface:     #090C10   /* paneles, editor de código */
--bg-elevated:    #0F1318   /* cards, modales */
--bg-hover:       #141B24   /* hover states, bordes sutiles */

/* Verde ácido principal — color identidad del juego */
--green-darkest:  #0d1f00   /* fondo botones activos */
--green-dark:     #1a4d00   /* botones primarios */
--green-base:     #2d7800   /* bordes, iconos, links */
--green-light:    #55e200   /* texto principal de UI ← color identidad */
--green-muted:    #88c44d   /* texto secundario */

/* Texto general */
--text-primary:   #E6EDF3   /* texto blanco limpio */
--text-muted:     #8B949E   /* texto secundario */
--text-ghost:     #3D444D   /* placeholders, hints */

/* Semánticos — estados del juego */
--amber:          #EF9F27   /* cartas raras, advertencias */
--purple:         #7F77DD   /* FRAG (IA auxiliar), cartas épicas */
--red:            #E24B4A   /* error, código incorrecto */
--blue:           #378ADD   /* info, cartas comunes */
--cyan:           #12b0bb   /* color de acento */ 
```

**Reglas de color:**
- FRAG siempre usa `--purple`. Sin excepciones.
- Código correcto → `--green-light`. Código con error → `--red`.
- Nunca hardcodees colores hex en componentes. Usa siempre las variables.
- El fondo de cualquier pantalla de juego es `--bg-deep` o `--bg-void`.

---

## Tipografía

- UI del juego (paneles, comandos, botones): `font-family: var(--font-mono)` — Geist Mono
- Texto narrativo (historia, diálogos): `font-family: var(--font-sans)` — Geist Sans
- Nunca uses otras fuentes.

---

## Sistema de niveles

Cada nivel está definido en `data/levels.json` con esta estructura:

```json
{
  "id": "sector-01-level-01",
  "type": "noderoutine",
  "sector": 1,
  "title": "Primera señal",
  "narrative": "Texto que aparece antes del nivel",
  "map": [[...]],
  "solution": [...],
  "cards": ["card-001"],
  "fragHint": "Texto de ayuda de FRAG si el jugador la usa"
}
```

**Tipos de nivel (`type`):**
- `noderoutine` — flechas arrastrables, robot en mapa isométrico
- `logicassembly` — bloques visuales drag & drop
- `puzzle-sort` — ordenar líneas de código
- `puzzle-fill` — completar el código (fill in the blank)
- `puzzle-bug` — encontrar el bug
- `puzzle-match` — emparejar concepto con definición
- `speedtyping` — tipear código contra el reloj
- `codeeditor` — Monaco Editor con JS real

El componente `level/[id]/page.tsx` detecta el `type` y renderiza el componente correspondiente. No mezcles lógica de un tipo en otro.

---

## Sistema de cartas

24 cartas en `data/cards.json`. Estructura:

```json
{
  "id": "card-001",
  "name": "Bucle básico",
  "rarity": "common",
  "concept": "for loop",
  "description": "Dominas el for loop. El robot puede repetir acciones.",
  "unlockedBy": "sector-01-level-03"
}
```

**Rareza y colores:**
- `common`    → `--blue`
- `rare`      → `--amber`
- `epic`      → `--purple`
- `legendary` → degradado `--amber` a `--purple` (único caso permitido)

---

## Progreso del jugador — gameState.ts

**Niveles 1–3:** todo en `localStorage`. Clave: `reboot_save`.
**Nivel 4 en adelante:** requiere login. Migra localStorage a Supabase automáticamente.

Estructura del save:

```ts
interface GameSave {
  player: {
    name: string
    gender: 'él' | 'ella' | 'elle'
  }
  progress: {
    [levelId: string]: {
      completed: boolean
      stars: 1 | 2 | 3
      usedFrag: boolean
    }
  }
  cards: string[]        // ids de cartas desbloqueadas
  fragUsedTotal: number  // para la carta secreta (nunca usar FRAG)
}
```

**Nunca modifiques el save directamente.** Usa siempre las funciones de `gameState.ts`:
- `saveProgress(levelId, stars, usedFrag)`
- `unlockCard(cardId)`
- `getPlayerSave()`
- `migrateToSupabase(userId)`

---

## FRAG — la IA auxiliar

- FRAG usa **siempre** `--purple` en UI. Nunca otro color.
- Máximo **1 uso por nivel**. Después de usarlo, el botón se deshabilita.
- Si el jugador usa FRAG, `usedFrag: true` en el save y no obtiene la tercera estrella.
- Los textos de FRAG vienen de `data/dialogues.json`, clave `fragHints`.
- FRAG nunca da la solución completa. Solo una pista direccional.

---

## Phaser.js — reglas de integración con Next.js

- **Nunca importes Phaser en el servidor.** Siempre con dynamic import:
  ```ts
  const PhaserGame = dynamic(() => import('@/components/robot/IsometricMap'), {
    ssr: false
  })
  ```
- El canvas de Phaser va dentro de un `div` con id `phaser-container`.
- Destruye la instancia de Phaser en el `useEffect` cleanup para evitar memory leaks:
  ```ts
  useEffect(() => {
    const game = new Phaser.Game(config)
    return () => game.destroy(true)
  }, [])
  ```

---

## Sandbox de código del usuario

El código JS que escribe el jugador en `CodeEditorLevel` se ejecuta en un **Web Worker** aislado. Nunca lo ejecutes directamente con `eval()`.

El robot expone solo esta API al jugador:

```js
robot.move(n)          // avanza n celdas
robot.turn('left' | 'right')
robot.jump()
robot.activate()       // activa mecanismos del mapa
```

Timeout máximo de ejecución: **3 segundos**. Si se supera, el nivel muestra error con `--red`.

---

## Convenciones de código

- Componentes: PascalCase (`NodeRoutineLevel.tsx`)
- Funciones y variables: camelCase (`saveProgress`)
- Constantes globales: UPPER_SNAKE (`MAX_FRAG_USES`)
- Archivos de datos: kebab-case (`levels.json`)
- IDs de niveles: `sector-XX-level-XX` (ej: `sector-01-level-03`)
- IDs de cartas: `card-XXX` (ej: `card-012`)

---

## Lo que NO debes hacer

- No uses `eval()` para ejecutar código del usuario. Usa el sandbox.
- No hardcodees colores hex en componentes. Usa las variables CSS.
- No importes Phaser con SSR activo. Siempre `ssr: false`.
- No modifiques `data/levels.json` o `data/cards.json` sin verificar IDs únicos.
- No guardes el progreso directamente en localStorage. Usa `gameState.ts`.
- No uses `position: fixed` en componentes del juego (rompe el layout de Next.js).
- No mezcles la lógica de dos tipos de nivel en un mismo componente.

---

## Estado actual del proyecto (hackathon build)

- [ ] Pantalla de inicio con creación de personaje
- [ ] Nivel 1: NodeRoutine (sector 1)
- [ ] Sistema de cartas (animación de desbloqueo)
- [ ] Mapa del mundo (sectores)
- [ ] Nivel 2: LogicAssembly
- [ ] Puzzles intermedios
- [ ] Speed typing
- [ ] Editor Monaco
- [ ] Auth con Google/GitHub (Supabase)
- [ ] Deploy en CubePath

Fecha límite: **31 de marzo de 2026 a las 23:59 CET**
