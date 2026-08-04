import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
const publicKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;

if (!url || !serviceKey || !publicKey) {
  throw new Error("Les variables Supabase serveur sont incomplètes.");
}

export const adminSupabase = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });

export async function getAuthenticatedUser(req) {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");
  if (!token) return null;
  const client = createClient(url, publicKey, { global: { headers: { Authorization: `Bearer ${token}` } } });
  const { data, error } = await client.auth.getUser();
  if (error) return null;
  return data.user;
}

export async function isAdmin(userId) {
  const { data, error } = await adminSupabase.from("profiles").select("role").eq("id", userId).maybeSingle();
  if (error) throw error;
  return data?.role === "admin";
}
