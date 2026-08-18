import { useState } from "react";
import { api } from "../api";

export default function ArtistStudio({ songs = [], onRefreshData }) {
  // Track Upload state
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState({ text: "", isError: false });

  // Album Creation state
  const [albumTitle, setAlbumTitle] = useState("");
  const [selectedMusicIds, setSelectedMusicIds] = useState([]);
  const [creatingAlbum, setCreatingAlbum] = useState(false);
  const [albumMsg, setAlbumMsg] = useState({ text: "", isError: false });

  // Upload Track Handler
  async function handleUploadTrack(e) {
    e.preventDefault();
    if (!uploadTitle.trim() || !uploadFile) {
      setUploadMsg({ text: "Please enter a track title and select an audio file.", isError: true });
      return;
    }

    setUploading(true);
    setUploadMsg({ text: "", isError: false });

    try {
      const formData = new FormData();
      formData.append("title", uploadTitle.trim());
      formData.append("music", uploadFile);

      const res = await api.uploadMusic(formData);
      setUploadMsg({ text: res.message || "Track uploaded successfully!", isError: false });
      setUploadTitle("");
      setUploadFile(null);
      // Reset file input
      if (e.target) e.target.reset();

      if (onRefreshData) onRefreshData();
    } catch (err) {
      setUploadMsg({ text: err.message || "Failed to upload track.", isError: true });
    } finally {
      setUploading(false);
    }
  }

  // Create Album Handler
  async function handleCreateAlbum(e) {
    e.preventDefault();
    if (!albumTitle.trim()) {
      setAlbumMsg({ text: "Please enter an album title.", isError: true });
      return;
    }
    if (selectedMusicIds.length === 0) {
      setAlbumMsg({ text: "Select at least one track to include in the album.", isError: true });
      return;
    }

    setCreatingAlbum(true);
    setAlbumMsg({ text: "", isError: false });

    try {
      const res = await api.createAlbum({
        title: albumTitle.trim(),
        musics: selectedMusicIds,
      });

      setAlbumMsg({ text: res.message || "Album created successfully!", isError: false });
      setAlbumTitle("");
      setSelectedMusicIds([]);

      if (onRefreshData) onRefreshData();
    } catch (err) {
      setAlbumMsg({ text: err.message || "Failed to create album.", isError: true });
    } finally {
      setCreatingAlbum(false);
    }
  }

  function toggleMusicSelection(id) {
    setSelectedMusicIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  return (
    <section className="artist-studio">
      <div className="studio-header">
        <small className="studio-badge">ARTIST CREATOR STUDIO</small>
        <h2>Publish & Manage Your Music</h2>
        <p>Upload new tracks and arrange them into custom albums for listeners.</p>
      </div>

      <div className="studio-grid">
        {/* Upload Music Card */}
        <div className="studio-card">
          <h3>Upload Track</h3>
          <p className="card-desc">Add a new audio file (.mp3, .wav, etc.) to your catalog.</p>

          <form onSubmit={handleUploadTrack} className="studio-form">
            <label>
              Track Title
              <input
                type="text"
                placeholder="e.g. Midnight Reverie"
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                required
              />
            </label>

            <label>
              Audio File
              <input
                type="file"
                accept="audio/*"
                onChange={(e) => setUploadFile(e.target.files[0] || null)}
                required
              />
            </label>

            {uploadMsg.text && (
              <div className={`status-msg ${uploadMsg.isError ? "error" : "success"}`}>
                {uploadMsg.text}
              </div>
            )}

            <button type="submit" className="primary" disabled={uploading}>
              {uploading ? "Uploading Track…" : "Upload Music Track"}
            </button>
          </form>
        </div>

        {/* Create Album Card */}
        <div className="studio-card">
          <h3>Create Album</h3>
          <p className="card-desc">Group your uploaded tracks into a cohesive album.</p>

          <form onSubmit={handleCreateAlbum} className="studio-form">
            <label>
              Album Title
              <input
                type="text"
                placeholder="e.g. Neon Horizon"
                value={albumTitle}
                onChange={(e) => setAlbumTitle(e.target.value)}
                required
              />
            </label>

            <label>Select Tracks for Album ({selectedMusicIds.length} selected)</label>

            {songs.length ? (
              <div className="track-select-list">
                {songs.map((song) => {
                  const isChecked = selectedMusicIds.includes(song._id);
                  return (
                    <label key={song._id} className={`track-select-item ${isChecked ? "selected" : ""}`}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleMusicSelection(song._id)}
                      />
                      <div className="track-select-details">
                        <strong>{song.title}</strong>
                        <small>{song.artist?.username || "You"}</small>
                      </div>
                    </label>
                  );
                })}
              </div>
            ) : (
              <div className="empty-notice">
                Upload tracks first before creating an album.
              </div>
            )}

            {albumMsg.text && (
              <div className={`status-msg ${albumMsg.isError ? "error" : "success"}`}>
                {albumMsg.text}
              </div>
            )}

            <button
              type="submit"
              className="primary"
              disabled={creatingAlbum || !songs.length}
            >
              {creatingAlbum ? "Creating Album…" : "Create Album"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
