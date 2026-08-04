import { supabase } from "@/api/supabaseClient";

const tableNames = {
  Client: "clients",
  Contact: "contacts",
  Demande: "demandes",
  DemandeOuverture: "demandes_ouverture",
  Transaction: "transactions",
  LoginCode: "login_codes",
  User: "profiles",
};

const fail = (error) => {
  if (error) throw new Error(error.message);
};

const addFilters = (query, filters = {}) =>
  Object.entries(filters).reduce((current, [key, value]) => current.eq(key, value), query);

const getRows = async (table, filters, sort = "-created_date", limit = 200) => {
  const descending = sort.startsWith("-");
  const column = sort.replace(/^-/, "");
  const { data, error } = await addFilters(
    supabase.from(table).select("*").order(column, { ascending: !descending }).limit(limit),
    filters,
  );
  fail(error);
  return data || [];
};

const entity = (name) => {
  const table = tableNames[name];
  if (!table) throw new Error(`Entité Supabase inconnue : ${name}`);
  return {
    list: (sort, limit) => getRows(table, {}, sort, limit),
    filter: (filters, sort, limit) => getRows(table, filters, sort, limit),
    async create(payload) {
      const { data, error } = await supabase.from(table).insert(payload).select().single();
      fail(error);
      return data;
    },
    async update(id, payload) {
      const { data, error } = await supabase.from(table).update(payload).eq("id", id).select().single();
      fail(error);
      return data;
    },
    async delete(id) {
      const { error } = await supabase.from(table).delete().eq("id", id);
      fail(error);
    },
    async deleteMany(filters) {
      const { error } = await addFilters(supabase.from(table).delete(), filters);
      fail(error);
    },
    subscribe(callback) {
      const channel = supabase
        .channel(`${table}-changes`)
        .on("postgres_changes", { event: "*", schema: "public", table }, (payload) => {
          callback({
            type: payload.eventType.toLowerCase(),
            data: payload.eventType === "DELETE" ? payload.old : payload.new,
          });
        })
        .subscribe();
      return () => supabase.removeChannel(channel);
    },
  };
};

const auth = {
  async me() {
    const { data: authData, error: authError } = await supabase.auth.getUser();
    fail(authError);
    const user = authData.user;
    if (!user) throw new Error("Utilisateur non connecté");
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role, nom, prenom")
      .eq("id", user.id)
      .maybeSingle();
    fail(profileError);
    return { ...user, ...profile, role: profile?.role || user.app_metadata?.role || "client" };
  },
  async loginViaEmailPassword(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    fail(error);
    return data;
  },
  async register({ email, password }) {
    const { data, error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/my-account` } });
    fail(error);
    return data;
  },
  async verifyOtp({ email, otpCode }) {
    const { data, error } = await supabase.auth.verifyOtp({ email, token: otpCode, type: "signup" });
    fail(error);
    return { access_token: data.session?.access_token, ...data };
  },
  async resendOtp(email) {
    const { error } = await supabase.auth.resend({ type: "signup", email, options: { emailRedirectTo: `${window.location.origin}/my-account` } });
    fail(error);
  },
  async loginWithProvider(provider, redirectTo = "/") {
    const { error } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo: `${window.location.origin}${redirectTo}` } });
    fail(error);
  },
  async resetPasswordRequest(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
    fail(error);
  },
  async resetPassword({ newPassword }) {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    fail(error);
  },
  setToken() {},
  async logout() {
    const { error } = await supabase.auth.signOut();
    fail(error);
  },
  redirectToLogin() {
    window.location.assign("/login");
  },
};

async function uploadFile(file) {
  if (!file) throw new Error("Fichier manquant");
  const { data: userData, error: userError } = await supabase.auth.getUser();
  fail(userError);
  const owner = userData.user?.id || "public";
  const path = `${owner}/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  const { error } = await supabase.storage.from("documents").upload(path, file, { upsert: false });
  fail(error);
  const { data } = supabase.storage.from("documents").getPublicUrl(path);
  return { file_url: data.publicUrl };
}

async function invoke(name, payload) {
  const { data: sessionData } = await supabase.auth.getSession();
  const response = await fetch(`/api/${name}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(sessionData.session ? { Authorization: `Bearer ${sessionData.session.access_token}` } : {}) },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Échec de la fonction serveur");
  return data;
}

export const base44 = {
  auth,
  entities: new Proxy({}, { get: (_, name) => entity(name) }),
  functions: { invoke },
  integrations: { Core: { UploadFile: uploadFile, SendEmail: (payload) => invoke("SendEmail", payload) } },
};
