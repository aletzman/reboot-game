import { NextRequest, NextResponse } from "next/server";
import glossaryData from "@/data/glossary.json";

/**
 * GET /api/glossary
 *
 * Query params opcionales:
 *   ?id=boolean    → devuelve un término específico
 *   ?search=var    → búsqueda parcial en el campo 'term'
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const idParam = searchParams.get("id");
  const searchQuery = searchParams.get("search");

  let terms = glossaryData.terms;

  // Término específico por ID
  if (idParam) {
    const term = terms.find((t) => t.id === idParam);
    if (!term) {
      return NextResponse.json(
        { error: `Término con id '${idParam}' no encontrado.` },
        { status: 404 }
      );
    }
    return NextResponse.json({ term });
  }

  // Búsqueda parcial
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    terms = terms.filter((t) => t.term.toLowerCase().includes(query));
  }

  return NextResponse.json({
    total: terms.length,
    terms,
  });
}
