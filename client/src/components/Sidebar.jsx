export default function Sidebar({ view, setView, user }) {
  return (
    <aside className="sidebar">
      <a className="brand" href="#home" onClick={(e) => { e.preventDefault(); setView("home"); }}>
        <i>
          <b></b>
          <b></b>
          <b></b>
        </i>
        soundscape
      </a>

      <nav className="nav-menu">
        <button
          className={view === "home" ? "active" : ""}
          onClick={() => setView("home")}
        >
          <span className="icon">⌂</span>
          <span>Discover</span>
        </button>
        <button
          className={view === "albums" || view === "album-detail" ? "active" : ""}
          onClick={() => setView("albums")}
        >
          <span className="icon">▦</span>
          <span>Albums</span>
        </button>
        {user && user.role === "artist" && (
          <button
            className={view === "studio" ? "active" : ""}
            onClick={() => setView("studio")}
          >
            <span className="icon">✦</span>
            <span>Artist Studio</span>
          </button>
        )}
      </nav>

      <div className="side-note">
        <p>
          {user?.role === "artist"
            ? "Upload your tracks & compile albums in the Artist Studio."
            : "Listen to original music shared by artists in your community."}
        </p>
      </div>
    </aside>
  );
}
