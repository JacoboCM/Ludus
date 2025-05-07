import { populateSlider } from "../utils/index.js";

async function initializeSeriesPage() {
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

document.addEventListener("DOMContentLoaded", initializeSeriesPage);
