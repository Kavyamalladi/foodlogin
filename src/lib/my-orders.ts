/** Guest order ids kept on this device so /track can show them without typing anything. */
const KEY = "foodlogin-orders";

export function readOrders(): string[] {
  try {
    const v: unknown = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string").slice(0, 10) : [];
  } catch {
    return [];
  }
}

export function rememberOrder(id: string) {
  try {
    localStorage.setItem(KEY, JSON.stringify([id, ...readOrders().filter((x) => x !== id)].slice(0, 10)));
  } catch {
    /* private mode / quota: tracking by phone still works */
  }
}
