import {
  fetchContent,
  TMDB_IMAGE_BASE_URL,
} from "../scripts/services/tmdbService.js";

async function populateSlider(sliderId, type, endpoint) {
  const slider = document.getElementById(sliderId);
  if (!slider) return;

  const content = await fetchContent(type, endpoint);
  content.slice(0, 10).forEach((item) => {
    const card = document.createElement("slider-card");

    // Set the properties for the slider-card component
    card.title = type === "movie" ? item.title : item.name;
    card.imageUrl = `${TMDB_IMAGE_BASE_URL}/w500${item.poster_path}`;
    card.releaseDate = new Date(
      type === "movie" ? item.release_date : item.first_air_date
    ).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    card.rating = item.vote_average;
    card.id = item.id;
    card.type = type;

    slider.appendChild(card);
  });
}

// Initialize the page
async function initializePage() {
  try {
    // Populate main slider (now playing movies)
    // await populateSlider("slider-principal", "movie", "now_playing");

    // Populate secondary sliders
    await populateSlider("slider-top10", "tv", "top_rated");
    await populateSlider("slider-nuevos", "tv", "on_the_air");
    await populateSlider("slider-proximos", "tv", "airing_today");
  } catch (error) {
    console.error("Error initializing page:", error);
  }
}

// Initialize when the DOM is loaded
document.addEventListener("DOMContentLoaded", initializePage);
