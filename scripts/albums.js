// Endpoint api
const endpoint = `https://striveschool-api.herokuapp.com/api/deezer/album`;
const parameters = new URLSearchParams(location.search);
const eventId = parameters.get("eventId");
const albumInfoDiv = document.getElementById("album-info");
const trackList = document.getElementById('tracklist-container');

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
        console.log('album', album);
        // Popoliamo la sezione in alto
        albumInfoDiv.innerHTML = `
            <img id="album-cover" src="${album.cover_medium}" class="me-3 rounded" style="width: 250px; padding-left: 20px" crossorigin="anonymous" />
            <div>
                <div class="text-white">ALBUM</div>
                <h2 class="text-white">${album.title}</h2>
                <div class="text-white">${album.artist.name} • ${album.release_date || "?"}</div>
            </div>
            `
            ;
            // Popoliamo la lista delle canzoni dell'album
        album.tracks.data.forEach((track, index) => {
            const trackItem = document.createElement("div");
            trackItem.innerHTML = `
                <div class="d-flex py-2 px-4 text-white track-row" style="cursor: pointer;" onclick="">
                    <div style="width: 50%;">${index + 1}. ${track.title}<br><p>${track.artist.name}</p></div>
                    <div style="width: 30%; text-align: center;">${track.rank.toLocaleString()}</div>
                    <div style="width: 20%; text-align: right;">${formatDuration(track.duration)}</div>
                </div>
            `;
            trackList.appendChild(trackItem);
        });

    })
    .catch(() => {
        console.log(`tuttto sbagliato`);
    });

// Funzione per formattare il tempo della canzone
function formatDuration(seconds) {
    if (isNaN(seconds)) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
}