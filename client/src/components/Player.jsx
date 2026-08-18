import { useEffect, useRef, useState } from "react";

const formatTime = (seconds) =>
  Number.isFinite(seconds)
    ? `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`
    : "0:00";

export default function Player({
  selectedSong,
  playlist = [],
  playing,
  setPlaying,
  onPlaySong,
}) {
  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);

  // Sync audio src when selectedSong changes
  useEffect(() => {
    if (!selectedSong || !audioRef.current) return;
    const audio = audioRef.current;
    if (audio.src !== selectedSong.uri) {
      audio.src = selectedSong.uri;
      audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  }, [selectedSong]);

  // Sync volume & mute
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  if (!selectedSong) return null;

  const currentIndex = playlist.findIndex((s) => s._id === selectedSong._id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < playlist.length - 1;

  function handlePlayPauseToggle() {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
  }

  function handlePrev() {
    if (hasPrev) {
      onPlaySong(playlist[currentIndex - 1], playlist);
    }
  }

  function handleNext() {
    if (hasNext) {
      onPlaySong(playlist[currentIndex + 1], playlist);
    }
  }

  function handleSeek(e) {
    const time = Number(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  }

  return (
    <footer className="player-bar">
      <div className="now-playing">
        <i className="now-art"></i>
        <div className="now-details">
          <strong className="now-title">{selectedSong.title}</strong>
          <span className="now-artist">
            {selectedSong.artist?.username || "Unknown artist"}
          </span>
        </div>
      </div>

      <div className="player-controls">
        <div className="buttons-row">
          <button
            className="control-btn nav-track-btn"
            onClick={handlePrev}
            disabled={!hasPrev}
            title="Previous Track"
          >
            ⏮
          </button>

          <button
            className="control-btn play-pause-btn"
            onClick={handlePlayPauseToggle}
            title={playing ? "Pause" : "Play"}
          >
            {playing ? "Ⅱ" : "▶"}
          </button>

          <button
            className="control-btn nav-track-btn"
            onClick={handleNext}
            disabled={!hasNext}
            title="Next Track"
          >
            ⏭
          </button>
        </div>

        <div className="progress-row">
          <span className="time-display">{formatTime(currentTime)}</span>
          <input
            type="range"
            className="seek-bar"
            min="0"
            max={duration || 0}
            step="0.1"
            value={currentTime}
            onChange={handleSeek}
          />
          <span className="time-display">{formatTime(duration)}</span>
        </div>
      </div>

      <div className="player-volume">
        <button
          className="mute-btn"
          onClick={() => setIsMuted(!isMuted)}
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted || volume === 0 ? "🔇" : "🔊"}
        </button>
        <input
          type="range"
          className="volume-bar"
          min="0"
          max="1"
          step="0.05"
          value={isMuted ? 0 : volume}
          onChange={(e) => {
            setVolume(Number(e.target.value));
            setIsMuted(false);
          }}
        />
      </div>

      <audio
        ref={audioRef}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={handleNext}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
      />
    </footer>
  );
}
