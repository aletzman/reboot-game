import { createClient } from '@supabase/supabase-js'
import fs from 'fs/promises'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY // Needed to bypass RLS for inserts

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Falta NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function seed() {
  try {
    // 1. Seed Cards
    console.log("Leyendo cards.json...")
    const cardsData = JSON.parse(await fs.readFile('./data/cards.json', 'utf-8'))
    const { error: cardsErr } = await supabase.from('cards').upsert(cardsData.cards)
    if (cardsErr) throw cardsErr
    console.log("✅ Cartas importadas a Supabase.")

    // 2. Seed Objects
    console.log("Leyendo objects.json...")
    const objectsData = JSON.parse(await fs.readFile('./data/objects.json', 'utf-8'))
    const { error: objErr } = await supabase.from('objects').upsert(objectsData.objects)
    if (objErr) throw objErr
    console.log("✅ Objetos importados a Supabase.")

    // 3. Seed Levels
    console.log("Leyendo levels.json...")
    const levelsData = JSON.parse(await fs.readFile('./data/levels.json', 'utf-8'))
    const { error: lvlErr } = await supabase.from('levels').upsert(levelsData.levels)
    if (lvlErr) throw lvlErr
    console.log("✅ Niveles importados a Supabase.")

    console.log("🎉 Proceso de Seeding Completado Sastisfactoriamente.")
  } catch (err) {
    console.error("❌ Error en seeding:", err)
  }
}

seed()
