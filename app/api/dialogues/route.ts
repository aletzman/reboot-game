import { NextResponse } from "next/server";
import dialoguesData from "@/data/dialogues.json";

/**
 * GET /api/dialogues
 *
 * Devuelve todos los diálogos del juego (FRAG + narrativa).
 */
export async function GET() {
  return NextResponse.json(dialoguesData);
}
