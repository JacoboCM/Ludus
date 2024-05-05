// Replace 'YOUR_API_KEY' with your actual TMDb API key
const apiKey = "YOUR_API_KEY";
const apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&sort_by=popularity.desc`;

async function fetchMovies() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    const movies = data.results;

    const carouselContent = document.getElementById("carouselContent");

    // Populate carousel items with movie images
    movies?.forEach((movie) => {
      const item = document.createElement("div");
      item.classList.add("item");
      item.innerHTML = `<img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="${movie.title}" onclick="goToDetailPage(${movie.id})">`;
      carouselContent.appendChild(item);
    });
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
}

function goToDetailPage(movieId) {
  window.location.href = `/pages/detailPage?id=${movieId}`; // Redirect to detail page with movie ID
}

// Call the fetchMovies function to fetch and populate movies
fetchMovies();

// document.addEventListener("DOMContentLoaded", function () {
//   const arrowButtons = document.querySelectorAll(".arrow__btn");
//   console.log("THIS", arrowButtons);
//   arrowButtons.forEach((button) => {
//     button.addEventListener("click", function (event) {
//       event.preventDefault();
//     });
//   });
// });
