import { fetchContent, TMDB_IMAGE_BASE_URL } from "../services/tmdbService.js";

export async function populateSlider(sliderId, type, endpoint) {
  const slider = document.getElementById(sliderId);
  if (!slider) return;

  const content = await fetchContent(type, endpoint);
  content.slice(0, 10).forEach((item) => {
    const card = document.createElement("slider-card");

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
