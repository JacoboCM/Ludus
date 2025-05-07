// TMDB API Configuration
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";
const TMDB_API_KEY = "";

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

// Fetch content details from TMDB
async function fetchContentDetails(type, id) {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/${type}/${id}?api_key=${TMDB_API_KEY}&language=es-ES&append_to_response=videos,credits,similar`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching details for ${type} ${id}:`, error);
    return null;
  }
}

// Export functions
export { fetchContent, fetchContentDetails, TMDB_IMAGE_BASE_URL, TMDB_API_KEY };
