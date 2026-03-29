import type { Dialogues } from '@/types/game'

import { getBaseUrl } from './baseUrl'

const BASE = () => `${getBaseUrl()}/api/dialogues`

/**
 * Obtiene todos los diálogos del juego (FRAG + narrativa).
 */
export async function getDialogues(): Promise<Dialogues> {
  const res = await fetch(BASE(), { cache: 'force-cache' })

  if (!res.ok) throw new Error(`Error al obtener diálogos: ${res.statusText}`)

  return res.json()
}

/**
 * Obtiene un intro aleatorio de FRAG.
 */
export async function getRandomFragIntro(): Promise<string> {
  const data = await getDialogues()
  const intros = data.frag.intros
  return intros[Math.floor(Math.random() * intros.length)]
}

/**
 * Obtiene una reacción de fallo aleatoria de FRAG.
 */
export async function getRandomFragFailReaction(): Promise<string> {
  const data = await getDialogues()
  const reactions = data.frag.fail_reactions
  return reactions[Math.floor(Math.random() * reactions.length)]
}

/**
 * Obtiene una reacción de éxito aleatoria de FRAG.
 */
export async function getRandomFragSuccessReaction(): Promise<string> {
  const data = await getDialogues()
  const reactions = data.frag.success_reactions
  return reactions[Math.floor(Math.random() * reactions.length)]
}
