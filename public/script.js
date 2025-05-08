import { populateSlider } from "./utils";

async function cargarNuevosJuegosHome() {
  try {
    const response = await fetch("/api/juego/nuevos");
    const juegos = await response.json();
    const contenedor = document.getElementById("slider-nuevos-juegos");
    contenedor.innerHTML = "";

    juegos.forEach((game) => {
      const rating = game.total_rating || 0;
      const formattedRating = Math.round(rating);
      const releaseDate = game.first_release_date || "Sin fecha";

      contenedor.innerHTML += `
        <div class="item">
          <a href="/games/detail.html?id=${game.id}">
            <img src="${game.cover}" alt="${game.name}" />
            <div class="info-slider">
              <h4 class="titulo-juego">${game.name}</h4>
              <p class="fecha-lanzamiento">📅 ${releaseDate}</p>
              <div class="rating-estrella">
                <span class="estrella">★</span> ${formattedRating}
              </div>
            </div>
          </a>
        </div>
      `;
    });
  } catch (error) {
    console.error("Error al cargar nuevos juegos:", error);
  }
}

async function cargarProximosJuegosHome() {
  try {
    const response = await fetch("/api/juego/proximos");
    const juegos = await response.json();
    const contenedor = document.getElementById("slider-proximos-juegos");
    contenedor.innerHTML = "";

    juegos.forEach((game) => {
      const rating = game.total_rating || 0;
      const formattedRating = Math.round(rating);
      const releaseDate = game.first_release_date || "Sin fecha";

      contenedor.innerHTML += `
        <div class="item">
          <a href="/games/detail.html?id=${game.id}">
            <img src="${game.cover}" alt="${game.name}" />
            <div class="info-slider">
              <h4 class="titulo-juego">${game.name}</h4>
              <p class="fecha-lanzamiento">📅 ${releaseDate}</p>
            </div>
          </a>
        </div>
      `;
    });
  } catch (error) {
    console.error("Error al cargar próximos juegos:", error);
  }
}

async function initializeHomePage() {
  try {
    await populateSlider("slider-top10", "movie", "top_rated");
    await populateSlider("slider-nuevos", "tv", "on_the_air");
    await populateSlider("slider-proximos", "movie", "upcoming");

    await cargarNuevosJuegosHome();
    await cargarProximosJuegosHome();
  } catch (error) {
    console.error("Error initializing page:", error);
  }
}

document.addEventListener("DOMContentLoaded", initializeHomePage);
