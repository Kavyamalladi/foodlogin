type Variant = { id: string; weight: string; price: number };

/** Size chips: equal-width single row for up to 3 sizes (no ragged wrapping). Hit area is padded to 44px with ::after. */
export function SizePicker({
  variants,
  selectedId,
  onSelect,
  label,
}: {
  variants: Variant[];
  selectedId: string;
  onSelect: (id: string) => void;
  label: string;
}) {
  if (variants.length < 2) return null;
  return (
    <div role="radiogroup" aria-label={label} className={variants.length <= 3 ? `grid gap-1.5 ${variants.length === 2 ? "grid-cols-2" : "grid-cols-3"}` : "flex flex-wrap gap-1.5"}>
      {variants.map((v) => {
        const on = v.id === selectedId;
        return (
          <button
            key={v.id}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onSelect(v.id)}
            className={`relative h-8 rounded-full border px-1 text-xs font-bold tabular-nums transition-colors after:absolute after:-inset-x-1 after:-inset-y-1.5 after:content-[''] ${
              on ? "border-brand bg-brand text-white" : "border-ink/20 bg-white text-ink hover:border-brand"
            }`}
          >
            {v.weight}
          </button>
        );
      })}
    </div>
  );
}
