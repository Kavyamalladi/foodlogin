export type Review = { name: string; city: string; text: string; stars: 1 | 2 | 3 | 4 | 5 };

/**
 * REAL customer reviews only, with the customer's permission. Never invent or edit them.
 * While this is empty, no reviews section and no rating appear anywhere on the site.
 */
export const REVIEWS: Review[] = [];

/** Average and count, or null when there are no reviews (so no rating is ever shown without data). */
export function ratingSummary(reviews: Review[] = REVIEWS) {
  if (reviews.length === 0) return null;
  const avg = reviews.reduce((n, r) => n + r.stars, 0) / reviews.length;
  return { average: Math.round(avg * 10) / 10, count: reviews.length };
}
