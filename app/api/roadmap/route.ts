import { NextResponse } from "next/server";
import roadmapData from "@/data/roadmap.json";

/**
 * GET /api/roadmap
 *
 * Devuelve el roadmap pedagógico completo del juego.
 */
export async function GET() {
  return NextResponse.json(roadmapData);
}
