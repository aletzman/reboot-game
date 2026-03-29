import { NextRequest, NextResponse } from "next/server";
import levelsData from "@/data/levels.json";

/**
 * GET /api/levels
 *
 * Query params opcionales:
 *   ?act=1        → filtra por acto
 *   ?type=noderoutine → filtra por tipo de nivel
 *   ?id=1-01      → devuelve un nivel específico
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const actParam = searchParams.get("act");
  const typeParam = searchParams.get("type");
  const idParam = searchParams.get("id");

  let levels = levelsData.levels;

  // Filtro por ID específico
  if (idParam) {
    const level = levels.find((l) => l.id === idParam);
    if (!level) {
      return NextResponse.json(
        { error: `Nivel con id '${idParam}' no encontrado.` },
        { status: 404 }
      );
    }
    return NextResponse.json({ level });
  }

  // Filtro por acto
  if (actParam !== null) {
    const actNumber = parseInt(actParam, 10);
    if (isNaN(actNumber)) {
      return NextResponse.json(
        { error: "El parámetro 'act' debe ser un número." },
        { status: 400 }
      );
    }
    levels = levels.filter((l) => l.act === actNumber);
  }

  // Filtro por tipo
  if (typeParam) {
    levels = levels.filter((l) => l.type === typeParam);
  }

  return NextResponse.json({
    total: levels.length,
    levels,
  });
}
