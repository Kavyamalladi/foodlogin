import type { Metadata } from "next";
import Home from "../page";

// Experiment sandbox: the home page rendered with a different heading font (see lab/layout.tsx).
// Not linked anywhere and not indexed. Route config can't be re-exported, so it's repeated here.
export const revalidate = 86400;
export const metadata: Metadata = { title: "Lab", robots: { index: false, follow: false } };

export default Home;
