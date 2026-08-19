# Product Requirements Document (PRD)

## 1. Executive Summary
**Soundscape** (Spotify Clone) is a full-stack digital music streaming platform designed to empower artists to upload and organize their music while providing listeners with a seamless, high-quality audio streaming experience. The platform supports role-based user management (Listeners and Artists), cloud-hosted audio storage, album organization, and a responsive web interface featuring a continuous audio playback engine.

---

## 2. Product Vision & Goals
* **Vision**: Deliver an intuitive, artist-centric music platform where creators can publish original tracks and listeners can discover and stream content across devices.
* **Primary Goals**:
  1. Provide secure authentication and role-based access control for Users and Artists.
  2. Enable Artists to seamlessly upload audio files to cloud storage and package tracks into albums.
  3. Offer a responsive front-end interface with uninterrupted, persistent audio playback.
  4. Ensure reliable, low-latency audio streaming backed by cloud infrastructure.

---

## 3. Target User Personas & Roles

| Persona | Role Name | System Role | Primary Needs |
| :--- | :--- | :--- | :--- |
| **Listener** | Regular User | `user` | Browse music catalog, stream tracks, view albums, manage session |
| **Creator** | Artist | `artist` | Upload music tracks, create albums, publish content, stream music |

---

## 4. Key Functional Requirements

### 4.1 Authentication & User Management
* **Account Registration**:
  * Users can register with a unique `username`, unique `email`, `password` (minimum 8 characters), and select a `role` (`user` or `artist`).
  * Default role assigned is `user` if unspecified.
* **User Authentication**:
  * Users can log in using either their `username` or `email` along with their `password`.
  * Successful login generates a signed JSON Web Token (JWT) containing `id` and `role`, issued in an HTTP-only cookie.
* **Session Termination**:
  * Users can log out, clearing the HTTP-only cookie session.

### 4.2 Content Upload & Management (Artist Feature)
* **Track Upload**:
  * Artists can upload audio files along with a required track `title`.
  * Uploaded audio is processed by Multer in memory and streamed directly to ImageKit cloud storage (`spotify-clone/music` directory).
  * Storage returns a public CDN URL, which is saved in the database along with track title and artist reference.
* **Album Creation**:
  * Artists can create an album by specifying an album `title` and selecting one or more of their uploaded track IDs.
  * System validates track IDs and links the album to the artist profile.

### 4.3 Catalog Discovery & Browsing
* **Music Discovery**:
  * Authenticated users (both `user` and `artist`) can view published music tracks with populated artist profile details (`username`, `email`).
* **Album Browsing**:
  * Authenticated users can list all albums with artist metadata.
  * Users can select an album to view its complete tracklist and track details.

### 4.4 Audio Playback System
* **Persistent Player**:
  * Standard persistent bottom audio player bar supporting Play/Pause, Track Progress slider, Volume control, Mute/Unmute, and Next/Previous track navigation.
  * Audio continues uninterrupted as users navigate between catalog views (Home, Albums, Artist Studio).

---

## 5. Non-Functional Requirements (NFRs)

### 5.1 Security
* Passwords must be hashed using `bcrypt` (salt factor 10) prior to database persistence.
* Authentication tokens (JWT) must be stored in secure HTTP-only cookies to mitigate Cross-Site Scripting (XSS) risks.
* Strict payload validation middleware for all user inputs.

### 5.2 Performance & Scalability
* Audio asset delivery must leverage ImageKit CDN for fast global content delivery.
* DB queries must utilize projections and targeted population to keep payload sizes minimal.

### 5.3 Usability & Interface
* Dark-mode aesthetics matching modern music streaming expectations.
* Clear state management for loading, empty catalog, and error conditions.

---

## 6. Success Metrics & Key Performance Indicators (KPIs)
1. **User Growth**: Total registered accounts broken down by `user` and `artist` roles.
2. **Catalog Expansion**: Total tracks uploaded and total albums created.
3. **Engagement**: Average daily streaming sessions per active user.
4. **Reliability Rate**: >99% upload and playback success rate.

---

## 7. Future Roadmap & Enhancements
* **Phase 1 (Current)**: Core Auth, Audio Upload, Album Management, Persistent Player, Basic Catalog.
* **Phase 2**: Global search bar (by song title, album, artist), favorite/liked songs playlist, track play counters.
* **Phase 3**: User custom playlist creation, artist analytics dashboard, social sharing features.
