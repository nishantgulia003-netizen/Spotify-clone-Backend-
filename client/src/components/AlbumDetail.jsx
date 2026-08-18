import { useEffect, useState } from "react";
import { api } from "../api";

export default function AlbumDetail({ albumId, onBack, selected, playing, onPlay }) {
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAlbum() {
      setLoading(true);
      setError("");
      try {
        const res = await api.getAlbumById(albumId);
        setAlbum(res.album);
      } catch (err) {
        setError(err.message || "Failed to load album details.");
      } finally {
        setLoading(false);
      }
    }
    if (albumId) fetchAlbum();
  }, [albumId]);

  if (loading) {
    return (
      <div className="state">
        <i></i>
        <p>Loading album details…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="state">
        <strong>Could not load album</strong>
        <p>{error}</p>
        <button className="primary" onClick={onBack}>
          Back to Albums
        </button>
      </div>
    );
  }

  if (!album) return null;

  const tracks = album.musics || [];
  const artistName = album.artist?.username || "Unknown artist";
  const albumInitial = album.title ? album.title.charAt(0).toUpperCase() : "A";

  const isAlbumPlaying =
    playing && tracks.some((t) => t._id === selected?._id);

  function handlePlayAll() {
    if (tracks.length > 0) {
      if (isAlbumPlaying) {
        // Toggle play/pause if already playing track from this album
        onPlay(selected, tracks);
      } else {
        onPlay(tracks[0], tracks);
      }
    }
  }

  return (
    <section className="album-detail-view">
      <button className="back-btn" onClick={onBack}>
        ← Back to Albums
      </button>

      <div className="album-header">
        <i className="album-cover-large">{albumInitial}</i>
        <div className="album-header-meta">
          <small className="album-badge">ALBUM</small>
          <h2>{album.title}</h2>
          <p className="album-meta-text">
            By <strong>{artistName}</strong> • {tracks.length}{" "}
            {tracks.length === 1 ? "track" : "tracks"}
          </p>
          {tracks.length > 0 && (
            <button className="primary play-album-btn" onClick={handlePlayAll}>
              {isAlbumPlaying ? "Pause Album Ⅱ" : "Play Album ▶"}
            </button>
          )}
        </div>
      </div>

      <div className="album-tracks-section">
        <h3>Tracks</h3>
        {tracks.length ? (
          <div className="song-list">
            {tracks.map((song, index) => {
              const isSelected = selected?._id === song._id;
              return (
                <button
                  key={song._id || index}
                  className={`song ${isSelected ? "playing" : ""}`}
                  onClick={() => onPlay(song, tracks)}
                >
                  <span className="track-num">{String(index + 1).padStart(2, "0")}</span>
                  <i className="art-thumb art-0"></i>
                  <b className="track-info">
                    <span className="song-title">{song.title}</span>
                    <small className="artist-name">{artistName}</small>
                  </b>
                  <em className="play-icon">{isSelected && playing ? "Ⅱ" : "▶"}</em>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="empty">
            <strong>No tracks in this album.</strong>
          </div>
        )}
      </div>
    </section>
  );
}
