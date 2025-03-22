const accessToken =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5MGFhOTRkMmU3NTZhNTIwYTJkZTAwZDJkMjczYTlhNSIsIm5iZiI6MTcxNDkzNTY4NC4wMTQwMDAyLCJzdWIiOiI2NjM3ZDc4NDk0ZDhhODAxMjMzMzI5YzIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.eAuHbAA5_is5GRleJILJ5JyxLoIhHz9YBYA_n7eleCc";
const baseUrl = "https://api.themoviedb.org/3";

/**
 * Fetch data from TMDb API
 * @param {string} endpoint - The TMDb API endpoint
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} - API response data
 */
async function fetchData(endpoint, params = {}) {
  try {
    const url = new URL(`${baseUrl}/${endpoint}`);
    url.search = new URLSearchParams({
      language: "en-US",
      ...params,
    }).toString();

    console.log(`Fetching data from: ${url}`); // Debugging

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data = await response.json();
    console.log(`Received data from ${endpoint}:`, data); // Debugging

    return data;
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    return null;
  }
}

/**
 * Fetch and display movies
 */
async function fetchMovies() {
  console.log("Fetching movies...");
  const data = await fetchData("discover/movie", {
    sort_by: "popularity.desc",
  });

  if (data?.results) {
    console.log("Movies fetched successfully:", data.results);
    renderCarousel("carouselMovies", data.results);
  } else {
    console.warn("No movies found.");
  }
}

/**
 * Fetch and display TV series
 */
async function fetchSeries() {
  console.log("Fetching TV series...");
  const data = await fetchData("discover/tv", { sort_by: "popularity.desc" });

  if (data?.results) {
    console.log("TV series fetched successfully:", data.results);
    renderCarousel("carouselSeries", data.results);
  } else {
    console.warn("No TV series found.");
  }
}

/**
 * Fetch and display genres
 */
async function fetchGenres() {
  console.log("Fetching genres...");
  const data = await fetchData("genre/movie/list");

  if (data?.genres) {
    console.log("Genres fetched successfully:", data.genres);
    renderGenres("genreList", data.genres);
  } else {
    console.warn("No genres found.");
  }
}

/**
 * Render movies or series in a carousel
 * @param {string} containerId - The ID of the container
 * @param {Array} items - List of movies or series
 */
function renderCarousel(containerId, items) {
  console.log(
    `Rendering carousel for ${containerId} with ${items.length} items...`
  );
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container with ID '${containerId}' not found.`);
    return;
  }
  container.innerHTML = ""; // Clear existing content

  items.forEach((item) => {
    const div = document.createElement("div");
    div.classList.add("item");
    div.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w500/${item.poster_path}" 
           alt="${item.title || item.name}" 
           onclick="goToDetailPage(${item.id}, '${
      item.media_type || "movie"
    }')">
    `;
    container.appendChild(div);
  });

  console.log(`Carousel for ${containerId} rendered successfully.`);
}

/**
 * Render genre list
 * @param {string} containerId - The ID of the container
 * @param {Array} genres - List of genres
 */
function renderGenres(containerId, genres) {
  console.log(
    `Rendering genres in container '${containerId}' with ${genres.length} genres...`
  );
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container with ID '${containerId}' not found.`);
    return;
  }
  container.innerHTML = genres
    .map((genre) => `<li>${genre.name}</li>`)
    .join("");

  console.log(`Genres rendered successfully.`);
}

/**
 * Navigate to the detail page
 * @param {number} id - Movie or TV show ID
 * @param {string} type - "movie" or "tv"
 */
function goToDetailPage(id, type) {
  console.log(`Navigating to detail page: ID=${id}, Type=${type}`);
  window.location.href = `/pages/detailPage?id=${id}&type=${type}`;
}

// Fetch all data on page load
document.addEventListener("DOMContentLoaded", () => {
  console.log("Page loaded. Fetching data...");
  fetchMovies();
  fetchSeries();
  fetchGenres();
});
