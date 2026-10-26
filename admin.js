/* Admin starter: use only Supabase URL + publishable/anon key in browser. */
const ADMIN_SUPABASE_URL = 
const ADMIN_SUPABASE_URL = 
const ADMIN_SUPABASE_URL = "https://dskoagxemyscweqelzey.supabase.co"; // Add Supabase Project URL
const ADMIN_SUPABASE_ANON_KEY = "sb_publishable_zs3YnERDuRTuMQ6oOOiytQ_vpFQaV9w"; // Add publishable/anon key; NEVER service_role
let adminDb = null;
if (window.supabase && ADMIN_SUPABASE_URL && ADMIN_SUPABASE_ANON_KEY) adminDb = window.supabase.createClient(ADMIN_SUPABASE_URL, ADMIN_SUPABASE_ANON_KEY);
const loginCard = document.getElementById("loginCard"), dashboard = document.getElementById("dashboard");
const statusEl = document.getElementById("loginStatus");
async function showSession() {
  if (!adminDb) return;
  const { data } = await adminDb.auth.getSession();
  if (data.session) { loginCard.style.display = "none"; dashboard.classList.add("active"); document.getElementById("adminWelcome").textContent = "Signed in as " + data.session.user.email; }
}
document.getElementById("loginForm").addEventListener("submit", async e => {
  e.preventDefault();
  if (!adminDb) { statusEl.textContent = "Setup required: add your Supabase Project URL and publishable key in admin.js."; return; }
  statusEl.textContent = "Signing in…";
  const { error } = await adminDb.auth.signInWithPassword({ email: document.getElementById("email").value, password: document.getElementById("password").value });
  if (error) { statusEl.textContent = "Sign-in failed. Check your details and Supabase configuration."; return; }
  statusEl.textContent = "";
  await showSession();
});
document.getElementById("logoutButton").addEventListener("click", async () => {
  if (adminDb) await adminDb.auth.signOut();
  dashboard.classList.remove("active"); loginCard.style.display = "block";
});
showSession();
