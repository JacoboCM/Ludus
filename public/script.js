import { populateSlider } from "./utils";
async function cargarDestacados() {
  try {
    const [pelisRes, seriesRes, juegosRes] = await Promise.all([
      fetch("/api/tmdb/movies/top"),   // endpoint de TMDB personalizado
      fetch("/api/tmdb/series/top"),
      fetch("/api/juego/top10")
    ]);

    const [pelis, series, juegos] = await Promise.all([
      pelisRes.json(),
      seriesRes.json(),
      juegosRes.json()
    ]);

    const destacados = [...pelis, ...series, ...juegos].slice(0, 10); // mezcla y corta a 10 elementos

    const contenedor = document.getElementById("slider-principal");
    contenedor.innerHTML = '';

    destacados.forEach(item => {
      const nombre = item.title || item.name;
      const fecha = item.release_date || item.first_air_date || item.first_release_date || 'Sin fecha';
      const img = item.cover || `https://image.tmdb.org/t/p/w500${item.poster_path}`;

      const enlace = item.id && item.first_release_date
        ? `/games/detail.html?id=${item.id}`
        : item.title
        ? `/movies/detail.html?id=${item.id}`
        : `/series/detail.html?id=${item.id}`;

      contenedor.innerHTML += `
        <div class="item">
          <a href="${enlace}">
            <img src="${img}" alt="${nombre}">
            <div class="info-slider">
              <h4 class="titulo-juego">${nombre}</h4>
              <p class="fecha-lanzamiento">📅 ${fecha}</p>
            </div>
          </a>
        </div>
      `;
    });
  } catch (error) {
    console.error("Error al cargar destacados:", error);
  }
}
async function cargarNuevosJuegosHome() {
  try {
    const response = await fetch('/api/juego/nuevos');
    const juegos = await response.json();
    const contenedor = document.getElementById('slider-nuevos-juegos');
    contenedor.innerHTML = '';

    juegos.forEach(game => {
      const rating = game.total_rating || 0;
      const formattedRating = Math.round(rating);
      const releaseDate = game.first_release_date || 'Sin fecha';

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
    const response = await fetch('/api/juego/proximos');
    const juegos = await response.json();
    const contenedor = document.getElementById('slider-proximos-juegos');
    contenedor.innerHTML = '';

    juegos.forEach(game => {
      const rating = game.total_rating || 0;
      const formattedRating = Math.round(rating);
      const releaseDate = game.first_release_date || 'Sin fecha';

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
    // Populate main slider (now playing movies)
    // await populateSlider("slider-principal", "movie", "now_playing");

    // Acá se populan los sliders para la HomePage
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
