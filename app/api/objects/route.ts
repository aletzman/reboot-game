import { NextRequest, NextResponse } from "next/server";
import objectsData from "@/data/objects.json";

/**
 * GET /api/objects
 *
 * Query params opcionales:
 *   ?id=linterna_rota   → devuelve un objeto específico
 *   ?type=key           → filtra por tipo (key, hint, lore, final)
 *   ?required=true      → filtra solo los objetos requeridos
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const idParam = searchParams.get("id");
  const typeParam = searchParams.get("type");
  const requiredParam = searchParams.get("required");

  let objects = objectsData.objects;

  // Objeto específico por ID
  if (idParam) {
    const obj = objects.find((o) => o.id === idParam);
    if (!obj) {
      return NextResponse.json(
        { error: `Objeto con id '${idParam}' no encontrado.` },
        { status: 404 }
      );
    }
    return NextResponse.json({ object: obj });
  }

  // Filtro por tipo
  if (typeParam) {
    const validTypes = ["key", "hint", "lore", "final"];
    if (!validTypes.includes(typeParam)) {
      return NextResponse.json(
        { error: `Tipo inválido. Opciones: ${validTypes.join(", ")}` },
        { status: 400 }
      );
    }
    objects = objects.filter((o) => o.type === typeParam);
  }

  // Filtro por requerido
  if (requiredParam !== null) {
    const isRequired = requiredParam === "true";
    objects = objects.filter((o) => o.required === isRequired);
  }

  return NextResponse.json({
    total: objects.length,
    objects,
  });
}
