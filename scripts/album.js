let albumList = [];
let currentAlbumIndex = 0;
let currentPreviewUrl = "";
let currentTrackTitle = "";

// Call albums
async function fetchAlbums(query = "album") {
  try {
    const res = await fetch(
      `https://striveschool-api.herokuapp.com/api/deezer/search?q=${query}`
    );
    const data = await res.json();
    albumList = data.data;
    currentAlbumIndex = 0;
    showAlbum(albumList[currentAlbumIndex]);
  } catch (err) {
    console.error("Error has occured:", err);
  }
}

// Album and track list
async function showAlbum(albumData) {
  const albumId = albumData.album.id;

  try {
    const res = await fetch(
      `https://striveschool-api.herokuapp.com/api/deezer/album/${albumId}`
    );
    const album = await res.json();
    const proxyImgSrc = album.cover_medium;

    const albumInfoDiv = document.getElementById("album-info");
    albumInfoDiv.innerHTML = `
      <img id="album-cover" src="${proxyImgSrc}" class="me-3 rounded" style="width: 250px; padding-left: 20px" crossorigin="anonymous" />
      <div>
        <div>ALBUM</div>
        <h2>${album.title}</h2>
        <div>${album.artist.name} • ${album.release_date || "?"}</div>
      </div>
    `;

    renderTracklist(album.tracks.data);
  } catch (err) {
    console.error("Error has occured:", err);
  }

  const img = document.getElementById("album-cover");
  const colorThief = new ColorThief();

  if (img.complete) {
    setBackgroundColor();
  } else {
    img.addEventListener("load", setBackgroundColor);
  }

  function setBackgroundColor() {
    try {
      const dominantColor = colorThief.getColor(img);
      const rgb = `rgb(${dominantColor.join(",")})`;

      // Gradient
      const gradient = `linear-gradient(to bottom, ${rgb}, rgba(0, 0, 0, 0.7))`;

      const main = document.getElementById("main-content");
      main.style.backgroundImage = gradient;
      main.style.backgroundSize = "cover";
      main.style.backgroundRepeat = "no-repeat";

      main.style.color = "white";
    } catch (e) {
      console.error("Error has occured:", e);
      document.getElementById("main-content").style.background = "#000";
    }
  }
  function getTextColor(rgb) {
    const brightness = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
    return brightness > 125 ? "#000" : "#fff";
  }
}

// Track list
function renderTracklist(tracks) {
  const container = document.getElementById("tracklist-container");
  container.innerHTML = "";

  tracks.forEach((track, index) => {
    container.innerHTML += `
    <div
      class="d-flex align-items-center py-2 px-4 text-white track-row"
      style="cursor: pointer;"
      onclick="selectTrack('${track.preview}', \`${track.title.replace(/`/g, "")}\`, \`${track.artist.name}\`, '${track.album.cover_small}')"
    )}\`, this)"
    >
      <div style="width: 40px;" class="text-center">${index + 1}</div>
      <div class="flex-grow-1">${track.title}</div>
      <div style="width: 120px;" class="text-center">${track.rank.toLocaleString()}</div>
      <div style="width: 60px;" class="text-end">${formatDuration(
        track.duration
      )}</div>
    </div>
  `;
  });
}

function selectTrack(previewUrl, title) {
  currentPreviewUrl = previewUrl;
  currentTrackTitle = title;
  const audio = document.getElementById("audio-player");
  audio.src = previewUrl;
  audio.play();
  console.log("Selected track:", title);
}
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

let isPlaying = false;

// footer is none at start
footer.style.display = "none";

function selectTrack(previewUrl, title, artist, cover) {
  audio.src = previewUrl;
  playerTitle.textContent = title;
  playerArtist.textContent = artist;
  playerImg.src = cover;
  footer.style.display = "block";
  playerImgContainer.classList.remove("opacity-0");
  audio.play();
  isPlaying = true;
  updatePlayButton();
  durationElem.textContent = formatDuration(audio.duration || 30);
}

// Play/pause button
playBtn.addEventListener("click", () => {
  if (!audio.src) {
    alert("Please select a track first!");
    return;
  }

  if (isPlaying) {
    audio.pause();
  } else {
    audio.play();
  }
  isPlaying = !isPlaying;
  updatePlayButton();
});

// Audio events
audio.addEventListener("timeupdate", () => {
  const progressPercent = (audio.currentTime / audio.duration) * 100;
  progressBar.style.width = progressPercent + "%";
  currentTimeElem.textContent = formatDuration(audio.currentTime);
});

audio.addEventListener("ended", () => {
  isPlaying = false;
  updatePlayButton();
  footer.style.display = "none";
});

// Play button
function updatePlayButton() {
  if (isPlaying) {
    playIcon.classList.remove("bi-play-circle-fill");
    playIcon.classList.add("bi-pause-circle-fill");
  } else {
    playIcon.classList.add("bi-play-circle-fill");
    playIcon.classList.remove("bi-pause-circle-fill");
  }
}

// Volume
volumeSlider.addEventListener("input", (e) => {
  audio.volume = e.target.value / 100;
});


function formatDuration(seconds) {
  if (isNaN(seconds)) return "0:00";
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec < 10 ? "0" : ""}${sec}`;
}
document.getElementById("close-footer").addEventListener("click", () => {
  audio.pause(); 
  footer.style.display = "none";  // Footer is none
});

let currentTracks = [];
let currentTrackIndex = 0;

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
      <div style="width: 20%; text-align: right;" class="text-end">${formatDuration(track.duration)}</div>
      </div>
    `;
  });
}

function selectTrack(previewUrl, title, artist, cover, index) {
  currentTrackIndex = index !== undefined ? index : 0;
  audio.src = previewUrl;
  playerTitle.textContent = title;
  playerArtist.textContent = artist;
  playerImg.src = cover;
  footer.style.display = "block";
  playerImgContainer.classList.remove("opacity-0");
  audio.play();
  isPlaying = true;
  updatePlayButton();
  durationElem.textContent = "0:30";

  // Remove highlight from all tracks
  document.querySelectorAll(".track-row").forEach((el) => {
    el.classList.remove("highlight");
  });

  // Add highlight to the selected track row
  const trackRows = document.querySelectorAll(".track-row");
  if (trackRows[index]) {
    trackRows[index].classList.add("highlight");
  }
}

// Shuffle button
document.querySelector(".bi-shuffle").addEventListener("click", () => {
  if (currentTracks.length === 0) return;
  const randomIndex = Math.floor(Math.random() * currentTracks.length);
  const track = currentTracks[randomIndex];
  selectTrack(track.preview, track.title, track.artist.name, track.album.cover_medium, randomIndex);
});

// Skip backward
document.querySelector(".bi-skip-backward-fill").addEventListener("click", () => {
  if (currentTrackIndex > 0) {
    currentTrackIndex--;
  } else {
    currentTrackIndex = currentTracks.length - 1;
  }
  const track = currentTracks[currentTrackIndex];
  selectTrack(track.preview, track.title, track.artist.name, track.album.cover_medium, currentTrackIndex);
});

// Skip forward
document.querySelector(".bi-skip-forward-fill").addEventListener("click", () => {
  if (currentTrackIndex < currentTracks.length - 1) {
    currentTrackIndex++;
  } else {
    currentTrackIndex = 0;
  }
  const track = currentTracks[currentTrackIndex];
  selectTrack(track.preview, track.title, track.artist.name, track.album.cover_medium, currentTrackIndex);
});

// Repeat
let isRepeat = false;
document.querySelector(".bi-repeat").addEventListener("click", () => {
  isRepeat = !isRepeat;
  audio.loop = isRepeat;
  alert(isRepeat ? "Repeat ON" : "Repeat OFF");
});

// Right and left arrows
document.querySelector(".bi-chevron-left").addEventListener("click", () => {
  if (currentAlbumIndex > 0) {
    currentAlbumIndex--;
  } else {
    currentAlbumIndex = albumList.length - 1;
  }
  showAlbum(albumList[currentAlbumIndex]);
});

document.querySelector(".bi-chevron-right").addEventListener("click", () => {
  if (currentAlbumIndex < albumList.length - 1) {
    currentAlbumIndex++;
  } else {
    currentAlbumIndex = 0;
  }
  showAlbum(albumList[currentAlbumIndex]);
});

// (Play, Like, Download, Menu)
document.querySelector(".bi-play-circle-fill").addEventListener("click", () => {
  if (currentTracks.length === 0) return alert("No tracks available!");

  // Select and play the first track
  const firstTrack = currentTracks[0];
  selectTrack(firstTrack.preview, firstTrack.title, firstTrack.artist.name, firstTrack.album.cover_medium, 0);
});

document.querySelector(".new-class").addEventListener("click", () => {
  if (!currentTrackTitle) return alert("Please choose a track!");
  alert(`Options...`);
});


window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const albumId = params.get("album");
  
  if (albumId) {
    fetchAlbumById(albumId);
  } else {
    fetchAlbums("rock");
  }
});

