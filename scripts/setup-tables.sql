-- Crear tabla de cards
CREATE TABLE IF NOT EXISTS cards (
  "id" text PRIMARY KEY,
  "name" text NOT NULL,
  "rarity" text NOT NULL,
  "concept" text NOT NULL,
  "unlockedBy" text NOT NULL,
  "actName" text NOT NULL,
  "frontArt" text NOT NULL,
  "description" text NOT NULL,
  "humanExplanation" text NOT NULL,
  "codeExample" text,
  "tip" text NOT NULL
);

-- Crear tabla de objects
CREATE TABLE IF NOT EXISTS objects (
  "id" text PRIMARY KEY,
  "name" text NOT NULL,
  "icon" text NOT NULL,
  "obtainedIn" text NOT NULL,
  "description" text NOT NULL,
  "lore" text NOT NULL,
  "type" text NOT NULL,
  "required" boolean NOT NULL,
  "usedIn" jsonb NOT NULL DEFAULT '[]'::jsonb,
  "effect" text NOT NULL,
  "inventoryNote" text NOT NULL,
  "obtainCondition" text
);

-- Crear tabla de levels
CREATE TABLE IF NOT EXISTS levels (
  "id" text PRIMARY KEY,
  "act" integer,
  "actName" text,
  "type" text,
  "title" text,
  "description" text,
  "narrative" text,
  "mechanic" text,
  "concept" text,
  "codeExample" text,
  "fragAvailable" boolean DEFAULT false,
  "fragHint" jsonb,
  "optional" boolean DEFAULT false,
  "isReview" boolean DEFAULT false,
  "reviewOf" jsonb DEFAULT '[]'::jsonb,
  "requiredObjects" jsonb DEFAULT '[]'::jsonb,
  "rewardObjects" jsonb DEFAULT '[]'::jsonb,
  "rewardCards" jsonb DEFAULT '[]'::jsonb,
  "failRedirectTo" text,
  "reviewFailRedirect" jsonb,
  "hintObjects" jsonb,
  "maxStars" smallint,
  "note" text,
  "theory" jsonb,
  "pitfalls" jsonb,
  "challenge" jsonb,
  "map" jsonb,
  "robotStart" jsonb,
  "targets" jsonb,
  "maxCommands" integer,
  "allowedCommands" jsonb,
  "allowF1" boolean,
  "maxF1Commands" integer,
  "uiLimitMain" integer,
  "uiLimitF1" integer,
  "solution" jsonb,
  "tests" jsonb,
  "pairs" jsonb,
  "code" text,
  "lines" jsonb,
  "items" jsonb,
  "fillAnswers" jsonb,
  "initialCode" text,
  "avoidSyntax" jsonb,
  "highlightLines" jsonb,
  "step" integer
);

-- Habilitar RLS pero permitir lectura publica para las 3 tablas
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE objects ENABLE ROW LEVEL SECURITY;
ALTER TABLE levels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to cards" ON cards FOR SELECT USING (true);
CREATE POLICY "Allow public read access to objects" ON objects FOR SELECT USING (true);
CREATE POLICY "Allow public read access to levels" ON levels FOR SELECT USING (true);
