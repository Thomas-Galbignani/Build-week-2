// Endpoint api
const endpoint = `https://striveschool-api.herokuapp.com/api/deezer/search?q=`;

let currentSong = new Audio(); // Canzone corrente

let currentSongArray = []; // Array della canzone corrente
// serch form
const searchInput = document.getElementById(`searchInput`);
let attribute = ``;

// Array da popolare con canzoni del carosello
const songs = [];

// Elementi del carosello
const carouselContainer = document.getElementById("carousel");
const btnBack = document.getElementById("btn-back");
const btnNext = document.getElementById("btn-next");
let currentCarouselIndex = 0; // Indice per tenere traccia della canzone attualmente visualizzata nel carosello

// Canzoni del carosello
let songName1 = `under a glass moon`;
let songName2 = `the passage of the time`;
let songName3 = `nightmare`;

let songNames = [
  `nightmare`,
  `the passage of the time`,
  `under a glass moon`,
  `numb`,
  `money`,
  `pneuma`,
  `he reigns `,
  `duality`,
];

let songCard = [];

const cardContainer = document.getElementById("card-container");

// Elementi del Footer
let playerImgContainer = document.getElementById("player-img-container");
let playerImg = document.getElementById("player-img");
let playerTitle = document.getElementById("player-title");
let playerArtist = document.getElementById("player-artist");
let playerButton = document.getElementById("play");
const playerVolume = document.getElementById("volume-mute");
const progressBar = document.getElementById(`progressBar`);

const songsOnCard = function () {
  songNames.forEach((song) => {
    fetch(endpoint + song)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
      })
      .then((song) => {
        console.log(song);
        songCard.push(song);
        const cardItem = document.createElement("div");
        cardItem.classList.add("col");
        cardItem.innerHTML = `
        <a href="./album.html?eventId=${song.data[0].album.id}" class="text-decoration-none">
              <div class="card bg-black p-3 rounded-4 text-white h-100">
                <img
                  class="rounded-2"
                  src="${song.data[0].album.cover}"
                  alt="..."
                />
                <h6 class="card-title mb-1 my-2 pt-2">${song.data[0].album.title}</h6>
                <p class="text-secondary mt-2 mb-0">${song.data[0].artist.name}</p>
              </div></a>
  `;
        cardContainer.appendChild(cardItem);
      })
      .catch((err) => {
        console.log(err, "tutto rotto");
      });
  });
};

// Funzione per recuperare le canzoni da inserire nel carosello
const songsOnCarousel = function () {
  fetch(endpoint + songName1) // Recuperiamo la prima canzone
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Errore nel recupero della prima canzone!");
      }
    })
    .then((song) => {
      songs.push(song.data[0]); // Aggiungiamo la prima canzone all'array songs
      return fetch(endpoint + songName2); // Recuperiamo la seconda canzone
    })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Errore nel recupero della seconda canzone!");
      }
    })
    .then((song2) => {
      songs.push(song2.data[0]); // Aggiungiamo la seconda canzone all'array songs
      return fetch(endpoint + songName3); // Recuperiamo la terza canzone
    })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Errore nel recupero della terza canzone!");
      }
    })
    .then((song3) => {
      songs.push(song3.data[0]); // Aggiungiamo la terza canzone all'array songs
      createCarousel(); // Lanciamo la funzione per avviare il carosello
    })
    .catch((err) => {
      console.log(err, "tutto rotto");
    });
};

// Funzione per il form di ricerca
const searchSong = function (e) {
  e.preventDefault();
  const formInput = searchInput.value;
  if (searchInput) {
    attribute = formInput;
  }
};

// Funzione per creare il carosello
const createCarousel = function () {
  carouselContainer.innerHTML = ""; // Pulisce il div prima di aggiungere i nuovi elementi
  localStorage.clear();
  songs.forEach((song, index) => {
    const carouselItem = document.createElement("div"); // Crea un nuovo div
    carouselItem.id = `carousel-item-${index}`; // Assegna un ID unico a ogni elemento del carosello
    carouselItem.classList.add(
      "carousel-song-card",
      "d-flex",
      "align-items-center",
      "w-100"
    ); // Aggiunge le classi necessarie per allineare

    // Nascondi tutti gli elementi tranne il primo all'inizio
    if (index !== 0) {
      carouselItem.classList.add("d-none");
    }

    // Creiamo il carosello
    carouselItem.innerHTML = `
      <img src="${song.album.cover_medium}" class="album-cover me-4" alt="Album cover" />
            <div>
                <a href='./album.html?eventId=${song.album.id}' class='text-decoration-none'> <p class="text-white">${song.album.title}</p></a>
                  <h1 class="text-white">${song.title}</h1>
                  <a href='./artists.html?eventId=${song.artist.id}' class='text-decoration-none'> <p class="text-white">${song.artist.name}</p></a>
                  <p class="text-white">Ascolta il nuovo singolo di ${song.artist.name}!</p>
                  <div class="d-flex">
                    <div class="d-flex">
                      <button class="btn btn-success me-2 rounded-5 py-2 px-4 play-btn" data-song-index="${index}">Play</button>
                      <button class="btn btn-outline-light me-2 rounded-5 py-2 px-4">Salva</button>
                      <div>
                      <a class="d-block text-decoration-none ms-3" data-bs-toggle="collapse"  role="button"
                        aria-expanded="false" aria-controls="submenu1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor"
                          class="bi bi-three-dots text-white my-2" viewBox="0 0 16 16">
                          <path
                            d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3" />
                        </svg>
                      </a>
                    </div>
                </div>
          </div>
  `;

    carouselContainer.appendChild(carouselItem); // Aggiunge l'elemento al div principale

    // Collega l'event listener al pulsante Play
    const playButton = carouselItem.querySelector(".play-btn"); // Recuperiamo il pulsante con la classe play-btn
    playButton.addEventListener("click", () => {
      // Passa l'intero oggetto della canzone alla funzione playSong per la riproduzione
      playSong(song);
    });
  });

  // Aggiunge le funzioni backSong e nextSong ai pulsanti in alto
  btnBack.addEventListener("click", backSong);
  btnNext.addEventListener("click", nextSong);
};

// Funzione per scorrere il carosello in avanti
const nextSong = function () {
  // Nasconde la canzone corrente
  document
    .getElementById(`carousel-item-${currentCarouselIndex}`)
    .classList.add("d-none");
  // Incrementa l'index, se si supera l'ultima canzone torna a 0
  currentCarouselIndex = (currentCarouselIndex + 1) % songs.length;
  // Mostra la prossima canzone
  document
    .getElementById(`carousel-item-${currentCarouselIndex}`)
    .classList.remove("d-none");
};

// Funzione per scorrere il carosello indietro
const backSong = function () {
  // Nasconde la canzone corrente
  document
    .getElementById(`carousel-item-${currentCarouselIndex}`)
    .classList.add("d-none");
  // Diminuisce l'indice, tornando all'ultima canzone se si va sotto 0
  currentCarouselIndex =
    (currentCarouselIndex - 1 + songs.length) % songs.length; // + songs.length per gestire i numeri negativi
  // Mostra la canzone precedente
  document
    .getElementById(`carousel-item-${currentCarouselIndex}`)
    .classList.remove("d-none");
};

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
  // songToPlay sarebbe l'intera canzone che abbiamo passato come parametro
  currentSong.currentTime = 0; // Portiamo il tempo della canzone a 0
  currentSong.pause(); // Mettiamo in pausa la canzone corrente
  currentSongArray = [songToPlay]; // Aggiorna currentSongArray con la canzone selezionata
  currentSong = new Audio(songToPlay.preview); // Aggiunge e currentSong il link della canzone
  currentSong.addEventListener("timeupdate", updateProgressBar);
  currentSong
    .play() // Avvia la canzone
    .then(() => {
      console.log(`sono io `, songToPlay);
      footerSong(); // Lanciamo la funzione footerSong

      console.log(`stai ascoltando la canzone: ${songToPlay.title}`);
      localStorage.setItem(`currentSong`, JSON.stringify(songToPlay));
    })
    .catch((error) => {
      console.error(`Non funziona: Errore durante la riproduzione.`, error);
    });
};
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

const volumeSlider = document.getElementById("volume");
if (volumeSlider) {
  volumeSlider.addEventListener("input", function () {
    if (currentSong) {
      currentSong.volume = parseFloat(this.value);
      muteUnmute();
    }
  });
}

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

songsOnCarousel();
footerSong();
songsOnCard();

// funzione per auto-scorrimento del carosello ogni 5 secondi
document.addEventListener("DOMContentLoaded", (event) => {
  setInterval(nextSong, 5000);
});
