const api = (() => {
  async function request(url, options = {}) {
    const response = await fetch(url, { credentials: "same-origin", headers: { "Content-Type": "application/json" }, ...options });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(body.message || "Request failed. Please try again.");
    return body;
  }
  return {
    login: (body) => request("/api/auth/login", { method: "POST", body: JSON.stringify(body) }),
    register: (body) => request("/api/auth/register", { method: "POST", body: JSON.stringify(body) }),
    logout: () => request("/api/auth/logout", { method: "POST" }),
    music: () => request("/api/music/allMusic"),
    albums: () => request("/api/music/albums"),
  };
})();
