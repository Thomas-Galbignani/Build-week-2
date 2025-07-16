let albumList = [];
let currentAlbumIndex = 0;
let currentTracks = [];
let currentTrackIndex = 0;
let isPlaying = false;
let isRepeat = false;

const audio = new Audio();
const footer = document.getElementById("footer");
const playBtn = document.getElementById("play");
const playIcon = playBtn.querySelector("i");
const playerImgContainer = document.getElementById("player-img-container");
const playerImg = document.getElementById("player-img");
const playerTitle = document.getElementById("player-title");
const playerArtist = document.getElementById("player-artist");
const progressBar = document.querySelector(".progress-bar");
const currentTimeElem = document.querySelector(".current-time");
const durationElem = document.querySelector(".duration");
const volumeSlider = document.getElementById("volume");

footer.style.display = "none";

// Fetch albums
async function fetchAlbums(query = "album") {
  try {
    const res = await fetch(`https://striveschool-api.herokuapp.com/api/deezer/search?q=${query}`);
    const data = await res.json();
    albumList = data.data;
    currentAlbumIndex = 0;
    showAlbum(albumList[currentAlbumIndex]);
  } catch (err) {
    console.error("Error fetching albums:", err);
  }
}

async function fetchAlbumById(albumId) {
  try {
    const res = await fetch(`https://striveschool-api.herokuapp.com/api/deezer/album/${albumId}`);
    const album = await res.json();
    albumList = [album];
    currentAlbumIndex = 0;
    showAlbum(album);
  } catch (err) {
    console.error("Error fetching album by ID:", err);
  }
}

async function showAlbum(albumData) {
  let album = albumData;

  if (albumData.album && albumData.album.id) {
    const albumId = albumData.album.id;
    try {
      const res = await fetch(`https://striveschool-api.herokuapp.com/api/deezer/album/${albumId}`);
      album = await res.json();
    } catch (err) {
      console.error("Error fetching album details:", err);
      return;
    }
  }
  
  const albumIdToSet = album.id || (albumData.album && albumData.album.id);
  if (albumIdToSet) {
    const url = new URL(window.location);
    url.searchParams.set("album", albumIdToSet);
    window.history.pushState({}, "", url);
  }

  const albumInfoDiv = document.getElementById("album-info");

  albumInfoDiv.innerHTML = `
    <img id="album-cover" src="${album.cover_medium}" class="me-3 rounded" style="width: 250px; padding-left: 20px" crossorigin="anonymous" />
    <div>
      <div>ALBUM</div>
      <h2>${album.title}</h2>
      <div>${album.artist.name} • ${album.release_date || "?"}</div>
    </div>
  `;

  renderTracklist(album.tracks.data);
  setDynamicBackground(album.cover_medium);
}

function renderTracklist(tracks) {
  currentTracks = tracks;
  const container = document.getElementById("tracklist-container");
  container.innerHTML = "";

  tracks.forEach((track, index) => {
    container.innerHTML += `
      <div class="d-flex py-2 px-4 text-white track-row" style="cursor: pointer;"
        onclick="selectTrack('${track.preview}', \`${track.title.replace(/`/g, "")}\`, '${track.artist.name}', '${track.album.cover_medium}', ${index})">
        <div style="width: 50%;">${index + 1}. ${track.title}</div>
        <div style="width: 30%; text-align: center;">${track.rank.toLocaleString()}</div>
        <div style="width: 20%; text-align: right;">${formatDuration(track.duration)}</div>
      </div>
    `;
  });
}

function selectTrack(previewUrl, title, artist, cover, index = 0) {
  currentTrackIndex = index;
  audio.src = previewUrl;
  playerTitle.textContent = title;
  playerArtist.textContent = artist;
  playerImg.src = cover;
  footer.style.display = "block";
  playerImgContainer.classList.remove("opacity-0");
  audio.play();
  isPlaying = true;
  updatePlayButton();
  durationElem.textContent = "0:30"; // Deezer previews are 30s

  document.querySelectorAll(".track-row").forEach(el => el.classList.remove("highlight"));
  document.querySelectorAll(".track-row")[index]?.classList.add("highlight");
}

function updatePlayButton() {
  if (isPlaying) {
    playIcon.classList.remove("bi-play-circle-fill");
    playIcon.classList.add("bi-pause-circle-fill");
  } else {
    playIcon.classList.add("bi-play-circle-fill");
    playIcon.classList.remove("bi-pause-circle-fill");
  }
}

function setDynamicBackground(imgSrc) {
  const img = new Image();
  img.crossOrigin = "Anonymous";
  img.src = imgSrc;
  img.onload = () => {
    const colorThief = new ColorThief();
    const dominantColor = colorThief.getColor(img);
    const rgb = `rgb(${dominantColor.join(",")})`;
    const gradient = `linear-gradient(to bottom, ${rgb}, rgba(0,0,0,0.7))`;

    const main = document.getElementById("main-content");
    main.style.backgroundImage = gradient;
    main.style.color = "white";
  };
}

function formatDuration(seconds) {
  if (isNaN(seconds)) return "0:00";
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec < 10 ? "0" : ""}${sec}`;
}

// Events
playBtn.addEventListener("click", () => {
  if (!audio.src) return alert("Please select a track first!");
  if (isPlaying) audio.pause();
  else audio.play();
  isPlaying = !isPlaying;
  updatePlayButton();
});

audio.addEventListener("timeupdate", () => {
  const progressPercent = (audio.currentTime / audio.duration) * 100;
  progressBar.style.width = progressPercent + "%";
  currentTimeElem.textContent = formatDuration(audio.currentTime);
});

audio.addEventListener("ended", () => {
  if (isRepeat) {
    audio.play();
  } else {
    isPlaying = false;
    updatePlayButton();
    footer.style.display = "none";
  }
});

volumeSlider.addEventListener("input", (e) => {
  audio.volume = e.target.value / 100;
});

document.querySelector(".bi-shuffle").addEventListener("click", () => {
  if (currentTracks.length === 0) return;
  const randomIndex = Math.floor(Math.random() * currentTracks.length);
  const track = currentTracks[randomIndex];
  selectTrack(track.preview, track.title, track.artist.name, track.album.cover_medium, randomIndex);
});

document.querySelector(".bi-skip-backward-fill").addEventListener("click", () => {
  currentTrackIndex = (currentTrackIndex > 0) ? currentTrackIndex - 1 : currentTracks.length - 1;
  const track = currentTracks[currentTrackIndex];
  selectTrack(track.preview, track.title, track.artist.name, track.album.cover_medium, currentTrackIndex);
});

document.querySelector(".bi-skip-forward-fill").addEventListener("click", () => {
  currentTrackIndex = (currentTrackIndex < currentTracks.length - 1) ? currentTrackIndex + 1 : 0;
  const track = currentTracks[currentTrackIndex];
  selectTrack(track.preview, track.title, track.artist.name, track.album.cover_medium, currentTrackIndex);
});

document.querySelector(".bi-repeat").addEventListener("click", () => {
  isRepeat = !isRepeat;
  audio.loop = isRepeat;
  alert(isRepeat ? "Repeat ON" : "Repeat OFF");
});

document.querySelector(".bi-chevron-left").addEventListener("click", () => {
  if (albumList.length <= 1) {
    fetchAlbums("rock");
    return;
  }
  currentAlbumIndex = (currentAlbumIndex > 0) ? currentAlbumIndex - 1 : albumList.length - 1;
  showAlbum(albumList[currentAlbumIndex]);
});

document.querySelector(".bi-chevron-right").addEventListener("click", () => {
  if (albumList.length <= 1) {
    fetchAlbums("rock");
    return;
  }
  currentAlbumIndex = (currentAlbumIndex < albumList.length - 1) ? currentAlbumIndex + 1 : 0;
  showAlbum(albumList[currentAlbumIndex]);
});
document.getElementById("close-footer").addEventListener("click", () => {
  audio.pause();
  isPlaying = false;
  updatePlayButton();
  footer.style.display = "none";
});

document.querySelector(".bi-play-circle-fill").addEventListener("click", () => {
  if (currentTracks.length === 0) return alert("No tracks available!");
  const firstTrack = currentTracks[0];
  selectTrack(firstTrack.preview, firstTrack.title, firstTrack.artist.name, firstTrack.album.cover_medium, 0);
});

document.querySelector(".new-class").addEventListener("click", () => {
  if (!playerTitle.textContent) return alert("Please choose a track!");
  alert("Options...");
});

// Initial Load
window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const albumIdFromQuery = params.get("album");
  const albumIdFromHash = window.location.hash.substring(1);

  if (albumIdFromQuery) {
    fetchAlbumById(albumIdFromQuery);
  } else if (albumIdFromHash) {
    fetchAlbumById(albumIdFromHash);
  } else {
    fetchAlbums("rock");
  }
});

// React on hash change
window.addEventListener('hashchange', () => {
  const newAlbumId = window.location.hash.substring(1);
  if (newAlbumId) {
    fetchAlbumById(newAlbumId);
  }
});
