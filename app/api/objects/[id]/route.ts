import { NextRequest, NextResponse } from "next/server";
import objectsData from "@/data/objects.json";

/**
 * GET /api/objects/[id]
 *
 * Devuelve un objeto específico por su ID.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const obj = objectsData.objects.find((o) => o.id === id);

  if (!obj) {
    return NextResponse.json(
      { error: `Objeto con id '${id}' no encontrado.` },
      { status: 404 }
    );
  }

  return NextResponse.json({ object: obj });
}
