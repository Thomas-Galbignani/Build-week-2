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

// Elementi del Footer
let playerImgContainer = document.getElementById('player-img-container')
let playerImg = document.getElementById('player-img')
let playerTitle = document.getElementById('player-title')
let playerArtist = document.getElementById('player-artist')
let playerButton = document.getElementById('play')

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
  carouselContainer.innerHTML = ''; // Pulisce il div prima di aggiungere i nuovi elementi
  songs.forEach((song, index) => {
    const carouselItem = document.createElement('div'); // Crea un nuovo div
    carouselItem.id = `carousel-item-${index}`; // Assegna un ID unico a ogni elemento del carosello
    carouselItem.classList.add('carousel-song-card', 'd-flex', 'align-items-center', 'w-100'); // Aggiunge le classi necessarie per allineare

    // Nascondi tutti gli elementi tranne il primo all'inizio
    if (index !== 0) {
      carouselItem.classList.add('d-none');
    }

    // Creiamo il carosello
    carouselItem.innerHTML = `
      <img src="${song.album.cover_medium}" class="album-cover me-4" alt="Album cover" />
            <div>
                <p class="text-white">${song.album.title}</p>
                  <h1 class="text-white">${song.title}</h1>
                  <p class="text-white">${song.artist.name}</p>
                  <p class="text-white">Ascolta il nuovo singolo di ${song.artist.name}!</p>
                  <div class="d-flex">
                    <div class="d-flex">
                      <button class="btn btn-success me-2 rounded-5 py-2 px-4 play-btn" data-song-index="${index}">Play</button>
                      <button class="btn btn-outline-light me-2 rounded-5 py-2 px-4">Salva</button>
                    </div>
                    <button class="btn text-white">.</button>
                    <button class="btn text-white">.</button>
                    <button class="btn text-white">.</button>
                  </div>
                </div>
          </div>
  `;

    carouselContainer.appendChild(carouselItem); // Aggiunge l'elemento al div principale

    // Collega l'event listener al pulsante Play
    const playButton = carouselItem.querySelector('.play-btn'); // Recuperiamo il pulsante con la classe play-btn
    playButton.addEventListener('click', () => {
      // Passa l'intero oggetto della canzone alla funzione playSong per la riproduzione
      playSong(song);
    });
  });

  // Aggiunge le funzioni backSong e nextSong ai pulsanti in alto
  btnBack.addEventListener('click', backSong);
  btnNext.addEventListener('click', nextSong);
};

// Funzione per scorrere il carosello in avanti
const nextSong = function () {
  // Nasconde la canzone corrente
  document.getElementById(`carousel-item-${currentCarouselIndex}`).classList.add('d-none');
  // Incrementa l'index, se si supera l'ultima canzone torna a 0
  currentCarouselIndex = (currentCarouselIndex + 1) % songs.length;
  // Mostra la prossima canzone
  document.getElementById(`carousel-item-${currentCarouselIndex}`).classList.remove('d-none');
};

// Funzione per scorrere il carosello indietro
const backSong = function () {
  // Nasconde la canzone corrente
  document.getElementById(`carousel-item-${currentCarouselIndex}`).classList.add('d-none');
  // Diminuisce l'indice, tornando all'ultima canzone se si va sotto 0
  currentCarouselIndex = (currentCarouselIndex - 1 + songs.length) % songs.length; // + songs.length per gestire i numeri negativi
  // Mostra la canzone precedente
  document.getElementById(`carousel-item-${currentCarouselIndex}`).classList.remove('d-none');
};

// Funzione per il la barra di riproduzione del footer
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

// Funzione per il pulsante play del footer
playerButton.addEventListener('click', () => {
  if (!currentSong.paused) { // Se la canzone non è in pausa
    currentSong.pause(); // Mette in pausa la canzone
    playerButton.innerHTML = `
    <i class="bi bi-play-circle-fill text-light h3"></i>
    `
  } else if (currentSong.paused) { // Se la canzone è in pausa
    currentSong.play(); // Avvia la canzone
    playerButton.innerHTML = `
    <i class="bi bi-pause-circle-fill text-light h3"></i>
    `
  }
})

// Funzione per far partire la musica
const playSong = function (songToPlay) { // songToPlay sarebbe l'intera canzone che abbiamo passato come parametro
  currentSong.currentTime = 0; // Portiamo il tempo della canzone a 0
  currentSong.pause(); // Mettiamo in pausa la canzone corrente
  currentSongArray = [songToPlay]; // Aggiorna currentSongArray con la canzone selezionata
  currentSong = new Audio(songToPlay.preview); // Aggiunge e currentSong il link della canzone
  currentSong.play() // Avvia la canzone
    .then(() => {
      footerSong(); // Lanciamo la funzione footerSong
      console.log(`stai ascoltando la canzone: ${songToPlay.title}`);
    })
    .catch((error) => {
      console.error(`Non funziona: Errore durante la riproduzione.`, error);
    });
};

songsOnCarousel();
footerSong();

// funzione per auto-scorrimento del carosello ogni 5 secondi
document.addEventListener("DOMContentLoaded", (event) => {
  setInterval(nextSong, 5000);
});

