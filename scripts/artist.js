// Endpoint api
const endpoint = `https://striveschool-api.herokuapp.com/api/deezer/artist`;
const parameters = new URLSearchParams(location.search);
const pageTitle = document.getElementById("page-title");
const eventId = parameters.get("eventId");

// Array delle canzoni
let currentSong = new Audio();
let currentSongArray = [];
let firstTrack = [];

const topTracks = document.getElementById("top-50");
const imgWrapper = document.getElementById("image-wrapper");
const artistImg = document.getElementById("imgArtist");
const artistLike = document.getElementById("artistLike");
const btnViewMore = document.getElementById("viewMore");
const btnPlayerList = document.getElementById("btn-player-list");

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
    currentSong = new Audio(currentSongArray[0].preview);
    currentSong.addEventListener("timeupdate", updateProgressBar);
    footerSong(currentSongArray);
  }
};

// Pulsante per far partire la prima canzone
btnPlayerList.addEventListener("click", () => {
  playSong(firstTrack);
  console.log(firstTrack);
});

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

// Funzione per formattare il tempo della canzone
function formatDuration(seconds) {
  if (isNaN(seconds)) return "0:00";
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec < 10 ? "0" : ""}${sec}`;
}


// Funzione per recuperare i dati dell'artista
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
    artistImg.classList.add('artist-img'); // Classe Hover sull'immagine
    artistLike.innerText = `
    Di ${artist.name}`;
    pageTitle.innerText = artist.name;
    (imgWrapper.style.backgroundImage = `url(${artist.picture_xl})`),
      (imgWrapper.style.backgroundSize = "cover");
    imgWrapper.style.backgroundRepeat = "no-repeat";
    imgWrapper.style.backgroundPosition = "center";
    const artistTracklistEndpoint = artist.tracklist; // Recuperiamo l'endpoint della top 50
    imgWrapper.innerHTML = `
          <div>
              <div class="mb-4 d-flex mt-2">
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
        firstTrack = tracklist.data[0];
        tracklist.data.forEach((track, index) => {
          const trackDiv = document.createElement("div");
          trackDiv.id = `${index}`;
          trackDiv.style.cursor = "pointer";
          trackDiv.classList.add("d-none", "track-item-hover");
          trackDiv.innerHTML = `
          <div class="d-flex align-items-center py-2 mx-4">
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

          // funzioni per mostrare meno e più con il pulsante visualizza altro

          const vediAltro = function () {
            if ((btnViewMore.innerText = "VISUALIZZA ALTRO")) {
              btnViewMore.addEventListener("click", () => {
                if (trackDiv.id < 10) {
                  trackDiv.classList.remove("d-none");
                  btnViewMore.innerText = "VISUALIZZA MENO";
                  vediMeno();
                }
              });
            }
          };
          vediAltro();

          const vediMeno = function () {
            if (btnViewMore.innerText === "VISUALIZZA MENO") {
              btnViewMore.addEventListener("click", () => {
                console.log("ciao voglio chiudere la visuale");
                if (trackDiv.id >= 5) {
                  trackDiv.classList.add("d-none");
                  btnViewMore.innerText = "VISUALIZZA ALTRO";
                  vediAltro();
                }
              });
            }
          };

          if (trackDiv.id < 5) {
            trackDiv.classList.remove("d-none");
          }
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
  

popUpFooter();
