// TMDB API Configuration
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";
const TMDB_API_KEY = ""; // TMDB API Key (public key)

// Create content card element
function createContentCard(content, type) {
  const card = document.createElement("div");
  card.className = "card";

  // Format the date based on content type
  const date = type === "movie" ? content.release_date : content.first_air_date;

  const formattedDate = date
    ? new Date(date).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Fecha no disponible";

  // Format the rating
  const rating = content.vote_average ? content.vote_average.toFixed(1) : "N/A";

  // Get title/name based on content type
  const title = type === "movie" ? content.title : content.name;

  card.innerHTML = `
    <img src="${TMDB_IMAGE_BASE_URL}/w500${content.poster_path}" alt="${title}" />
    <div class="card-info">
      <h3>${title}</h3>
      <p class="release-date">${formattedDate}</p>
      <div class="rating">
        <i class="fas fa-star"></i>
        <span>${rating}</span>
      </div>
    </div>
  `;

  // Add click event to navigate to detail page
  card.addEventListener("click", () => {
    window.location.href = `${type}s/detail.html?id=${content.id}`;
  });

  return card;
}

// Fetch content from TMDB
async function fetchContent(type, endpoint) {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/${type}/${endpoint}?api_key=${TMDB_API_KEY}&language=es-ES`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error(`Error fetching ${endpoint} ${type}:`, error);
    return [];
  }
}

// Populate slider with content
async function populateSlider(sliderId, type, endpoint) {
  const slider = document.getElementById(sliderId);
  if (!slider) return;

  const content = await fetchContent(type, endpoint);
  content.slice(0, 10).forEach((item) => {
    const card = createContentCard(item, type);
    slider.appendChild(card);
  });
}

// Initialize the page
async function initializePage(type, endpoints) {
  try {
    const { main, topRated, newContent, upcoming } = endpoints;

    // Populate main slider
    await populateSlider("slider-principal", type, main);

    // Populate secondary sliders
    await populateSlider("slider-top10", type, topRated);
    await populateSlider("slider-nuevos", type, newContent);
    await populateSlider("slider-proximos", type, upcoming);
  } catch (error) {
    console.error("Error initializing page:", error);
  }
}

// Export functions
export {
  createContentCard,
  fetchContent,
  populateSlider,
  initializePage,
  TMDB_IMAGE_BASE_URL,
};
