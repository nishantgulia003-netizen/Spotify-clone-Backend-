import { useEffect, useState } from "react";
import { api } from "./api";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Auth from "./components/Auth";
import SongList from "./components/SongList";
import AlbumList from "./components/AlbumList";
import AlbumDetail from "./components/AlbumDetail";
import ArtistStudio from "./components/ArtistStudio";
import Player from "./components/Player";

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("soundscape_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [view, setView] = useState("home");
  const [selectedAlbumId, setSelectedAlbumId] = useState(null);

  const [songs, setSongs] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Playback state
  const [selectedSong, setSelectedSong] = useState(null);
  const [playlist, setPlaylist] = useState([]);
  const [playing, setPlaying] = useState(false);

  async function loadData() {
    if (!user) return;
    setLoading(true);
    setError("");

    try {
      const [musicRes, albumRes] = await Promise.allSettled([
        api.getMusic(),
        api.getAlbums(),
      ]);

      if (musicRes.status === "fulfilled") {
        setSongs(musicRes.value.music || []);
      } else if (musicRes.reason?.status === 401) {
        handleLogout();
        return;
      }

      if (albumRes.status === "fulfilled") {
        setAlbums(albumRes.value.albums || []);
      } else if (albumRes.reason?.status === 401) {
        handleLogout();
        return;
      }
    } catch (err) {
      setError(err.message || "Unable to fetch data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  function handleLoginDone(userData) {
    setUser(userData);
    try {
      localStorage.setItem("soundscape_user", JSON.stringify(userData));
    } catch {}
    setView("home");
  }

  async function handleLogout() {
    try {
      await api.logout();
    } finally {
      setUser(null);
      setSelectedSong(null);
      setPlaying(false);
      try {
        localStorage.removeItem("soundscape_user");
      } catch {}
    }
  }

  function handleSelectAlbum(album) {
    setSelectedAlbumId(album._id);
    setView("album-detail");
  }

  function handlePlaySong(song, tracklist = songs) {
    if (!song) return;
    setPlaylist(tracklist);
    if (selectedSong?._id === song._id) {
      setPlaying(!playing);
    } else {
      setSelectedSong(song);
      setPlaying(true);
    }
  }

  function renderMainContent() {
    if (!user) {
      return <Auth onComplete={handleLoginDone} />;
    }

    if (loading && !songs.length && !albums.length) {
      return (
        <div className="state">
          <i></i>
          <p>Loading available music…</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="state">
          <strong>Could not load library</strong>
          <p>{error}</p>
          <button className="primary" onClick={loadData}>
            Try again
          </button>
        </div>
      );
    }

    switch (view) {
      case "albums":
        return <AlbumList albums={albums} onSelectAlbum={handleSelectAlbum} />;
      case "album-detail":
        return (
          <AlbumDetail
            albumId={selectedAlbumId}
            onBack={() => setView("albums")}
            selected={selectedSong}
            playing={playing}
            onPlay={handlePlaySong}
          />
        );
      case "studio":
        return <ArtistStudio songs={songs} onRefreshData={loadData} />;
      case "home":
      default:
        return (
          <SongList
            songs={songs}
            selected={selectedSong}
            playing={playing}
            onPlay={handlePlaySong}
          />
        );
    }
  }

  return (
    <>
      <div className="glow one"></div>
      <div className="glow two"></div>

      <div className="shell">
        <Sidebar view={view} setView={setView} user={user} />

        <main className="main-content">
          <Header
            view={view}
            user={user}
            onLogout={handleLogout}
            onSignInClick={() => setUser(null)}
          />

          {user && view === "home" && <HeroSection />}

          {renderMainContent()}
        </main>
      </div>

      <Player
        selectedSong={selectedSong}
        playlist={playlist.length ? playlist : songs}
        playing={playing}
        setPlaying={setPlaying}
        onPlaySong={handlePlaySong}
      />
    </>
  );
}

function HeroSection() {
  return (
    <section className="hero">
      <div>
        <small>A NEW LISTENING EXPERIENCE</small>
        <h2>
          Let the music
          <br />
          set the pace.
        </h2>
        <p>Explore original tracks and albums from the artists using Soundscape.</p>
      </div>
      <div className="art" aria-hidden="true">
        <i className="disc back"></i>
        <i className="disc front"></i>
        <span className="wave">▁▃▆▂▇▄▅▂</span>
      </div>
    </section>
  );
}
