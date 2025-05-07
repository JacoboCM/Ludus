import {
  fetchContentDetails,
  TMDB_IMAGE_BASE_URL,
} from "./services/tmdbService.js";

async function initializeDetailPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  const type = urlParams.get("type") || "movie"; // Default to movie if type not specified

  if (!id) {
    window.location.href = "/";
    return;
  }

  try {
    const data = await fetchContentDetails(type, id);
    if (!data) {
      throw new Error("No data found");
    }

    const resultado = document.getElementById("resultado");
    const title = type === "movie" ? data.title : data.name;
    const releaseDate =
      type === "movie" ? data.release_date : data.first_air_date;
    const runtime =
      type === "movie" ? data.runtime : data.episode_run_time?.[0];
    const genres = data.genres.map((genre) => genre.name).join(", ");
    const director = data.credits?.crew?.find(
      (person) => person.job === "Director"
    )?.name;
    const cast = data.credits?.cast
      ?.slice(0, 5)
      .map((person) => person.name)
      .join(", ");
    const trailer = data.videos?.results?.find(
      (video) => video.type === "Trailer"
    );
    const similar = data.similar?.results?.slice(0, 6);

    let contenido = `
      <div class="top-section">
        <div class="video-container">
          ${
            trailer
              ? `
            <iframe width="830" height="510" 
              src="https://www.youtube.com/embed/${trailer.key}" 
              frameborder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowfullscreen>
            </iframe>
          `
              : `
            <img src="${TMDB_IMAGE_BASE_URL}/original${data.backdrop_path}" 
              alt="${title}" 
              style="width: 830px; height: 510px; object-fit: cover; border-radius: 8px;">
          `
          }
        </div>
        <div class="detail-container contenedor-blur">
          <h2 class="nombre-titulo">${title}</h2>
          <p><strong>Géneros:</strong> ${genres}</p>
          <p><strong>Fecha de lanzamiento:</strong> ${new Date(
            releaseDate
          ).toLocaleDateString("es-ES")}</p>
          ${
            runtime
              ? `<p><strong>Duración:</strong> ${runtime} minutos</p>`
              : ""
          }
          ${director ? `<p><strong>Director:</strong> ${director}</p>` : ""}
          ${cast ? `<p><strong>Reparto:</strong> ${cast}</p>` : ""}
          <div class="rating-container">
            <div class="rating-score">${Math.round(
              data.vote_average * 10
            )}</div>
            <div class="rating-bar">
              <div class="rating-fill verde" style="width: ${
                data.vote_average * 10
              }%;"></div>
              <div class="rating-fill rojo" style="width: ${
                100 - data.vote_average * 10
              }%;"></div>
            </div>
          </div>
          <p class="resumen">${data.overview}</p>
        </div>
      </div>
    `;

    if (similar && similar.length > 0) {
      contenido += `
        <div class="bottom-section">
          <h3>Contenido Similar</h3>
          <div class="similar-content">
            ${similar
              .map(
                (item) => `
              <div class="similar-item">
                <a href="/detail.html?id=${item.id}&type=${type}">
                  <img src="${TMDB_IMAGE_BASE_URL}/w200${
                  item.poster_path
                }" alt="${type === "movie" ? item.title : item.name}" />
                  <div class="similar-info">
                    <h4>${type === "movie" ? item.title : item.name}</h4>
                    <p>${new Date(
                      type === "movie" ? item.release_date : item.first_air_date
                    ).toLocaleDateString("es-ES")}</p>
                    <div class="rating">
                      <span class="star">★</span>
                      <span>${item.vote_average.toFixed(1)}</span>
                    </div>
                  </div>
                </a>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      `;
    }

    resultado.innerHTML = contenido;
  } catch (error) {
    console.error("Error loading detail page:", error);
    document.getElementById("resultado").innerHTML =
      "<p>Error al cargar los detalles. Por favor, intente nuevamente.</p>";
  }
}

document.addEventListener("DOMContentLoaded", initializeDetailPage);
