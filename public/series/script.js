import {
  fetchContent,
  populateSlider,
  createContentCard,
} from "../scripts/services/tmdbService.js";

// Initialize the page
async function initializeSeriesPage() {
  try {
    // Populate main slider with top rated TV shows
    const mainShows = await fetchContent("tv", "top_rated");
    const mainSlider = document.getElementById("slider-principal");
    mainShows.slice(0, 10).forEach((show) => {
      const card = createContentCard(show, "tv");
      mainSlider.appendChild(card);
    });

    // Populate top rated TV shows slider
    const topRatedShows = await fetchContent("tv", "top_rated");
    const topRatedSlider = document.getElementById("slider-top10");
    topRatedShows.slice(0, 10).forEach((show) => {
      const card = createContentCard(show, "tv");
      topRatedSlider.appendChild(card);
    });

    // Populate popular TV shows slider
    const popularShows = await fetchContent("tv", "popular");
    const popularSlider = document.getElementById("slider-populares");
    popularShows.slice(0, 10).forEach((show) => {
      const card = createContentCard(show, "tv");
      popularSlider.appendChild(card);
    });

    // Populate on the air TV shows slider
    const onTheAirShows = await fetchContent("tv", "on_the_air");
    const onTheAirSlider = document.getElementById("slider-en-emision");
    onTheAirShows.slice(0, 10).forEach((show) => {
      const card = createContentCard(show, "tv");
      onTheAirSlider.appendChild(card);
    });
  } catch (error) {
    console.error("Error initializing series page:", error);
  }
}

// Initialize the page when the DOM is loaded
document.addEventListener("DOMContentLoaded", initializeSeriesPage);
