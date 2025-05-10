// Configuración de la API de TMDB
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";
const TMDB_API_KEY = "";

// Obtener contenido de TMDB
async function fetchContent(type, endpoint) {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/${type}/${endpoint}?api_key=${TMDB_API_KEY}&language=es-ES`
    );
    if (!response.ok) {
      throw new Error(`¡Error HTTP! estado: ${response.status}`);
    }
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error(`Error al obtener ${endpoint} ${type}:`, error);
    return [];
  }
}

// Obtener detalles del contenido de TMDB
async function fetchContentDetails(type, id) {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/${type}/${id}?api_key=${TMDB_API_KEY}&language=es-ES&append_to_response=videos,credits,similar`
    );
    if (!response.ok) {
      throw new Error(`¡Error HTTP! estado: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error al obtener detalles para ${type} ${id}:`, error);
    return null;
  }
}

// Exportar funciones
export { fetchContent, fetchContentDetails, TMDB_IMAGE_BASE_URL, TMDB_API_KEY };
