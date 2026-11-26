/**
 * Product descriptions are plain text. Normal lines are the story; lines like
 * "Ingredients: rice flour, jaggery" or "Shelf life: 10 days" become a neat facts list
 * (the way competitors show them), so the owner can edit everything in the admin textarea.
 */
// Only known labels count, so an ordinary sentence with a colon stays a paragraph.
const FACT = /^((?:ingredients?|shelf life|storage|how to store|how to eat|best with|pieces|pack|net weight|serves|spice level|heat|sweetness|allergens?|contains)[A-Za-z0-9 ()/&.-]{0,24}):\s+(.+)$/i;

export function parseDescription(text: string | null | undefined) {
  const paragraphs: string[] = [];
  const facts: { label: string; value: string }[] = [];
  for (const raw of (text ?? "").split(/\n+/)) {
    const line = raw.trim();
    if (!line) continue;
    const m = FACT.exec(line);
    if (m) facts.push({ label: m[1].trim(), value: m[2].trim() });
    else paragraphs.push(line);
  }
  return { paragraphs, facts };
}
