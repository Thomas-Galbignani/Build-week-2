// Endpoint api
const endpoint = `https://striveschool-api.herokuapp.com/api/deezer/album`;
const parameters = new URLSearchParams(location.search);
const eventId = parameters.get("eventId");
const pageTitle = document.getElementById("page-title");

// Dettagli album
const albumInfoDiv = document.getElementById("album-info");
const trackList = document.getElementById("tracklist-container");
const btnPlayerList = document.getElementById("btn-player-list");
btnPlayerList.style.cursor = "pointer";

// Array delle canzoni
let currentSong = new Audio();
let currentSongArray = [];
let firstTrack = [];

// Elementi del Footer
let playerImgContainer = document.getElementById("player-img-container");
let playerImg = document.getElementById("player-img");
let playerTitle = document.getElementById("player-title");
let playerArtist = document.getElementById("player-artist");
let playerButton = document.getElementById("play");
const playerVolume = document.getElementById("volume-mute");
const progressBar = document.getElementById(`progressBar`);
const footerWrapper = document.getElementById(`footer`);

// costanti per il search
const searchInput = document.getElementById(`searchInput`);
const searchForm = document.getElementById("searchForm");
const searchInputDesktop = document.getElementById(`searchInputDesktop`);
const searchFormDesktop = document.getElementById("searchFormDesktop");

// Funzione per il form di ricerca
const searchSong = function (e) {
  e.preventDefault();
  if (searchInput.value) {
    attribute = searchInput.value;
    window.location.href = `./search.html?eventId=${attribute}`;
  } else if (searchInputDesktop.value) {
    attribute = searchInputDesktop.value;
    window.location.href = `./search.html?eventId=${attribute}`;
  }
};

searchForm.addEventListener("submit", searchSong);
searchFormDesktop.addEventListener("submit", searchSong);



// Pulsante per far partire la prima canzone
btnPlayerList.addEventListener("click", () => {
  playSong(firstTrack);
  console.log(firstTrack);
});

// Funzione per formattare il tempo della canzone
function formatDuration(seconds) {
  if (isNaN(seconds)) return "0:00";
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec < 10 ? "0" : ""}${sec}`;
}

const songInPlay = localStorage.getItem(`currentSong`);

const popUpFooter = function () {
  if (songInPlay === null) {
    footerSong(null);
    //  footerWrapper.classList.add(`d-none`);
  } else {
    const songInPlayArray = JSON.parse(songInPlay);
    console.log(`entrati con successo `, songInPlayArray);
    currentSongArray.push(songInPlayArray);
    footerWrapper.classList.remove(`d-none`);
    footerSong(currentSongArray);
  }
};

// Funzione per il la barra di riproduzione del footer
const footerSong = function (song) {

  if (song === null) {
    footerWrapper.classList.add(`d-none`);
  } else {
    footerWrapper.classList.remove(`d-none`);
    console.log(currentSongArray);
    playerButton.disabled = false;
    playerImgContainer.classList.remove("opacity-0");
    playerImg.setAttribute("src", currentSongArray[0].album.cover_small);
    playerArtist.innerText = currentSongArray[0].artist.name;
    const playerArtistLink = playerArtist.parentElement;
    playerArtistLink.href = `./artists.html?eventId=${currentSongArray[0].artist.id}`;
    playerTitle.innerText = currentSongArray[0].title;
    const playerTitleLink = playerTitle.parentElement;
    playerTitleLink.href = `./album.html?eventId=${currentSongArray[0].album.id}`;
    playerButton.innerHTML = `
    <i class="bi bi-pause-circle-fill text-light h3"></i>
    `;
  }
};

// Funzione per il pulsante play del footer
playerButton.addEventListener("click", () => {
  if (!currentSong.paused) {
    // Se la canzone non è in pausa
    currentSong.pause(); // Mette in pausa la canzone
    playerButton.innerHTML = `
      <i class="bi bi-play-circle-fill text-light h3"></i>
      `;
  } else if (currentSong.paused) {
    // Se la canzone è in pausa
    currentSong.play(); // Avvia la canzone
    playerButton.innerHTML = `
      <i class="bi bi-pause-circle-fill text-light h3"></i>
      `;
  }
});

// Funzione per far partire la musica
const playSong = function (songToPlay) {
  if (songToPlay) {
    currentSong.pause();
    currentSongArray = [songToPlay];
    console.log("canzone passata dal click", currentSongArray);
    currentSong = new Audio(currentSongArray[0].preview);
    console.log("canzone corrente", currentSong);
  } else {
    currentSong = new Audio(currentSongArray[0].preview);
  }
  currentSong.addEventListener("timeupdate", updateProgressBar); // Per la progressBar
  currentSong.currentTime = 0; // Portiamo il tempo della canzone a 0
  currentSong.pause(); // Mettiamo in pausa la canzone corrente
  // Aggiunge e currentSong il link della canzone
  currentSong
    .play() // Avvia la canzone
    .then(() => {
      localStorage.setItem(`currentSong`, JSON.stringify(songToPlay));
    })
    .then(() => {
      footerSong(songToPlay); // Lanciamo la funzione footerSong
    })
    .catch((error) => {
      console.error(`Non funziona: Errore durante la riproduzione.`, error);
    });
};

// Funzione per togliere l'audio
const muteUnmute = function () {
  if (currentSong.volume === 0) {
    playerVolume.classList.remove("bi", "bi-volume-up");
    playerVolume.classList.add("bi", "bi-volume-mute");
  } else {
    playerVolume.classList.remove("bi", "bi-volume-mute");
    playerVolume.classList.add("bi", "bi-volume-up");
  }
};

// Diamo lo stile del cursore pointer al pulsante del volume muto
playerVolume.style.cursor = "pointer";

// Funzione per mutare o smutare la canzone
playerVolume.addEventListener("click", () => {
  if (currentSong.volume === 0) {
    // Se il volume è 0
    currentSong.volume = 1;
    playerVolume.classList.remove("bi", "bi-volume-mute");
    playerVolume.classList.add("bi", "bi-volume-up");
  } else {
    playerVolume.classList.remove("bi", "bi-volume-up");
    playerVolume.classList.add("bi", "bi-volume-mute");
    currentSong.volume = 0;
  }
});

// Funzione per animare la barra bianca del player
function updateProgressBar() {
  if (currentSong.duration > 0) {
    const percentage = (currentSong.currentTime / currentSong.duration) * 100;
    progressBar.style.width = `${percentage}%`;
  } else {
    // Se la durata non è ancora disponibile o è 0
    progressBar.style.width = `0%`;
    console.log(progressBar);
  }
}

// Funzione per lo slider del volume
const volumeSlider = document.getElementById("volume");
if (volumeSlider) {
  volumeSlider.addEventListener("input", function () {
    if (currentSong) {
      currentSong.volume = parseFloat(this.value);
      muteUnmute();
    }
  });
}

//Funzione per recuperare l'album con l'ID
fetch(endpoint + `/` + eventId)
  .then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error(` tutto rotto`);
    }
  })
  .then((album) => {
    console.log("album", album);
    // Popoliamo la sezione in alto
    pageTitle.innerText = album.title;
    albumInfoDiv.innerHTML = `
            <img id="album-cover" src="${album.cover_medium
      }" class="me-3 rounded" style="width: 250px; padding-left: 20px" crossorigin="anonymous" />
            <div>
                <div class="text-white">ALBUM</div>
                <h2 class="text-white">${album.title}</h2>
                <div class="text-white"><a class="text-decoration-none text-light" href="./artists.html?eventId=${album.artist.id
      }">${album.artist.name} • ${album.release_date || "?"}</a></div>
            </div>
            `;

    setMainContentBackground(album.cover_medium);
    // Popoliamo la lista delle canzoni dell'album
    firstTrack = album.tracks.data[0];
    album.tracks.data.forEach((track, index) => {
      const trackItem = document.createElement("div");
      trackItem.innerHTML = `
                <div class="d-flex py-2 px-4 text-white track-row" style="cursor: pointer;">
                    <div style="width: 50%;">${index + 1}. ${track.title
        }<br><p>${track.artist.name}</p></div>
                    <div style="width: 30%; text-align: center;">${track.rank.toLocaleString()}</div>
                    <div style="width: 20%; text-align: right;">${formatDuration(
          track.duration
        )}</div>
                </div>
            `;
      trackItem.addEventListener("click", () => {
        playSong(track); // Passa l'intero oggetto 'track'
      });
      trackList.appendChild(trackItem);
    });
  })
  .catch(() => {
    console.log(`tuttto sbagliato`);
  });

function setMainContentBackground(imgSrc) {
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

popUpFooter();
