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
// dipslay none at start
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

// Play/pause
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

// Track lists
function renderTracklist(tracks) {
  currentTracks = tracks;
  const container = document.getElementById("tracklist-container");
  container.innerHTML = "";

  tracks.forEach((track, index) => {
    container.innerHTML += `
      <div class="d-flex align-items-center py-2 px-4 text-white track-row" style="cursor: pointer;"
        onclick="selectTrack('${track.preview}', \`${track.title.replace(/`/g, "")}\`, '${track.artist.name}', '${track.album.cover_medium}', ${index})">
        <div style="width: 40px;" class="text-center">${index + 1}</div>
        <div class="flex-grow-1">${track.title}</div>
        <div style="width: 120px;" class="text-center">${track.rank.toLocaleString()}</div>
        <div style="width: 60px;" class="text-end">${formatDuration(track.duration)}</div>
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
    currentTrackIndex = currentTracks.length - 1; // Əgər əvvəldirsə sonuncuya getsin
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
  if (currentPreviewUrl) {
    document.getElementById("audio-player").play();
  } else {
    alert("Please choose a track!");
  }
});

const heartBtn = document.querySelector(".bi-heart");
let liked = false;
heartBtn.addEventListener("click", () => {
  if (!currentTrackTitle) return alert("Please choose a track!");
  liked = !liked;
  heartBtn.classList.toggle("text-danger", liked);
});

document.querySelector(".bi-download").addEventListener("click", () => {
  if (currentPreviewUrl) {
    const a = document.createElement("a");
    a.href = currentPreviewUrl;
    a.download = `${currentTrackTitle}-preview.mp3`;
    a.click();
  } else {
    alert("Please choose a track!");
  }
});

document.querySelector(".new-class").addEventListener("click", () => {
  if (!currentTrackTitle) return alert("Please choose a track!");
  alert(`Options...`);
});


window.addEventListener("DOMContentLoaded", () => {
  fetchAlbums("rock");
});

const footerSong = function () {
  if (currentSongArray.length === 0) {
    console.log('sono nell if', currentSongArray)
  } else {
    console.log(currentSongArray)
    playerImgContainer.classList.remove('opacity-0')
    playerImg.setAttribute('src', currentSongArray[0].album.cover_small)
    playerArtist.innerText = currentSongArray[0].artist.name
    playerTitle.innerText = currentSongArray[0].title
    playerButton.innerHTML = `
    <i class="bi bi-pause-circle-fill text-light h3"></i>
    `
  }
}

playerButton.addEventListener('click', () => {
  currentSong.pause();
  if (currentSong.paused) {
    playerButton.innerHTML = `
    <i class="bi bi-play-circle-fill text-light h3"></i>
    `
  } else {
    playerButton.innerHTML = `
    <i class="bi bi-pause-circle-fill text-light h3"></i>
    `
  }
})
