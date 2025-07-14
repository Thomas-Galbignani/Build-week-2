const endpoin = `https://striveschool-api.herokuapp.com/api/deezer/search?q=`;
// array da popolare con canzoni
const songs = [];
// funzioni  per popolare il carosello della home con 3 canzoni

let songName = `under a glass moon`;
const songsOnCarousel = function () {
  fetch(endpoin + songName)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(`errorre`);
      }
    })
    .then((song) => {
      songs.push(song.data[0]);

      songName = `the passage of the time`;
      return fetch(endpoin + songName); // per richiamare una fetch
    })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(`errorre`);
      }
    })
    .then((song2) => {
      songs.push(song2.data[0]);

      songName = `nightmare`;
      return fetch(endpoin + songName);
    })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(`errorre`);
      }
    })
    .then((song3) => {
      songs.push(song3.data[0]);
      console.log(`array con canzoni del carosello`, songs);
    })

    .catch((err) => {
      console.log(err, `tutto rotto`);
    });
};
songsOnCarousel();
