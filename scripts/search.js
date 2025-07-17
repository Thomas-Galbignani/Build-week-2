// Endpoint api
const endpoint = `https://striveschool-api.herokuapp.com/api/deezer/search?q=`;
const parameters = new URLSearchParams(location.search);
const pageTitle = document.getElementById("page-title");
const eventId = parameters.get("eventId");
const resultList = document.getElementById("result-list");
const firstResult = document.getElementById("first-result");
const artistContainer = document.getElementById('artist-container');
let btnPlayerFirstSong = "";
let currentSong = new Audio(); // Canzone corrente
let currentSongArray = []; // Array della canzone corrente

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

// Funzione per formattare il tempo della canzone
function formatDuration(seconds) {
    if (isNaN(seconds)) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
}

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
            console.log(`sono io `, currentSongArray[0]);
            console.log(`stai ascoltando la canzone: ${currentSongArray[0].title}`);
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



// Funzione per recuperare i risultati di ricerca
fetch(endpoint + eventId)
    .then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error("Errore nel recupero della prima canzone!");
        }
    })
    .then((result) => {
        console.log(result);
        result.data.sort((a, b) => b.rank - a.rank);
        // Primo risultato
        firstResult.innerHTML = `
                           <div class="flex-grow-1">
                            <img class="img-fluid rounded-3 mb-3"
                                src="${result.data[0].album.cover}"
                                alt="img-${result.data[0].title}"
                                style="max-width: 150px; height: auto;">

                        <a class="text-decoration-none text-light" href="./artists.html?eventId=${result.data[0].artist.id}"><p class="mt-2 mb-1 fw-bold fs-5">${result.data[0].artist.name}</p></a>

                            <div class="d-flex align-items-center justify-content-between flex-wrap row">
                                <div class="col-10">
                                 <a class="text-decoration-none text-secondary" href=""><p class="mb-0 text-secondary small">${result.data[0].title}</p></a>
                                   
                                   <a class="text-decoration-none text-secondary" href="./album.html?eventId=${result.data[0].album.id}"> <p class="mb-0 small">${result.data[0].album.title}</p></a>
                                </div>
                                <div class="m-0 col-2">
                                    <button class="btn bg-transparent m-0 p-0" id="btn-player-first-song">
                                    <i class="bi bi-play-circle-fill text-success h1 m-0"></i>
                                    </button>
                                </div>
                                </div>
                            </div>
                        
                          `;

        btnPlayerFirstSong = document.getElementById("btn-player-first-song");
        // Pulsante per far partire la prima canzone
        btnPlayerFirstSong.addEventListener("click", () => {
            playSong(result.data[0]);
        });

        result.data.forEach((res, index) => {
            const resultDiv = document.createElement("div");
            // Aggiungi align-items-center per centrare verticalmente
            resultDiv.classList.add(
                "d-flex",
                "text-light",
                "mt-2",
                "align-items-center"
            );
            resultDiv.style.height = "65px"; // Questa altezza fissa aiuta a vedere l'allineamento verticale
            resultDiv.id = `${index}`;
            resultDiv.style.cursor = "pointer";
            resultDiv.innerHTML = `
        <img class="rounded-3" style="height: 50px; width: 50px; object-fit: cover;"
            src="${res.album.cover}"
            alt="img-${res.title}" id="${res.id}">
        <div class="mx-3 flex-grow-1">
            <p class="mb-0 fw-bold">${res.title}</p>
            <p class="mb-0 text-secondary">${res.artist.name}</p>
        </div>
        <p class="ms-auto mb-0">${formatDuration(res.duration)}</p>
    `;
            resultDiv.addEventListener("click", () => {
                playSong(res); // Passa l'intero oggetto 'track'
            });
            resultList.appendChild(resultDiv);
        });

        // Sezione Artisti
        // Crea un Set per memorizzare gli ID unici degli artisti già visualizzati
        const uniqueArtistIds = new Set();

        result.data.forEach((res) => {
            if (res.artist.id && !uniqueArtistIds.has(res.artist.id)) {
                // Se l'ID non è presente nel Set, lo aggiunge
                uniqueArtistIds.add(res.artist.id);
                const resultArtistDiv = document.createElement("div");
                resultArtistDiv.classList.add("mx-3");
                resultArtistDiv.style.cursor = "pointer";
                resultArtistDiv.innerHTML = `
                                <img class="rounded-circle"
                                    src="${res.artist.picture}"
                                    alt="artist">
                                <p class="text-white fw-bold mb-0 mt-2">${res.artist.name}</p>
                                <p class="text-secondary small">Artista</p>
    `;
                // Click del div per mandare nella pagina dell'artista
                resultArtistDiv.addEventListener("click", () => {
                    window.location.href = `./artists.html?eventId=${res.artist.id}`
                });
                artistContainer.appendChild(resultArtistDiv);
            }

        })

    })
    .catch((err) => {
        console.log(err, "tutto rotto");
    });



popUpFooter();
