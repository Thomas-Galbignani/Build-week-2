const endpoin = `https://striveschool-api.herokuapp.com/api/deezer/search?q=`;
// Endpoint api
const endpoint = `https://striveschool-api.herokuapp.com/api/deezer/search?q=`;
// array da popolare con canzoni
const songs = [];
// funzioni  per popolare il carosello della home con 3 canzoni
const carouselContainer = document.getElementById('carousel')
const btnBack = document.getElementById('btn-back')
const btnNext = document.getElementById('btn-next')

// Canzoni del carosello
let songName1 = `under a glass moon`;
let songName2 = `the passage of the time`;
let songName3 = `nightmare`;

let songName = `under a glass moon`;
// funzioni  per popolare il carosello della home con 3 canzoni
const songsOnCarousel = function () {
  fetch(endpoin + songName1)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(errorre);
      }
    })
    .then((song) => {
      songs.push(song.data[0]);
      return fetch(endpoin + songName2); // per richiamare una fetch
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
      return fetch(endpoin + songName3);
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
      console.log('array con canzoni del carosello', songs);
    })

    .catch((err) => {
      console.log(err, 'tutto rotto');
    });
};

const createCarousel = function () {
  console.log(songs)
  carouselContainer.innerHTML = `
    <div class="my-5">
         <button class="btn btn-success me-2" onclick="backSong()" id="btn-back">Indietro</button>
         <button class="btn btn-outline-light" onclick="nextSong()" id="btn-next">Avanti</button>
         </div>
    <div class="d-flex align-items-center mb-4 bg-dark px-3 py-5 w-100" id="${songs[0].id}">
      <img src="${songs[0].album.cover_medium}" class="album-cover me-4"
                  alt="Album cover" />
                <div>
                <p class="text-white">${songs[0].album.title}</p>
                  <h1 class="text-white">${songs[0].title}</h1>
                  <p class="text-white">${songs[0].artist.name}</p>
                  <p class="text-white">Ascolta il nuovo singolo di ${songs[0].artist.name}</p>
                  <button class="btn btn-success me-2"></button>
                  <button class="btn btn-outline-light"></button>
                  <button class="btn btn-success me-2"></button>
                </div>
          </div>
              <div class="d-flex align-items-center mb-4 bg-dark px-3 py-5 d-none" id="${songs[1].id}">
      <img src="${songs[1].album.cover_medium}" class="album-cover me-4"
                  alt="Album cover" />
                <div>
                <p class="text-white">${songs[1].album.title}</p>
                  <h1 class="text-white">${songs[1].title}</h1>
                  <p class="text-white">${songs[1].artist.name}</p>
                  <p class="text-white">Ascolta il nuovo singolo di ${songs[1].artist.name}</p>
                  <button class="btn btn-success me-2"></button>
                  <button class="btn btn-outline-light"></button>
                  <button class="btn btn-success me-2"></button>
                </div>
          </div>
        <div class="d-flex align-items-center mb-4 bg-dark px-3 py-5 d-none" id="${songs[2].id}">
            <img src="${songs[2].album.cover_medium}" class="album-cover me-4"
                        alt="Album cover" />
                      <div>
                      <p class="text-white">${songs[2].album.title}</p>
                        <h1 class="text-white">${songs[2].title}</h1>
                        <p class="text-white">${songs[2].artist.name}</p>
                        <p class="text-white">Ascolta il nuovo singolo di ${songs[2].artist.name}</p>
                        <button class="btn btn-success me-2"></button>
                        <button class="btn btn-outline-light"></button>
                        <button class="btn btn-success me-2"></button>
                      </div>
          </div>
  `
}

const nextSong = function (id) {

  id = songs[0].id

  const carousel1 = document.getElementById(songs[0].id)
  const carousel2 = document.getElementById(songs[1].id)
  const carousel3 = document.getElementById(songs[2].id)

  if (carousel1.classList.contains('d-none') && carousel3.classList.contains('d-none')) {
    id = songs[1].id
  } else if (carousel2.classList.contains('d-none') && carousel1.classList.contains('d-none')) {
    id = songs[2].id
  }

  if (id === songs[0].id) {
    carousel1.classList.add('d-none')
    carousel2.classList.remove('d-none')
    carousel3.classList.add('d-none')

  } else if (id === songs[1].id) {
    carousel1.classList.add('d-none')
    carousel2.classList.add('d-none')
    carousel3.classList.remove('d-none')
  } else {
    carousel1.classList.remove('d-none')
    carousel2.classList.add('d-none')
    carousel3.classList.add('d-none')
  }

}

const backSong = function (id) {
  console.log('prova')

  id = songs[0].id

  const carousel1 = document.getElementById(songs[0].id)
  const carousel2 = document.getElementById(songs[1].id)
  const carousel3 = document.getElementById(songs[2].id)

  if (carousel1.classList.contains('d-none') && carousel3.classList.contains('d-none')) {
    id = songs[1].id
  } else if (carousel2.classList.contains('d-none') && carousel1.classList.contains('d-none')) {
    id = songs[2].id
  }

  if (id === songs[0].id) {
    carousel1.classList.add('d-none')
    carousel2.classList.add('d-none')
    carousel3.classList.remove('d-none')

  } else if (id === songs[2].id) {
    carousel1.classList.add('d-none')
    carousel2.classList.remove('d-none')
    carousel3.classList.add('d-none')
  } else {
    carousel1.classList.remove('d-none')
    carousel2.classList.add('d-none')
    carousel3.classList.add('d-none')
  }

}



songsOnCarousel();
