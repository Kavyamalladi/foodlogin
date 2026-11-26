/** Indian food-labelling mark: green dot in a square = vegetarian, red = non-vegetarian. */
export function DietDot({ nonVeg, label = false, className = "" }: { nonVeg: boolean; label?: boolean; className?: string }) {
  const text = nonVeg ? "Non-vegetarian" : "Vegetarian";
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <span
        role="img"
        aria-label={text}
        className={`inline-flex size-[18px] items-center justify-center rounded-[4px] border-2 bg-white ${nonVeg ? "border-red-700" : "border-green-700"}`}
      >
        <span className={`size-2 rounded-full ${nonVeg ? "bg-red-700" : "bg-green-700"}`} />
      </span>
      {label && <span className="text-sm font-bold text-ink/80">{text}</span>}
    </span>
  );
}
