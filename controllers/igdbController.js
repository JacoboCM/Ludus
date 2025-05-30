const axios = require('axios');
require('dotenv').config();
//Se usa node-cache para almacenar en caché las respuestas de la API
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 3600 }); // 1 hora de caché

//Se usa trim para que no se cuelen saltos o espacios
const clientId = process.env.CLIENT_ID.trim();
const accessToken = process.env.ACCESS_TOKEN.trim();
const deepLApiKey = process.env.DEEPL_API_KEY.trim();

// Se define un objeto para mapear los campos de IGDB y descartar los que no se necesitan
const tablas = {
    //age_ratings: 'age_ratings',
    //alternative_names: 'alternative_names',
    //artworks: 'artworks',
    //bundles: 'game_bundles',
    //category: 'game_categories',
    cover: 'covers',
    //external_games: 'external_games',
    first_release_date: 'release_dates',
    game_engines: 'game_engines',
    game_modes: 'game_modes',
    genres: 'genres',
    involved_companies: 'involved_companies',
    //keywords: 'keywords',
    //multiplayer_modes: 'multiplayer_modes',
    platforms: 'platforms',
    //player_perspectives: 'player_perspectives',
    //rating: 'rating',
    //rating_count: 'rating_count',
    //release_dates: 'release_dates',
    screenshots: 'screenshots',
    //similar_games: 'games',
    //slug: 'games',
    //standalone_expansions: 'games',
    storyline: 'storyline',
    summary: 'summary',
    //tags: 'tags',
    themes: 'themes',
    total_rating: 'rating',
    total_rating_count: 'rating',
    updated_at: 'updated_at',
    url: 'url',
    //videos: 'game_videos',
    websites: 'websites',
    //language_supports: 'language_supports',
    //game_localizations: 'game_localizations'
};

// Función para buscar juegos por nombre mediante el buscador
const buscarJuegoPorNombre = async (query) => {
    try {
        const cacheKey = `busqueda_${query.toLowerCase()}`;
        const cachedResult = cache.get(cacheKey);
        if (cachedResult) {
            return cachedResult;
        }

        const response = await axios.post(
            'https://api.igdb.com/v4/games',
            `search "${query}";
            fields id, name, cover;`,
            {
                headers: {
                    'Client-ID': clientId,
                    'Authorization': `Bearer ${accessToken}`,
                    'Accept': 'application/json'
                }
            }
        );

        const juegos = response.data;
        const coverIds = juegos.map(j => j.cover).filter(Boolean);
        const coversMap = await obtenerCoversEnLote(coverIds);

        juegos.forEach(j => {
            j.cover = coversMap[j.cover] || null;
        });

        cache.set(cacheKey, juegos);
        return juegos;
    } catch (error) {
        console.error('Error al buscar juegos por nombre:', error.response?.data || error.message);
        return [];
    }
};

// Función para traducir texto usando la API de DeepL
const traducirTexto = async (texto, targetLang = 'ES') => {
    if (!texto) return 'Historia No disponible';

    try {
        const response = await axios.post(
            'https://api-free.deepl.com/v2/translate',
            new URLSearchParams({
                auth_key: deepLApiKey,
                text: texto,
                target_lang: targetLang
            }).toString(),
            {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }
        );

        return response.data.translations[0].text;
    } catch (error) {
        console.error('Error en la traducción con DeepL:', error);
        return texto; // Si falla, devuelve el texto original
    }
};

// Obtener nombres desde la API de IGDB
const obtenerNombres = async (ids, tabla) => {
    if (!ids || ids.length === 0) return [];

    try {
        const response = await axios.post(
            `https://api.igdb.com/v4/${tabla}`,
            `fields id, name; where id = (${ids.join(',')});`,
            {
                headers: {
                    'Client-ID': clientId,
                    'Authorization': `Bearer ${accessToken}`,
                    'Accept': 'application/json'
                }
            }
        );
        return response.data.map(item => item.name || item.id);
    } catch (error) {
        console.error(`Error al obtener ${tabla}:`, error);
        return ids; // Devuelve las IDs originales si hay error
    }
};

//Obtiene la portada del título
const obtenerCover = async (id) => {
    if (!id) return null;

    try {
        const response = await axios.post(
            'https://api.igdb.com/v4/covers',
            `fields id, url, image_id; where id = ${id};`,
            {
                headers: {
                    'Client-ID': clientId,
                    'Authorization': `Bearer ${accessToken}`,
                    'Accept': 'application/json'
                }
            }
        );
        if (response.data && response.data.length > 0) {
            let cover = response.data[0];
            // Convertir la URL (por ejemplo, agregar "https:")
            if (cover.url && cover.url.startsWith("//")) {
                cover.url = "https:" + cover.url;
            }
            if (cover.url && cover.url.includes("t_thumb")) {
                cover.url = cover.url.replace("t_thumb", "t_cover_big");
            }
            return cover.url;
        }
        return null;
    } catch (error) {
        console.error('Error al obtener cover:', error.response?.data || error.message);
        return null;
    }
};

// Obtiene varias portadas en un solo request
const obtenerCoversEnLote = async (ids) => {
    if (!ids || ids.length === 0) return {};

    try {
        const response = await axios.post(
            'https://api.igdb.com/v4/covers',
            `fields id, url, image_id; where id = (${ids.join(',')});`,
            {
                headers: {
                    'Client-ID': clientId,
                    'Authorization': `Bearer ${accessToken}`,
                    'Accept': 'application/json'
                }
            }
        );

        const coversMap = {};
        response.data.forEach(cover => {
            let url = cover.url;
            if (url.startsWith("//")) url = "https:" + url;
            if (url.includes("t_thumb")) url = url.replace("t_thumb", "t_cover_big");// Cambia a la versión de mayor resolución
            coversMap[cover.id] = url;
        });

        return coversMap;
    } catch (error) {
        console.error('Error al obtener covers en lote:', error.response?.data || error.message);
        return {};
    }
};

const obtenerCoversSimilares = async (ids) => {
    try {
        const response = await axios.post(
            'https://api.igdb.com/v4/games',
            `fields id, name, cover, total_rating, total_rating_count, first_release_date; where id = (${ids.join(',')});`,
            {
                headers: {
                    'Client-ID': clientId,
                    'Authorization': `Bearer ${accessToken}`,
                    'Accept': 'application/json'
                }
            }
        );
        // Para cada juego, usamos obtenerCover y procesamos los nuevos campos
        const covers = await Promise.all(response.data.map(async game => {
            const coverUrl = game.cover ? await obtenerCover(game.cover) : null;

            const releaseDate = game.first_release_date
                ? new Date(game.first_release_date * 1000).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
                : 'Sin fecha';

            const rating = game.total_rating ? Math.round(game.total_rating) : 0;

            return {
                id: game.id,
                name: game.name,
                cover: coverUrl,
                first_release_date: releaseDate,
                total_rating: rating
            };
        }));
        return covers;
    } catch (error) {
        console.error('Error al obtener covers de juegos similares:', error.response?.data || error.message);
        return ids;
    }
};

//Obtener paginas webs relacionadas
const obtenerWebsites = async (ids) => {
    if (!ids || ids.length === 0) return [];

    try {
        const response = await axios.post(
            'https://api.igdb.com/v4/websites',
            `fields id, url; where id = (${ids.join(',')});`,
            {
                headers: {
                    'Client-ID': clientId,
                    'Authorization': `Bearer ${accessToken}`,
                    'Accept': 'application/json'
                }
            }
        );
        return response.data.map(site => site.url);
    } catch (error) {
        console.error('Error al obtener websites:', error.response?.data || error.message);
        return ids; // Si hay error, devolver los IDs sin modificar
    }
};

//Obtener url de los videos
const obtenerVideos = async (ids) => {
    if (!ids || ids.length === 0) return [];
    try {
        const response = await axios.post(
            'https://api.igdb.com/v4/game_videos',
            `fields id, video_id, name; where id = (${ids.join(',')});`,
            {
                headers: {
                    'Client-ID': clientId,
                    'Authorization': `Bearer ${accessToken}`,
                    'Accept': 'application/json'
                }
            }
        );
        // Devolver solo el primer video
        const videos = response.data.map(video => ({
            name: video.name,
            url: `https://www.youtube.com/embed/${video.video_id}`
        }));
        return videos.slice(0, 1);
    } catch (error) {
        console.error('Error al obtener videos:', error.response?.data || error.message);
        return [];
    }
};

//Obtener url de las capturas de pantalla
const obtenerScreenshots = async (ids) => {
    if (!ids || ids.length === 0) return [];

    try {
        const response = await axios.post(
            'https://api.igdb.com/v4/screenshots',
            `fields id, url; where id = (${ids.join(',')});`,
            {
                headers: {
                    'Client-ID': clientId,
                    'Authorization': `Bearer ${accessToken}`,
                    'Accept': 'application/json'
                }
            }
        );
        return response.data.map(screenshot => {
            let url = screenshot.url;
            // Si la URL contiene "t_thumb", reemplazar por una versión de mayor resolución
            if (url && url.includes("t_thumb")) {
                url = url.replace("t_thumb", "t_screenshot_huge");
            }
            return { id: screenshot.id, url: url };
        });
    } catch (error) {
        console.error('Error al obtener screenshots:', error.response?.data || error.message);
        return [];
    }
};
//Obtener url de los artworks
const obtenerArtworks = async (ids) => {
    if (!ids || ids.length === 0) return [];

    try {
        const response = await axios.post(
            'https://api.igdb.com/v4/artworks',
            `fields id, url; where id = (${ids.join(',')});`,
            {
                headers: {
                    'Client-ID': clientId,
                    'Authorization': `Bearer ${accessToken}`,
                    'Accept': 'application/json'
                }
            }
        );
        return response.data.map(artwork => {
            let url = artwork.url;
            // Mejorar resolución si es posible
            if (url) {
                url = url.replace(/t_thumb|t_cover_big|t_screenshot_huge/, "t_1080p");
            }
            return { id: artwork.id, url: url };
        });
    } catch (error) {
        console.error('Error al obtener artworks:', error.response?.data || error.message);
        return [];
    }
};

//Obtiene ids de las compañias involucradas 
const obtenerInvolvedCompanies = async (ids) => {
    if (!ids || ids.length === 0) return [];
    try {
        const response = await axios.post(
            'https://api.igdb.com/v4/involved_companies',
            `fields id, company; where id = (${ids.join(',')});`,
            {
                headers: {
                    'Client-ID': clientId,
                    'Authorization': `Bearer ${accessToken}`,
                    'Accept': 'application/json'
                }
            }
        );
        // Devuelve los objetos completos para poder extraer luego la propiedad "company"
        return response.data;
    } catch (error) {
        console.error('Error al obtener involved_companies:', error.response?.data || error.message);
        return ids;
    }
};

//Obtiene el nombre de la compañia
const obtenerCompanies = async (ids) => {
    if (!ids || ids.length === 0) return [];
    try {
        const response = await axios.post(
            'https://api.igdb.com/v4/companies',
            `fields id, name; where id = (${ids.join(',')});`,
            {
                headers: {
                    'Client-ID': clientId,
                    'Authorization': `Bearer ${accessToken}`,
                    'Accept': 'application/json'
                }
            }
        );
        return response.data.map(item => item.name || item.id);
    } catch (error) {
        console.error('Error al obtener companies:', error.response?.data || error.message);
        return ids;
    }
};

// Se obtiene el juego completo, se traduce y se almacenan los resultados en caché
// Se usa un cache para evitar consultas repetidas a la API
const obtenerJuego = async (gameId) => {
    const cacheKey = `juego-${gameId}`;
    const cachedJuego = cache.get(cacheKey);
    if (cachedJuego) {
        return cachedJuego;
    }
    // Consulta a IGDB para obtener todos los campos del juego
    const gameResponse = await axios.post(
        'https://api.igdb.com/v4/games',
        `fields *; where id = ${gameId};`,
        {
            headers: {
                'Client-ID': clientId,
                'Authorization': `Bearer ${accessToken}`,
                'Accept': 'application/json'
            }
        }
    );
    if (!gameResponse.data.length) {
        console.log("Juego no encontrado en la API de IGDB.");
        throw new Error('Juego no encontrado');
    }
    let juego = gameResponse.data[0];
    console.log("Datos recibidos de IGDB:", JSON.stringify(juego, null, 2));

    // Traduce todas las IDs en el resultado usando el objeto tablas
    for (let campo in juego) {
        if (tablas[campo] && Array.isArray(juego[campo])) {
            juego[campo] = await obtenerNombres(juego[campo], tablas[campo]);
        }
    }

    // Obtiene la imagen de la portada
    if (juego.cover) {
        juego.cover = await obtenerCover(juego.cover);
    }

    // Redondea la puntuación total
    if (juego.total_rating) {
        juego.total_rating = Math.round(juego.total_rating);
    }

    // Procesa las compañías involucradas
    if (juego.involved_companies && Array.isArray(juego.involved_companies)) {
        const involvedData = await obtenerInvolvedCompanies(juego.involved_companies);
        const companiesIds = involvedData.map(item => item.company);
        juego.involved_companies = await obtenerCompanies(companiesIds);
    }

    // Formatea la fecha de lanzamiento
    if (juego.first_release_date) {
        const dateObj = new Date(juego.first_release_date * 1000);
        const day = dateObj.getDate().toString().padStart(2, '0');
        const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
        const year = dateObj.getFullYear();
        juego.first_release_date = `${day}/${month}/${year}`;
    }

    // Procesa el motor de juego
    if (juego.game_engines && Array.isArray(juego.game_engines)) {
        juego.game_engines = await obtenerNombres(juego.game_engines, 'game_engines');
    }

    // Procesa los videos
    if (juego.videos && Array.isArray(juego.videos)) {
        console.log("Obteniendo detalles de videos en IGDB...");
        juego.videos = await obtenerVideos(juego.videos);
        console.log("Videos procesados:", juego.videos);
    }

    // Procesa las capturas de pantalla
    if (juego.screenshots && Array.isArray(juego.screenshots)) {
        juego.screenshots = await obtenerScreenshots(juego.screenshots);
    }

    // Procesa juegos similares
    if (juego.similar_games && Array.isArray(juego.similar_games)) {
        const similarIds = juego.similar_games.map(j => typeof j === 'object' ? j.id : j);
        juego.similar_games = await obtenerCoversSimilares(similarIds);
        juego.similar_games.sort((a, b) => b.total_rating - a.total_rating);
    }

    // Procesa las URLs de sitios web
    if (juego.websites) {
        console.log("IDs de websites antes de la conversión:", juego.websites);
        juego.websites = await obtenerWebsites(juego.websites);
        console.log("Websites procesados:", juego.websites);
    }

    // Traduce la historia y el resumen
    juego.storyline = await traducirTexto(juego.storyline);
    juego.summary = await traducirTexto(juego.summary);

    // Procesa los modos de juego
    if (juego.game_modes && Array.isArray(juego.game_modes)) {
        const nombresGameModes = await obtenerNombres(juego.game_modes, 'game_modes');
        juego.game_modes = await traducirTexto(nombresGameModes.join(', '));
    }

    // Procesa los temas
    if (juego.themes && Array.isArray(juego.themes)) {
        const nombresThemes = await obtenerNombres(juego.themes, 'themes');
        juego.themes = await traducirTexto(nombresThemes.join(', '));
    }

    // Formatea la fecha de última actualización
    if (juego.updated_at) {
        const dateObj = new Date(juego.updated_at * 1000);
        const day = dateObj.getDate().toString().padStart(2, '0');
        const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
        const year = dateObj.getFullYear();
        juego.updated_at = `${day}/${month}/${year}`;
    }

    console.log("Traducción completada");
    cache.set(cacheKey, juego);
    return juego;
};

// Función para obtener el slider principal
const obtenerSliderPrincipal = async () => {
    const cacheKey = 'sliderPrincipal';
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
        return cachedData;
    }

    const currentTimestamp = Math.floor(Date.now() / 1000);// Obtener el timestamp actual
    const oneMonthAgo = currentTimestamp - (120 * 24 * 60 * 60);// hace 120 días

    try {
        const response = await axios.post(
            'https://api.igdb.com/v4/games',
            `fields id, name, first_release_date, artworks, total_rating_count, hypes;
            where first_release_date >= ${oneMonthAgo} & first_release_date <= ${currentTimestamp} 
            & hypes > 10
            & total_rating_count > 15;
            sort total_rating_count desc;
            limit 10;`,
            {
                headers: {
                    'Client-ID': clientId,
                    'Authorization': `Bearer ${accessToken}`,
                    'Accept': 'application/json'
                }
            }
        );

        // Si tiene artwork, obten la URL del primero y ajusta la resolución, si no, se usa screenshot
        const juegos = await Promise.all(response.data.map(async (juego) => {
            if (juego.artworks && juego.artworks.length > 0) {
                const artworksArr = await obtenerArtworks(juego.artworks.slice(0, 1));
                if (artworksArr.length > 0) {
                    juego.screenshot = artworksArr[0].url;
                } else {
                    juego.screenshot = null;
                }
            } else {
                juego.screenshot = null;
            }
            return juego;
        }));

        cache.set(cacheKey, juegos);
        return juegos;

    } catch (error) {
        console.error('Error al obtener slider principal:', error.response?.data || error.message);
        throw error;
    }
};

// Función para obtener el top 10 de juegos
const obtenerTop10 = async () => {
    const cachedTop10 = cache.get('top10');
    if (cachedTop10) {
        return cachedTop10;
    }
    try {
        const response = await axios.post(
            'https://api.igdb.com/v4/games',
            'fields id, name, first_release_date, total_rating, total_rating_count, cover; where total_rating_count > 1800; sort total_rating desc; limit 10;',
            {
                headers: {
                    'Client-ID': clientId,
                    'Authorization': `Bearer ${accessToken}`,
                    'Accept': 'application/json'
                }
            }
        );
        // Obtener todas las covers en lote
        const juegos = response.data;
        const coverIds = juegos.map(j => j.cover).filter(Boolean);
        const coversMap = await obtenerCoversEnLote(coverIds);

        juegos.forEach(j => {
            j.cover = coversMap[j.cover] || null;

            // Formatear la fecha de lanzamiento si está disponible
            if (j.first_release_date) {
                const dateObj = new Date(j.first_release_date * 1000);
                const opciones = { day: 'numeric', month: 'short', year: 'numeric' };
                j.first_release_date = dateObj.toLocaleDateString('es-ES', opciones);
            }

            // Redondear la puntuación
            if (j.total_rating) {
                j.total_rating = Math.round(j.total_rating);
            }
        });

        cache.set('top10', juegos);
        return juegos;
    } catch (error) {
        console.error('Error al obtener Top 10:', error.response?.data || error.message);
        throw error;
    }
};
// Función para obtener nuevos lanzamientos
const obtenerNuevosLanzamientos = async () => {
    const cachedNuevos = cache.get('nuevos');
    if (cachedNuevos) {
        return cachedNuevos;
    }

    const currentTimestamp = Math.floor(Date.now() / 1000);// Obtener el timestamp actual
    const oneMonthAgo = currentTimestamp - (60 * 24 * 60 * 60); // hace 60 días

    try {
        const response = await axios.post(
            'https://api.igdb.com/v4/games',
            `fields id, name, first_release_date, cover, total_rating, total_rating_count;
            where first_release_date >= ${oneMonthAgo} & first_release_date <= ${currentTimestamp} & total_rating_count > 10 & cover != null;
            sort total_rating_count desc;
            limit 10;`,
            {
                headers: {
                    'Client-ID': clientId,
                    'Authorization': `Bearer ${accessToken}`,
                    'Accept': 'application/json'
                }
            }
        );

        const juegos = response.data;
        const coverIds = juegos.map(j => j.cover).filter(Boolean);
        const coversMap = await obtenerCoversEnLote(coverIds);

        juegos.forEach(j => {
            j.cover = coversMap[j.cover] || null;

            if (j.first_release_date) {
                const dateObj = new Date(j.first_release_date * 1000);
                const opciones = { day: 'numeric', month: 'short', year: 'numeric' };
                j.first_release_date = dateObj.toLocaleDateString('es-ES', opciones);
            }

            if (j.total_rating) {
                j.total_rating = Math.round(j.total_rating);
            }
        });

        cache.set('nuevos', juegos);
        return juegos;
    } catch (error) {
        console.error('Error al obtener nuevos lanzamientos:', error.response?.data || error.message);
        throw error;
    }
};
// Función para obtener próximos lanzamientos
const obtenerProximosLanzamientos = async () => {
    const cachedProximos = cache.get('proximos');
    if (cachedProximos) {
        return cachedProximos;
    }

    const currentTimestamp = Math.floor(Date.now() / 1000);// Obtener el timestamp actual
    const oneYearLater = currentTimestamp + (365 * 24 * 60 * 60);// del dia de hoy a un año

    try {
        const response = await axios.post(
            'https://api.igdb.com/v4/games',
            `fields id, name, first_release_date, cover, hypes;
            where first_release_date > ${currentTimestamp}
            & first_release_date <= ${oneYearLater}
            & hypes > 10
            & cover != null
            & category = 0;
            sort hypes desc;
            limit 10;`,
            {
                headers: {
                    'Client-ID': clientId,
                    'Authorization': `Bearer ${accessToken}`,
                    'Accept': 'application/json'
                }
            }
        );

        const juegos = response.data;
        const coverIds = juegos.map(j => j.cover).filter(Boolean);
        const coversMap = await obtenerCoversEnLote(coverIds);

        juegos.forEach(j => {
            j.cover = coversMap[j.cover] || null;

            if (j.first_release_date) {
                const dateObj = new Date(j.first_release_date * 1000);
                const opciones = { day: 'numeric', month: 'short', year: 'numeric' };
                j.first_release_date = dateObj.toLocaleDateString('es-ES', opciones);
            }
        });

        cache.set('proximos', juegos);
        return juegos;
    } catch (error) {
        console.error('Error al obtener próximos lanzamientos:', error.response?.data || error.message);
        throw error;
    }
};

// Top 10 juegos de PC
const obtenerTop10Pc = async () => {
    const cacheKey = 'top10Pc';
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    try {
        const consulta = `
            fields id, name, first_release_date, cover, total_rating, total_rating_count;
            where platforms = [6]
            & total_rating != null
            & total_rating_count > 600
            & hypes > 30
            & cover != null;
            sort total_rating desc;
            limit 10;
        `;
        const response = await axios.post('https://api.igdb.com/v4/games', consulta, {
            headers: {
                'Client-ID': clientId,
                'Authorization': `Bearer ${accessToken}`,
                'Accept': 'application/json'
            }
        });

        const juegos = response.data;
        const coverIds = juegos.map(j => j.cover).filter(Boolean);
        const coversMap = await obtenerCoversEnLote(coverIds);

        juegos.forEach(j => {
            j.cover = coversMap[j.cover] || null;

            if (j.first_release_date) {
                const dateObj = new Date(j.first_release_date * 1000);
                const opciones = { day: 'numeric', month: 'short', year: 'numeric' };
                j.first_release_date = dateObj.toLocaleDateString('es-ES', opciones);
            }

            if (j.total_rating) {
                j.total_rating = Math.round(j.total_rating);
            }
        });

        cache.set(cacheKey, juegos);
        return juegos;

    } catch (error) {
        console.error('Error al obtener top 10 PC:', error.response?.data || error.message);
        throw error;
    }
};

// Top 10 juegos de PS5/PS4/Xbox/Nintendo
const obtenerTop10Consola = async () => {
    const cacheKey = 'top10Consola';
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    try {
        const consulta = `
            fields id, name, first_release_date, cover, total_rating, total_rating_count;
            where platforms = (48, 130, 167, 169)
            & total_rating != null
            & total_rating_count > 600
            & hypes > 20
            & cover != null;
            sort total_rating desc;
            limit 10;
        `;

        const response = await axios.post('https://api.igdb.com/v4/games', consulta, {
            headers: {
                'Client-ID': clientId,
                'Authorization': `Bearer ${accessToken}`,
                'Accept': 'application/json'
            }
        });

        const juegos = response.data;
        const coverIds = juegos.map(j => j.cover).filter(Boolean);
        const coversMap = await obtenerCoversEnLote(coverIds);

        juegos.forEach(j => {
            j.cover = coversMap[j.cover] || null;

            if (j.first_release_date) {
                const dateObj = new Date(j.first_release_date * 1000);
                const opciones = { day: 'numeric', month: 'short', year: 'numeric' };
                j.first_release_date = dateObj.toLocaleDateString('es-ES', opciones);
            }

            if (j.total_rating) {
                j.total_rating = Math.round(j.total_rating);
            }
        });

        cache.set(cacheKey, juegos);
        return juegos;

    } catch (error) {
        console.error('Error al obtener top 10 Consola:', error.response?.data || error.message);
        throw error;
    }
};
/*
// Top 10 juegos de Nintendo (Switch, Wii U)
const obtenerTop10Nintendo = async () => {
    const cacheKey = 'top10nintendo';
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    try {
        const consulta = `
            fields id, name, cover, total_rating, hypes, total_rating_count;
            where (platforms = 130 | platforms = 41)
            & total_rating != null
            & total_rating_count > 50
            & hypes > 5
            & cover != null;
            sort total_rating desc;
            limit 10;
        `;

        const response = await axios.post('https://api.igdb.com/v4/games', consulta, {
            headers: {
                'Client-ID': clientId,
                'Authorization': `Bearer ${accessToken}`,
                'Accept': 'application/json'
            }
        });

        const juegos = response.data;
        const coverIds = juegos.map(j => j.cover).filter(Boolean);
        const coversMap = await obtenerCoversEnLote(coverIds);

        juegos.forEach(j => {
            j.cover = coversMap[j.cover] || null;
        });

        cache.set(cacheKey, juegos);
        return juegos;

    } catch (error) {
        console.error('Error al obtener top 10 Nintendo:', error.response?.data || error.message);
        throw error;
    }
};
*/
module.exports = {
    obtenerTop10Pc,
    obtenerTop10Consola,
    //obtenerTop10Nintendo,
    buscarJuegoPorNombre,
    obtenerArtworks,
    obtenerSliderPrincipal,
    obtenerNuevosLanzamientos,
    obtenerProximosLanzamientos,
    obtenerTop10,
    obtenerJuego,
    obtenerNombres,
    obtenerCover,
    obtenerCoversEnLote,
    obtenerInvolvedCompanies,
    obtenerCompanies,
    obtenerVideos,
    obtenerScreenshots,
    obtenerWebsites,
    traducirTexto,
    tablas
};