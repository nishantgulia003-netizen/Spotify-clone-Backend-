import { useState } from "react";

const ARTWORK_CLASSES = ["art-0", "art-1", "art-2", "art-3", "art-4"];

export default function SongList({ songs = [], selected, playing, onPlay }) {
  const [query, setQuery] = useState("");

  const filteredSongs = songs.filter((song) => {
    const q = query.toLowerCase();
    const title = song.title?.toLowerCase() || "";
    const artist = song.artist?.username?.toLowerCase() || "";
    return title.includes(q) || artist.includes(q);
  });

  return (
    <section className="section">
      <div className="heading">
        <div>
          <small>MUSIC LIBRARY</small>
          <h2>Available tracks</h2>
        </div>
        <div className="heading-right">
          <input
            type="text"
            className="search-input"
            placeholder="Search tracks or artists…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <span className="track-count">
            {filteredSongs.length} {filteredSongs.length === 1 ? "track" : "tracks"}
          </span>
        </div>
      </div>

      {filteredSongs.length ? (
        <div className="song-list">
          {filteredSongs.map((song, index) => {
            const isSelected = selected?._id === song._id;
            const artClass = ARTWORK_CLASSES[index % ARTWORK_CLASSES.length];
            const artistName = song.artist?.username || "Unknown artist";

            return (
              <button
                key={song._id || index}
                className={`song ${isSelected ? "playing" : ""}`}
                onClick={() => onPlay(song, songs)}
              >
                <span className="track-num">{String(index + 1).padStart(2, "0")}</span>
                <i className={`art-thumb ${artClass}`}></i>
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
          <strong>No tracks found.</strong>
          <p>
            {query
              ? `No tracks match "${query}". Try another search.`
              : "Once artists upload music, tracks will appear here."}
          </p>
        </div>
      )}
    </section>
  );
}
