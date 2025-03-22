const axios = require('axios');
require('dotenv').config();
//Se usa trim para que no se cuelen saltos o espacios
const clientId = process.env.CLIENT_ID.trim();
const accessToken = process.env.ACCESS_TOKEN.trim();
const deepLApiKey = process.env.DEEPL_API_KEY.trim();

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
    similar_games: 'games',
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

const traducirTexto = async (texto, targetLang = 'ES') => {
    if (!texto) return 'No disponible';

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
            return cover.url;
        }
        return null;
    } catch (error) {
        console.error('Error al obtener cover:', error.response?.data || error.message);
        return null;
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
        return response.data.map(video => ({
            name: video.name,
            url: `https://www.youtube.com/embed/${video.video_id}`
        }));
    } catch (error) {
        console.error('Error al obtener videos:', error.response?.data || error.message);
        return [];
    }
};

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
        return response.data.map(screenshot => ({
            id: screenshot.id,
            url: screenshot.url
        }));
    } catch (error) {
        console.error('Error al obtener screenshots:', error.response?.data || error.message);
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

const obtenerJuego = async (gameId) => {
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
        juego.similar_games = await obtenerNombres(juego.similar_games, 'games');
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
    return juego;
};

module.exports = {
    obtenerJuego,
    obtenerNombres,
    obtenerCover,
    obtenerInvolvedCompanies,
    obtenerCompanies,
    obtenerVideos,
    obtenerScreenshots,
    obtenerWebsites,
    traducirTexto,
    tablas
};