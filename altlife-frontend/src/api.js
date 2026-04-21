// simple wrapper that attaches token automatically and throws on bad response
export const API_BASE = "http://127.0.0.1:5000/api";

export async function apiFetch(path, opts = {}) {
  const token = localStorage.getItem("altlife_token");
  const headers = { "Content-Type": "application/json", ...(opts.headers || {}) };
  if (token) headers.Authorization = "Bearer " + token;

  const res = await fetch(API_BASE + path, { ...opts, headers });
  if (!res.ok) {
    // try to parse json error
    let err = { error: "Request failed" };
    try { err = await res.json(); } catch (e) { /* ignore */ }
    throw err;
  }
  // if no content
  if (res.status === 204) return null;
  // try parse body
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) return res.json();
  return res.blob();
}
