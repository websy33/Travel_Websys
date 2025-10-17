// Simple fallback admin check using environment variable for bootstrap
// Set VITE_FALLBACK_ADMIN_EMAILS to a comma-separated list of admin emails in Vercel envs
export function isFallbackAdmin(email) {
  if (!email) return false;
  const raw = import.meta.env.VITE_FALLBACK_ADMIN_EMAILS || '';
  const list = raw
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return list.includes(String(email).toLowerCase());
}
