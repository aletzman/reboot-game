import { NextRequest, NextResponse } from "next/server";
import glossaryData from "@/data/glossary.json";

/**
 * GET /api/glossary/[id]
 *
 * Devuelve un término del glosario por su ID.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const term = glossaryData.terms.find((t) => t.id === id);

  if (!term) {
    return NextResponse.json(
      { error: `Término con id '${id}' no encontrado.` },
      { status: 404 }
    );
  }

  return NextResponse.json({ term });
}
