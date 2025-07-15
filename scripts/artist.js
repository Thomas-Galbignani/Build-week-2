// Endpoint api
const endpoint = `https://striveschool-api.herokuapp.com/api/deezer/artist`;

const parameters = new URLSearchParams(location.search);

const eventId = parameters.get("eventId");

// array delle canzoni
let currentSong = new Audio();
const currentSongArray = [];

fetch(endpoint + `/` + eventId)
  .then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error(` tutto rotto`);
    }
  })
  .then((artist) => {
    console.log(artist);
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

console.log(currentSongArray[0].preview);

// Elementi del Footer
let playerImgContainer = document.getElementById("player-img-container");
let playerImg = document.getElementById("player-img");
let playerTitle = document.getElementById("player-title");
let playerArtist = document.getElementById("player-artist");
let playerButton = document.getElementById("play");
const playerVolume = document.getElementById("volume-mute");

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
    playerTitle.innerText = currentSongArray[0].title;
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
const playSong = function () {
  console.log(currentSongArray[0].preview);
  currentSong = new Audio(currentSongArray[0].preview);
  // songInPlayArray  sarebbe l'intera canzone che abbiamo passato come parametro
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
footerSong();
