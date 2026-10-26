/* WORDS HUB frontend starter. Demo forms do not save data until Supabase is configured. */
const SUPABASE_URL = ""; // Add your Supabase Project URL here
const SUPABASE_ANON_KEY = ""; // Add your Supabase publishable/anon key here. NEVER use service_role keys in frontend.
let supabaseClient = null;
if (window.supabase && SUPABASE_URL && SUPABASE_ANON_KEY) {
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
let currentLanguage = "en";
const langButton = document.getElementById("languageToggle");
function setLanguage(lang) {
  currentLanguage = lang;
  document.documentElement.lang = lang === "si" ? "si" : "en";
  document.querySelectorAll("[data-en][data-si]").forEach(el => {
    el.innerHTML = el.dataset[lang];
  });
  if (langButton) langButton.textContent = lang === "en" ? "සිංහල" : "English";
}
langButton?.addEventListener("click", () => setLanguage(currentLanguage === "en" ? "si" : "en"));
document.getElementById("year").textContent = new Date().getFullYear();
document.getElementById("menuToggle")?.addEventListener("click", () => document.getElementById("mainNav").classList.toggle("open"));
document.querySelectorAll("#mainNav a").forEach(a => a.addEventListener("click", () => document.getElementById("mainNav").classList.remove("open")));

document.getElementById("pollForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const choice = new FormData(e.currentTarget).get("poll");
  const msg = document.getElementById("pollMessage");
  if (!supabaseClient) { msg.textContent = "Demo only: your choice was “" + choice + "”. Connect Supabase to save votes."; return; }
  const { error } = await supabaseClient.from("poll_votes").insert({ choice });
  msg.textContent = error ? "Vote could not be saved. Please try again." : "Thanks! Your vote has been recorded.";
  if (!error) e.currentTarget.reset();
});

document.getElementById("reviewForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = new FormData(e.currentTarget);
  const review = { name: String(data.get("name") || "").trim(), rating: Number(data.get("rating")), body: String(data.get("review") || "").trim() };
  const msg = document.getElementById("reviewMessage");
  if (!review.name || !review.body || review.rating < 1 || review.rating > 5) { msg.textContent = "Please complete all fields."; return; }
  if (!supabaseClient) { msg.textContent = "Demo only: review form works visually, but is not saved yet. Connect Supabase first."; return; }
  const { error } = await supabaseClient.from("reviews").insert({ name: review.name, rating: review.rating, body: review.body });
  msg.textContent = error ? "Could not submit review. Please try again." : "Thank you! Your review was submitted for moderation.";
  if (!error) e.currentTarget.reset();
});

async function loadPublishedPosts() {
  if (!supabaseClient) return;
  const { data, error } = await supabaseClient.from("posts").select("id,title,excerpt,category,created_at,slug").eq("published", true).order("created_at", { ascending: false }).limit(6);
  if (error || !data?.length) return;
  const grid = document.getElementById("blogGrid");
  grid.innerHTML = data.map((p, i) => `<article class="blog-card"><div class="blog-art art-${["one","two","three"][i%3]}"><span>${String(i+1).padStart(2,"0")}</span><b>${escapeHtml((p.category||"GROW").toUpperCase())}</b></div><div class="blog-meta"><span>${escapeHtml((p.category||"MINDSET").toUpperCase())}</span><span>WORDS HUB</span></div><h3>${escapeHtml(p.title)}</h3><p>${escapeHtml(p.excerpt||"")}</p><a class="read-link" href="post.html?slug=${encodeURIComponent(p.slug)}">Read article ↗</a></article>`).join("");
}
function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c])); }
loadPublishedPosts();
