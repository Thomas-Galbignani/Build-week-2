// Endpoint api
const endpoint = `https://striveschool-api.herokuapp.com/api/deezer/search?q=`;
// canzone corrente
let currentSong = new Audio();

let currentSongArray = [];
// serch form
const searchInput = document.getElementById(`searchInput`);
let attribute = ``;

// array da popolare con canzoni
const songs = [];
// funzioni  per popolare il carosello della home con 3 canzoni
const carouselContainer = document.getElementById("carousel");
const btnBack = document.getElementById("btn-back");
const btnNext = document.getElementById("btn-next");

// Canzoni del carosello
let songName1 = `under a glass moon`;
let songName2 = `the passage of the time`;
let songName3 = `nightmare`;

//variabile dei btnPlay
let playBtn1 = ``;

let playerImgContainer = document.getElementById('player-img-container')
let playerImg = document.getElementById('player-img')
let playerTitle = document.getElementById('player-title')
let playerArtist = document.getElementById('player-artist')
let playerButton = document.getElementById('play')

// funzioni  per popolare il carosello della home con 3 canzoni
const songsOnCarousel = function () {
  fetch(endpoint + songName1)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(errorre);
      }
    })
    .then((song) => {
      songs.push(song.data[0]);
      return fetch(endpoint + songName2); // per richiamare una fetch
    })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(errorre);
      }
    })
    .then((song2) => {
      songs.push(song2.data[0]);
      return fetch(endpoint + songName3);
    })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(errorre);
      }
    })
    .then((song3) => {
      songs.push(song3.data[0]);
      createCarousel();
      console.log("array con canzoni del carosello", songs);
    })

    .catch((err) => {
      console.log(err, "tutto rotto");
    });
};

const searchSong = function (e) {
  e.preventDefault();
  const formInput = searchInput.value;
  if (searchInput) {
    attribute = formInput;
  }
};

const createCarousel = function () {
  console.log(songs);
  carouselContainer.innerHTML = `
    <div class="mt-5 mb-4 d-flex">
         <button class="btn btn-success me-2 rounded-circle d-flex justify-content-center align-items-center p-1" onclick="backSong()" id="btn-back">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-chevron-left" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"/>
          </svg>
         </button>
         <button class="btn btn-outline-light rounded-circle d-flex justify-content-center align-items-center p-1" onclick="nextSong()" id="btn-next">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-chevron-right" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/>
            </svg>
         </button>
         </div>
    <div class="d-flex align-items-center mb-4 bg-dark px-3 py-5 w-100" id="${songs[0].id}">
      <img src="${songs[0].album.cover_medium}" class="album-cover me-4"
                  alt="Album cover" />
                <div>
                <p class="text-white">${songs[0].album.title}</p>
                  <h1 class="text-white">${songs[0].title}</h1>
                  <p class="text-white">${songs[0].artist.name}</p>
                  <p class="text-white">Ascolta il nuovo singolo di ${songs[0].artist.name}!</p>
                  <div class="d-flex">
                    <div class="d-flex">
                      <button class="btn btn-success me-2 rounded-5 py-2 px-4" id='play-${songs[0].id}'>Play</button>
                      <button class="btn btn-outline-light me-2 rounded-5 py-2 px-4">Salva</button>
                    </div>
                    <button class="btn text-white">.</button>
                    <button class="btn text-white">.</button>
                    <button class="btn text-white">.</button>
                  </div>
                </div>
          </div>
              <div class="d-flex align-items-center mb-4 bg-dark px-3 py-5 w-100 d-none" id="${songs[1].id}">
      <img src="${songs[1].album.cover_medium}" class="album-cover me-4"
                  alt="Album cover" />
                <div>
                <p class="text-white">${songs[1].album.title}</p>
                  <h1 class="text-white">${songs[1].title}</h1>
                  <p class="text-white">${songs[1].artist.name}</p>
                  <p class="text-white">Ascolta il nuovo singolo di ${songs[1].artist.name}!</p>
                   <div class="d-flex">
                    <div class="d-flex">
                      <button class="btn btn-success me-2 rounded-5 py-2 px-4" id='play-${songs[1].id}' >Play</button>
                      <button class="btn btn-outline-light me-2 rounded-5 py-2 px-4">Salva</button>
                    </div>
                    <button class="btn text-white">.</button>
                    <button class="btn text-white">.</button>
                    <button class="btn text-white">.</button>
                  </div>
                </div>
          </div>
        <div class="d-flex align-items-center mb-4 bg-dark px-3 py-5 w-100 d-none" id="${songs[2].id}">
            <img src="${songs[2].album.cover_medium}" class="album-cover me-4"
                        alt="Album cover" />
                      <div>
                      <p class="text-white">${songs[2].album.title}</p>
                        <h1 class="text-white">${songs[2].title}</h1>
                        <p class="text-white">${songs[2].artist.name}</p>
                        <p class="text-white">Ascolta il nuovo singolo di ${songs[2].artist.name}!</p>
                         <div class="d-flex">
                          <div class="d-flex">
                            <button class="btn btn-success me-2 rounded-5 py-2 px-4" id='play-${songs[2].id}' >Play</button>
                            <button class="btn btn-outline-light me-2 rounded-5 py-2 px-4">Salva</button>
                          </div>
                          <button class="btn text-white">.</button>
                          <button class="btn text-white">.</button>
                          <button class="btn text-white">.</button>
                        </div>
                      </div>
          </div>
  `;
  playBtn1 = document.getElementById(`play-` + songs[0].id);
  console.log(playBtn1); // solo per vedere se funziona
  const fileAudio1 = songs[0].preview;

  const fileAudio2 = songs[1].preview;

  const fileAudio3 = songs[2].preview;

  playBtn1.addEventListener(`click`, () => {
    currentSong.currentTime = 0;
    currentSong.pause();
    currentSongArray = []
    console.log(songs[0])
    currentSongArray.push(songs[0])
    currentSong = new Audio(fileAudio1);
    currentSong.play()
      .then(() => {
        footerSong();
        console.log(`stai ascoltando la canzone`);
      })
      .catch(() => {
        console.log(`Non funziona`);
      });
  });
  playBtn2 = document.getElementById(`play-` + songs[1].id);
  console.log(playBtn2); // solo per vedere se funziona

  playBtn2.addEventListener(`click`, () => {
    currentSong.currentTime = 0;
    currentSong.pause();
    currentSongArray = []
    currentSongArray.push(songs[1])
    currentSong = new Audio(fileAudio2);
    currentSong.play()
      .then(() => {
        footerSong();
        console.log(`stai ascoltando la canzone`);
      })
      .catch(() => {
        console.log(`Non funziona`);
      });
  });
  playBtn3 = document.getElementById(`play-` + songs[2].id);
  console.log(playBtn3); // solo per vedere se funziona

  playBtn3.addEventListener(`click`, () => {
    currentSong.currentTime = 0;
    currentSong.pause();
    currentSongArray = []
    currentSongArray.push(songs[2])
    currentSong = new Audio(fileAudio3);
    currentSong.play()
      .then(() => {
        footerSong();
        console.log(`stai ascoltando la canzone`);
      })
      .catch(() => {
        console.log(`Non funziona`);
      });
  });
};

const nextSong = function (id) {
  id = songs[0].id;

  const carousel1 = document.getElementById(songs[0].id);
  const carousel2 = document.getElementById(songs[1].id);
  const carousel3 = document.getElementById(songs[2].id);

  if (
    carousel1.classList.contains("d-none") &&
    carousel3.classList.contains("d-none")
  ) {
    id = songs[1].id;
  } else if (
    carousel2.classList.contains("d-none") &&
    carousel1.classList.contains("d-none")
  ) {
    id = songs[2].id;
  }

  if (id === songs[0].id) {
    carousel1.classList.add("d-none");
    carousel2.classList.remove("d-none");
    carousel3.classList.add("d-none");
  } else if (id === songs[1].id) {
    carousel1.classList.add("d-none");
    carousel2.classList.add("d-none");
    carousel3.classList.remove("d-none");
  } else {
    carousel1.classList.remove("d-none");
    carousel2.classList.add("d-none");
    carousel3.classList.add("d-none");
  }
};

const backSong = function (id) {
  id = songs[0].id;

  const carousel1 = document.getElementById(songs[0].id);
  const carousel2 = document.getElementById(songs[1].id);
  const carousel3 = document.getElementById(songs[2].id);

  if (
    carousel1.classList.contains("d-none") &&
    carousel3.classList.contains("d-none")
  ) {
    id = songs[1].id;
  } else if (
    carousel2.classList.contains("d-none") &&
    carousel1.classList.contains("d-none")
  ) {
    id = songs[2].id;
  }

  if (id === songs[0].id) {
    carousel1.classList.add("d-none");
    carousel2.classList.add("d-none");
    carousel3.classList.remove("d-none");
  } else if (id === songs[2].id) {
    carousel1.classList.add("d-none");
    carousel2.classList.remove("d-none");
    carousel3.classList.add("d-none");
  } else {
    carousel1.classList.remove("d-none");
    carousel2.classList.add("d-none");
    carousel3.classList.add("d-none");
  }
};

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

songsOnCarousel();
footerSong();

// funzione per auto-scroll del carousel richiamando la funzione
document.addEventListener("DOMContentLoaded", (event) => {
  setInterval(nextSong, 5000);
});

