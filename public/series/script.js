import { populateSlider } from "../utils/index.js";

async function initializeSeriesPage() {
  try {
    await populateSlider("slider-top10", "tv", "top_rated");
    await populateSlider("slider-nuevos", "tv", "on_the_air");
    await populateSlider("slider-proximos", "tv", "airing_today");
  } catch (error) {
    console.error("Error initializing page:", error);
  }
}

document.addEventListener("DOMContentLoaded", initializeSeriesPage);
