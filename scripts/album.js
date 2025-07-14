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
      onclick="selectTrack('${track.preview}', \`${track.title.replace(
      /`/g,
      ""
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
const audio = document.getElementById("audio-player");

audio.addEventListener("play", () => {
  audio.style.display = "block";
});

audio.addEventListener("pause", () => {
  audio.style.display = "none";
});

audio.addEventListener("ended", () => {
  audio.style.display = "none";
});
// Format time
function formatDuration(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}:${sec < 10 ? "0" : ""}${sec}`;
}

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
