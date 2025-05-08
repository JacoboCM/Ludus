import { populateSlider } from "../utils/index.js";

async function initializeMoviesPage() {
  try {
    // Populate secondary sliders
    await populateSlider("slider-top10", "movie", "top_rated");
    await populateSlider("slider-nuevos", "movie", "now_playing");
    await populateSlider("slider-proximos", "movie", "upcoming");
  } catch (error) {
    console.error("Error initializing page:", error);
  }
}

document.addEventListener("DOMContentLoaded", initializeMoviesPage);
