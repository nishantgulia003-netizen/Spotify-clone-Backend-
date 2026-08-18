import { useState } from "react";
import { api } from "../api";

export default function Auth({ onComplete }) {
  const [mode, setMode] = useState("login");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const isLogin = mode === "login";

  async function handleSubmit(event) {
    event.preventDefault();
    setPending(true);
    setError("");

    const form = new FormData(event.currentTarget);

    try {
      let userData;
      if (isLogin) {
        const identity = form.get("identity").trim();
        const password = form.get("password");
        const payload = identity.includes("@")
          ? { email: identity, password }
          : { username: identity, password };

        const res = await api.login(payload);
        // Backend returns { id, user (username), emial, role } on login
        userData = {
          id: res.id,
          username: res.user || identity,
          email: res.emial || res.email,
          role: res.role || "user",
        };
      } else {
        const username = form.get("username").trim();
        const email = form.get("email").trim();
        const role = form.get("role") || "user";
        const password = form.get("password");

        const res = await api.register({ username, email, password, role });
        // Backend returns { user: { id, username, email, role } } on register
        userData = res.user
          ? { ...res.user }
          : { username, email, role };
      }

      onComplete(userData);
    } catch (err) {
      setError(err.message || "Authentication failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="auth">
      <div className="form-panel">
        <small className="auth-subtitle">{isLogin ? "WELCOME BACK" : "CREATE ACCOUNT"}</small>
        <h2>{isLogin ? "Sign in to keep listening." : "Join the listening room."}</h2>
        <p>
          {isLogin
            ? "Sign in with your account credentials."
            : "Choose a unique username (3+ chars), a valid email, and a password (8+ chars)."}
        </p>

        <form onSubmit={handleSubmit}>
          {isLogin ? (
            <label>
              Username or Email
              <input
                name="identity"
                required
                autoComplete="username"
                placeholder="e.g. john_doe or john@example.com"
              />
            </label>
          ) : (
            <>
              <label>
                Username <span className="hint">(at least 3 characters)</span>
                <input
                  name="username"
                  required
                  minLength={3}
                  autoComplete="username"
                  placeholder="e.g. soundmaster"
                />
              </label>
              <label>
                Email
                <input
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="name@example.com"
                />
              </label>
              <label>
                Account Type
                <select name="role" defaultValue="user">
                  <option value="user">Listener (Listen & Discover)</option>
                  <option value="artist">Artist (Upload Music & Create Albums)</option>
                </select>
              </label>
            </>
          )}

          <label>
            Password <span className="hint">(at least 8 characters)</span>
            <input
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete={isLogin ? "current-password" : "new-password"}
            />
          </label>

          {error && <em className="auth-error" role="alert">{error}</em>}

          <button className="primary" disabled={pending}>
            {pending ? "Please wait…" : isLogin ? "Sign in" : "Create account"}
          </button>
        </form>

        <button
          className="switch-mode"
          onClick={() => {
            setMode(isLogin ? "register" : "login");
            setError("");
          }}
        >
          {isLogin ? "New here? Create an account" : "Already have an account? Sign in"}
        </button>
      </div>

      <div className="auth-art">
        <i></i>
        <strong>
          Only real music.<br />
          <span>No noise.</span>
        </strong>
      </div>
    </section>
  );
}
