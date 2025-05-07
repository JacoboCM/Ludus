import { populateSlider } from "./utils";

async function initializeHomePage() {
  try {
    // Populate main slider (now playing movies)
    // await populateSlider("slider-principal", "movie", "now_playing");

    // Acá se populan los sliders para la HomePage
    await populateSlider("slider-top10", "movie", "top_rated");
    await populateSlider("slider-nuevos", "tv", "on_the_air");
    await populateSlider("slider-proximos", "movie", "upcoming");
  } catch (error) {
    console.error("Error initializing page:", error);
  }
}

document.addEventListener("DOMContentLoaded", initializeHomePage);
