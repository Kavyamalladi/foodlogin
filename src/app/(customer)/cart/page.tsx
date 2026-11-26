import { redirect } from "next/navigation";

// The cart lives in the drawer now. Old links and bookmarks land on the shop.
export default function CartRedirect() {
  redirect("/shop");
}
