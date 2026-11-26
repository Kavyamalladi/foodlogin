/**
 * One JSON line per event on stdout/stderr (PM2 captures both).
 * Search with: pm2 logs foodlogin | grep order_
 * Log ids, amounts and outcomes only. Never phone, address, signatures or secrets.
 */
type Fields = Record<string, unknown>;

/** Errors don't survive JSON.stringify; keep the useful parts (also fits Supabase's plain error objects). */
export function errInfo(err: unknown): Fields {
  if (err instanceof Error) return { message: err.message, name: err.name, stack: err.stack?.split("\n").slice(0, 4).join(" | ") };
  if (err && typeof err === "object") {
    const { message, code, details, hint } = err as Fields;
    return { message, code, details, hint };
  }
  return { message: String(err) };
}

function emit(level: "info" | "warn" | "error", event: string, fields: Fields) {
  const line = JSON.stringify({ ts: new Date().toISOString(), level, event, ...fields });
  (level === "info" ? console.log : level === "warn" ? console.warn : console.error)(line);
}

export const log = {
  info: (event: string, fields: Fields = {}) => emit("info", event, fields),
  warn: (event: string, fields: Fields = {}) => emit("warn", event, fields),
  error: (event: string, fields: Fields = {}) => emit("error", event, fields),
};
