import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Foodlogin",
    short_name: "Foodlogin",
    description: "Handmade Rayalaseema pickles, sweets and podi from Anantapur.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf8f4",
    theme_color: "#1b1411",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
