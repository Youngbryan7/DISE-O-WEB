const API_KEY = "TU_API_KEY_AQUI";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const genreFilter = document.getElementById("genreFilter");
const movieGrid = document.getElementById("movie-grid");
const movieModal = document.getElementById("movieModal");
const closeModal = document.getElementById("closeModal");
const modalTitle = document.getElementById("modalTitle");
const modalImage = document.getElementById("modalImage");
const modalDescription = document.getElementById("modalDescription");
const modalGenre = document.getElementById("modalGenre");

let allMovies = [];
let genres = {};

async function fetchGenres() {
  const response = await fetch(
    ${BASE_URL}/genre/movie/list?api_key=${API_KEY}
  );
  const data = await response.json();
  genres = Object.fromEntries(
    data.genres.map((genre) => [genre.id, genre.name])
  );

  data.genres.forEach((genre) => {
    const option = document.createElement("option");
    option.value = genre.id;
    option.textContent = genre.name;
    genreFilter.appendChild(option);
  });
}

async function fetchMovies() {
  const response = await fetch(${BASE_URL}/movie/popular?api_key=${API_KEY});
  const data = await response.json();
  allMovies = data.results;
  displayMovies(allMovies);
}

function displayMovies(movies) {
  movieGrid.innerHTML = "";
  movies.forEach((movie) => {
    const movieCard = document.createElement("div");
    movieCard.classList.add("movie-card");
    movieCard.innerHTML = `
            <img src="${IMAGE_BASE_URL}${movie.poster_path}" alt="${
      movie.title
    }">
            <h3>${movie.title}</h3>
            <p>${movie.overview.slice(0, 100)}...</p>
            <button class="favorite-btn">Favorite</button>
        `;
    movieCard.querySelector(".favorite-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      toggleFavorite(e.target);
    });
    movieCard.addEventListener("click", () => openModal(movie));
    movieGrid.appendChild(movieCard);
  });
}

function toggleFavorite(button) {
  button.classList.toggle("favorited");
  if (button.classList.contains("favorited")) {
    button.textContent = "Favorited";
    button.style.backgroundColor = "#dc3545";
  } else {
    button.textContent = "Favorite";
    button.style.backgroundColor = "#007bff";
  }
}

function openModal(movie) {
  modalTitle.textContent = movie.title;
  modalImage.src = ${IMAGE_BASE_URL}${movie.poster_path};
  modalImage.alt = movie.title;
  modalDescription.textContent = movie.overview;
  modalGenre.textContent = `Genres: ${movie.genre_ids
    .map((id) => genres[id])
    .join(", ")}`;
  movieModal.style.display = "block";
}

closeModal.onclick = function () {
  movieModal.style.display = "none";
};

window.onclick = function (event) {
  if (event.target == movieModal) {
    movieModal.style.display = "none";
  }
};

genreFilter.addEventListener("change", (e) => {
  const selectedGenre = e.target.value;
  if (selectedGenre === "all") {
    displayMovies(allMovies);
  } else {
    const filteredMovies = allMovies.filter((movie) =>
      movie.genre_ids.includes(Number(selectedGenre))
    );
    displayMovies(filteredMovies);
  }
});

async function init() {
  await fetchGenres();
  await fetchMovies();
}

init();