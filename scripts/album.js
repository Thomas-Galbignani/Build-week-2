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
const progressContainer = document.querySelector(".progress-bar-container .flex-grow-1");

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
  showFooter();
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
  } else if (isShuffle) {
    const randomIndex = Math.floor(Math.random() * currentTracks.length);
    currentTrackIndex = randomIndex;
    const track = currentTracks[randomIndex];
    selectTrack(track.preview, track.title, track.artist.name, track.album.cover_medium, randomIndex);
  } else {
    currentTrackIndex = (currentTrackIndex + 1) % currentTracks.length;
    const track = currentTracks[currentTrackIndex];
    selectTrack(track.preview, track.title, track.artist.name, track.album.cover_medium, currentTrackIndex);
    audio.play();
  }
});

volumeSlider.addEventListener("input", (e) => {
  audio.volume = e.target.value / 100;
});

let isShuffle = false;

document.querySelector(".bi-shuffle").addEventListener("click", () => {
  isShuffle = !isShuffle;
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

let isDragging = false;

progressContainer.addEventListener("mousedown", (e) => {
  isDragging = true;
  seekAudio(e);
});

window.addEventListener("mousemove", (e) => {
  if (isDragging) {
    seekAudio(e);
  }
});

window.addEventListener("mouseup", (e) => {
  if (isDragging) {
    seekAudio(e);
    isDragging = false;
  }
});

function seekAudio(e) {
  if (!audio.duration) return;

  const rect = progressContainer.getBoundingClientRect();
  const offsetX = e.clientX - rect.left;
  const percent = Math.min(Math.max(offsetX / rect.width, 0), 1);

  progressBar.style.width = `${percent * 100}%`;

   audio.currentTime = percent * audio.duration;
  currentTimeElem.textContent = formatDuration(audio.currentTime);
}

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
  hideFooter();
});

function showFooter() {
  footer.style.display = "block";
  const mainContent = document.getElementById("main-content");
  mainContent.style.height = "calc(100vh - 100px)";
  document.documentElement.classList.add("shrink");
}

function hideFooter() {
  footer.style.display = "none";
  const mainContent = document.getElementById("main-content");
  mainContent.style.height = "100vh";
  document.documentElement.classList.remove("shrink");
}

const playerVolume = document.getElementById("player-volume");
const currentSong = audio;  // audio elementin varsa bunu istifadə et

playerVolume.addEventListener("click", () => {
  if (currentSong.volume === 0) {
    currentSong.volume = 1;
    playerVolume.classList.replace("bi-volume-mute", "bi-volume-up");
  } else {
    currentSong.volume = 0;
    playerVolume.classList.replace("bi-volume-up", "bi-volume-mute");
  }
});



// play/ three dots
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
  const parameters = new URLSearchParams(window.location.search);
  const eventId = parameters.get("eventId") || parameters.get("album");

  if (eventId) {
    fetchAlbumById(eventId);
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
