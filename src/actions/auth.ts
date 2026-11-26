"use server";

import { createClient } from "@/lib/supabase/server";
import { ADMIN_DASHBOARD_PATH, ADMIN_LOGIN_PATH } from "@/lib/admin-route";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });

  if (error) {
    console.error("Admin login failed", { code: error.code, name: error.name });
    return { error: "Invalid credentials" };
  }

  redirect(ADMIN_DASHBOARD_PATH);
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect(ADMIN_LOGIN_PATH);
}
