// Endpoint api
const endpoint = `https://striveschool-api.herokuapp.com/api/deezer/artist`;
const parameters = new URLSearchParams(location.search);
const pageTitle = document.getElementById("page-title");
const eventId = parameters.get("eventId");

// array delle canzoni
let currentSong = new Audio();
let currentSongArray = [];

const topTracks = document.getElementById("top-50");
const imgWrapper = document.getElementById("image-wrapper");
const artistImg = document.getElementById("imgArtist");
const artistLike = document.getElementById("artistLike");

// Elementi del Footer
let playerImgContainer = document.getElementById("player-img-container");
let playerImg = document.getElementById("player-img");
let playerTitle = document.getElementById("player-title");
let playerArtist = document.getElementById("player-artist");
let playerButton = document.getElementById("play");
const playerVolume = document.getElementById("volume-mute");
const progressBar = document.getElementById(`progressBar`);

//Funzione per recuperare i dati dell'artista
fetch(endpoint + `/` + eventId)
  .then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error(` tutto rotto`);
    }
  })
  .then((artist) => {
    console.log("artista", artist);
    artistImg.src = artist.picture;
    artistLike.innerText = `
    DI ${artist.name}`;
    pageTitle.innerText = artist.name;
    (imgWrapper.style.backgroundImage = `url(${artist.picture_xl})`),
      (imgWrapper.style.backgroundSize = "cover");
    imgWrapper.style.backgroundRepeat = "no-repeat";
    imgWrapper.style.backgroundPosition = "center";
    imgWrapper.style.height = "15%";
    const artistTracklistEndpoint = artist.tracklist; // Recuperiamo l'endpoint della top 50
    imgWrapper.innerHTML = `
          <div>
              <div class="mb-4 d-flex mt-2">
                <button
                  class="btn btn-outline-light me-2 rounded-circle d-flex justify-content-center align-items-center p-1"
                  id="btn-back"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    class="bi bi-chevron-left"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"
                    />
                  </svg>
                </button>
                <button
                  class="btn btn-outline-light rounded-circle d-flex justify-content-center align-items-center p-1"
                  id="btn-next"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    class="bi bi-chevron-right"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div class="d-flex flex-column mt-auto text-white">
              <p class="mb-0">
                <i class="bi-patch-check-fill text-primary me-1"></i>Artista
                verificato
              </p>
              <h1 class="display-2">${artist.name}</h1>
              <p class="mt-3">${artist.nb_fan} ascoltatori mensili</p>
            </div>
    `;

    // Nuova chiamata all'api per recuperare la top 50
    fetch(artistTracklistEndpoint)
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error(` tutto rotto`);
        }
      })
      .then((tracklist) => {
        console.log(tracklist);
        // Ordiniamo le canzoni in base al rank
        tracklist.data.sort((a, b) => b.rank - a.rank);
        tracklist.data.forEach((track, index) => {
          const trackDiv = document.createElement("div");
          trackDiv.style.cursor = "pointer";
          trackDiv.innerHTML = `
          <div class="d-flex align-items-center py-2 mx-4" id="${index}">
                    <div class="d-flex align-items-center me-auto">
                      <p class="text-secondary mb-0">${index + 1}</p>
                      <img src="${track.album.cover}" alt="img-${
            track.title
          }" class="mx-3 img-fluid" style="width: 50px; height: 50px; object-fit: cover"/>
                      <p class="mb-0">${track.title}</p>
                    </div>
                    <p class="text-secondary mb-0 me-3">${track.rank}</p>
                    <p class="text-secondary mb-0">${formatDuration(
                      track.duration
                    )}</p>
            </div>
            `;
          trackDiv.addEventListener("click", () => {
            playSong(track); // Passa l'intero oggetto 'track'
          });
          topTracks.appendChild(trackDiv);
        });
      })
      .catch(() => {
        console.log(`Tracklist tuttto sbagliato`);
      });
  })
  .catch(() => {
    console.log(`tuttto sbagliato`);
  });

const songInPlay = localStorage.getItem(`currentSong`);
if (songInPlay) {
  const songInPlayArray = JSON.parse(songInPlay);
  console.log(songInPlayArray);
  currentSongArray.push(songInPlayArray);
}

// Funzione per il la barra di riproduzione del footer
const footerSong = function () {
  if (currentSongArray.length === 0) {
    playerButton.disabled = true;
    console.log("sono nell if", currentSongArray);
  } else {
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
    playSong();
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
    footerSong();
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
      console.log(`sono io `, currentSongArray[0]);
      console.log(`stai ascoltando la canzone: ${currentSongArray[0].title}`);
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

// Funzione per formattare il tempo della canzone
function formatDuration(seconds) {
  if (isNaN(seconds)) return "0:00";
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec < 10 ? "0" : ""}${sec}`;
}

footerSong();
