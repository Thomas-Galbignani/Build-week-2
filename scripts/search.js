// Endpoint api
const endpoint = `https://striveschool-api.herokuapp.com/api/deezer/search?q=`;
const parameters = new URLSearchParams(location.search);
const pageTitle = document.getElementById("page-title");
const eventId = parameters.get("eventId");
const resultList = document.getElementById('result-list');
const firstResult = document.getElementById('first-result');

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
        // Primo risultato
        firstResult.innerHTML = `
                            <img class="rounded-3 h-50"
                                src="${result.data[0].album.cover}"
                                alt="img-${result.data[0].title}">
                            <p class="mt-2">${result.data[0].title}</p>
                            <div class="d-flex">
                                <p>Brano</p>
                                <p>${result.data[0].artist.name}</p>
                            </div>
                          `;
        result.data.forEach((res, index) => {
            const resultDiv = document.createElement("div");
            resultDiv.classList.add("d-flex", "text-light", "mt-2");
            resultDiv.style.height = '65px';
            resultDiv.id = `${index}`
            resultDiv.innerHTML = `
                            <img class="rounded-3"
            src="${res.album.cover}"
            alt="img-${res.title}">
        <div class="mx-3 flex-grow-1"> <p>${res.title}</p>
            <p>${res.artist.name}</p>
        </div>
        <p class="ms-auto">${formatDuration(res.duration)}</p>
            `;
            resultList.appendChild(resultDiv)
        })


    })
    .catch((err) => {
        console.log(err, "tutto rotto");
    });


// Funzione per formattare il tempo della canzone
function formatDuration(seconds) {
    if (isNaN(seconds)) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
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
            localStorage.setItem(`currentSong`, JSON.stringify(songToPlay));
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

footerSong();