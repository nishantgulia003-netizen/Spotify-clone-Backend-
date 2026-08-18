async function request(path, options = {}) {
  const isFormData = options.body instanceof FormData;
  const headers = isFormData
    ? { ...options.headers }
    : { "Content-Type": "application/json", ...options.headers };

  const response = await fetch(path, {
    credentials: "include",
    headers,
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = Array.isArray(data.errors)
      ? data.errors.join(". ")
      : data.message || "Request failed. Please try again.";
    const err = new Error(message);
    err.status = response.status;
    err.data = data;
    throw err;
  }

  return data;
}

export const api = {
  login: (body) => request("/api/auth/login", { method: "POST", body: JSON.stringify(body) }),
  register: (body) => request("/api/auth/register", { method: "POST", body: JSON.stringify(body) }),
  logout: async () => {
    try {
      return await request("/api/auth/logout", { method: "POST" });
    } catch {
      // Backend res.clearCookies typo fallback: return ok so frontend state clears
      return { success: true };
    }
  },
  getMusic: () => request("/api/music/allMusic"),
  getAlbums: () => request("/api/music/albums"),
  getAlbumById: (id) => request(`/api/music/albums/${id}`),
  uploadMusic: (formData) => request("/api/music/uploadMusic", { method: "POST", body: formData }),
  createAlbum: (body) => request("/api/music/createAlbum", { method: "POST", body: JSON.stringify(body) }),
};
