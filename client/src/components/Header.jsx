export default function Header({ view, user, onLogout, onSignInClick }) {
  const getTitles = () => {
    switch (view) {
      case "home":
        return { subtitle: "YOUR MUSIC SPACE", title: "Discover music" };
      case "albums":
        return { subtitle: "COLLECTION", title: "Albums" };
      case "album-detail":
        return { subtitle: "ALBUM VIEW", title: "Album Tracks" };
      case "studio":
        return { subtitle: "ARTIST DASHBOARD", title: "Artist Studio" };
      default:
        return { subtitle: "SOUNDSCAPE", title: "Welcome" };
    }
  };

  const { subtitle, title } = getTitles();

  return (
    <header className="app-header">
      <div>
        <small className="section-label">{subtitle}</small>
        <h1>{title}</h1>
      </div>
      {user ? (
        <div className="user-badge">
          <b className="user-avatar">{user.username?.[0]?.toUpperCase() || "U"}</b>
          <div className="user-info">
            <span className="user-name">{user.username}</span>
            <span className="user-role">{user.role === "artist" ? "Artist" : "Listener"}</span>
          </div>
          <button className="logout-btn" onClick={onLogout}>
            Log out
          </button>
        </div>
      ) : (
        <button className="sign-in" onClick={onSignInClick}>
          Sign in
        </button>
      )}
    </header>
  );
}
