import { NextRequest, NextResponse } from "next/server";
import cardsData from "@/data/cards.json";

/**
 * GET /api/cards/[id]
 *
 * Devuelve una carta específica por su ID.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const card = cardsData.cards.find((c) => c.id === id);

  if (!card) {
    return NextResponse.json(
      { error: `Carta con id '${id}' no encontrada.` },
      { status: 404 }
    );
  }

  return NextResponse.json({ card });
}
