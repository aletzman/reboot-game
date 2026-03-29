import { NextRequest, NextResponse } from "next/server";
import levelsData from "@/data/levels.json";

/**
 * GET /api/levels/[id]
 *
 * Devuelve un nivel específico por su ID.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const level = levelsData.levels.find((l) => l.id === id);

  if (!level) {
    return NextResponse.json(
      { error: `Nivel con id '${id}' no encontrado.` },
      { status: 404 }
    );
  }

  return NextResponse.json({ level });
}
