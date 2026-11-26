/** Categories whose products contain meat, fish or egg. Everything else is vegetarian. Slugs come from the categories table. */
export const NON_VEG_SLUGS = new Set(["non-veg-pickles", "dry-mutton"]);

export const isNonVegSlug = (slug: string | undefined) => !!slug && NON_VEG_SLUGS.has(slug);
