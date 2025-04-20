import {
  fetchContent,
  populateSlider,
  createContentCard,
} from "../scripts/services/tmdbService.js";

// Initialize the page
async function initializeMoviesPage() {
  try {
    // Populate main slider with top rated movies
    const mainMovies = await fetchContent("movie", "top_rated");
    const mainSlider = document.getElementById("slider-principal");
    mainMovies.slice(0, 10).forEach((movie) => {
      const card = createContentCard(movie, "movie");
      mainSlider.appendChild(card);
    });

    // Populate top rated movies slider
    const topRatedMovies = await fetchContent("movie", "top_rated");
    const topRatedSlider = document.getElementById("slider-top10");
    topRatedMovies.slice(0, 10).forEach((movie) => {
      const card = createContentCard(movie, "movie");
      
      topRatedSlider.appendChild(card);
    });

    // Populate now playing movies slider
    const nowPlayingMovies = await fetchContent("movie", "now_playing");
    const nowPlayingSlider = document.getElementById("slider-nuevos");
    nowPlayingMovies.slice(0, 10).forEach((movie) => {
      const card = createContentCard(movie, "movie");
      nowPlayingSlider.appendChild(card);
    });

    // Populate upcoming movies slider
    const upcomingMovies = await fetchContent("movie", "upcoming");
    const upcomingSlider = document.getElementById("slider-proximos");
    upcomingMovies.slice(0, 10).forEach((movie) => {
      const card = createContentCard(movie, "movie");
      upcomingSlider.appendChild(card);
    });
  } catch (error) {
    console.error("Error initializing movies page:", error);
  }
}

// Initialize the page when the DOM is loaded
document.addEventListener("DOMContentLoaded", initializeMoviesPage);
