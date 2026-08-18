import { useState } from "react";

export default function AlbumList({ albums = [], onSelectAlbum }) {
  const [query, setQuery] = useState("");

  const filteredAlbums = albums.filter((album) => {
    const q = query.toLowerCase();
    const title = album.title?.toLowerCase() || "";
    const artist = album.artist?.username?.toLowerCase() || "";
    return title.includes(q) || artist.includes(q);
  });

  return (
    <section className="section">
      <div className="heading">
        <div>
          <small>ALBUM COLLECTION</small>
          <h2>Albums</h2>
        </div>
        <div className="heading-right">
          <input
            type="text"
            className="search-input"
            placeholder="Search albums or artists…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <span className="track-count">
            {filteredAlbums.length} {filteredAlbums.length === 1 ? "album" : "albums"}
          </span>
        </div>
      </div>

      {filteredAlbums.length ? (
        <div className="albums-grid">
          {filteredAlbums.map((album) => {
            const initial = album.title ? album.title.charAt(0).toUpperCase() : "A";
            const artistName = album.artist?.username || "Unknown artist";

            return (
              <article
                key={album._id}
                className="album-card"
                onClick={() => onSelectAlbum(album)}
                tabIndex={0}
                role="button"
                onKeyDown={(e) => e.key === "Enter" && onSelectAlbum(album)}
              >
                <i className="album-art">{initial}</i>
                <h3>{album.title}</h3>
                <p>{artistName}</p>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="empty">
          <strong>No albums found.</strong>
          <p>
            {query
              ? `No albums match "${query}".`
              : "Once artists create albums, they will appear here."}
          </p>
        </div>
      )}
    </section>
  );
}
