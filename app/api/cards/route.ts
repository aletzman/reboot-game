import { NextRequest, NextResponse } from "next/server";
import cardsData from "@/data/cards.json";

/**
 * GET /api/cards
 *
 * Query params opcionales:
 *   ?rarity=common     → filtra por rareza (common, rare, epic, legendary)
 *   ?id=card-001       → devuelve una carta específica
 *   ?actName=Boot.exe  → filtra por nombre de acto
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const rarityParam = searchParams.get("rarity");
  const idParam = searchParams.get("id");
  const actNameParam = searchParams.get("actName");

  let cards = cardsData.cards;

  // Carta específica por ID
  if (idParam) {
    const card = cards.find((c) => c.id === idParam);
    if (!card) {
      return NextResponse.json(
        { error: `Carta con id '${idParam}' no encontrada.` },
        { status: 404 }
      );
    }
    return NextResponse.json({ card });
  }

  // Filtro por rareza
  if (rarityParam) {
    const validRarities = ["common", "rare", "epic", "legendary"];
    if (!validRarities.includes(rarityParam)) {
      return NextResponse.json(
        { error: `Rareza inválida. Opciones: ${validRarities.join(", ")}` },
        { status: 400 }
      );
    }
    cards = cards.filter((c) => c.rarity === rarityParam);
  }

  // Filtro por acto
  if (actNameParam) {
    cards = cards.filter((c) => c.actName === actNameParam);
  }

  return NextResponse.json({
    total: cards.length,
    cards,
  });
}
