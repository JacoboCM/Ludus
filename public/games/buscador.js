import { TMDB_API_KEY } from '../scripts/services/tmdbService.js';
document.addEventListener('DOMContentLoaded', () => {
    const input = document.querySelector('#input-buscador');
    const boton = document.querySelector('#btn-buscar');
    const resultados = document.querySelector('#resultados');

    boton.addEventListener('click', async () => {
        const query = input.value.trim();
        if (!query) return;

        const resultadosJuegos = document.querySelector('#resultados');
        let resultadosMultimedia = document.querySelector('#resultados-multimedia');

        if (!resultadosMultimedia) {
            resultadosMultimedia = document.createElement('div');
            resultadosMultimedia.id = 'resultados-multimedia';
            resultadosMultimedia.classList.add('resultados');
            resultados.parentNode.insertBefore(resultadosMultimedia, resultados.nextSibling);
        }

        document.querySelectorAll('h3.resultado-titulo').forEach(el => el.remove());

        resultadosJuegos.innerHTML = '';
        resultadosMultimedia.innerHTML = '';

        try {
            // Buscar videojuegos
            const juegosResponse = await fetch(`/api/juego/buscar?nombre=${encodeURIComponent(query)}`);
            const juegos = await juegosResponse.json();

            if (juegos.length === 0) {
                resultadosJuegos.innerHTML = '<p>No se encontraron videojuegos.</p>';
            } else {
                const tituloJuegos = document.createElement('h3');
                tituloJuegos.textContent = '🎮 Videojuegos';
                tituloJuegos.classList.add('resultado-titulo');
                resultadosJuegos.before(tituloJuegos);

                juegos.forEach(juego => {
                    const item = document.createElement('div');
                    item.classList.add('resultados-item');
                    item.innerHTML = `
                        <a href="/games/detail.html?id=${juego.id}">
                            <img src="${juego.cover || '/assets/placeholder.jpg'}" alt="${juego.name}" />
                        </a>
                    `;
                    resultadosJuegos.appendChild(item);
                });
            }

            // Buscar en TMDB
            const tmdbResponse = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&language=es-ES&query=${encodeURIComponent(query)}`);
            const tmdb = await tmdbResponse.json();

            if (tmdb.results.length === 0) {
                resultadosMultimedia.innerHTML = '<p>No se encontraron películas o series.</p>';
            } else {
                const tituloMultimedia = document.createElement('h3');
                tituloMultimedia.textContent = '🎬 Películas y Series';
                tituloMultimedia.classList.add('resultado-titulo');
                resultadosMultimedia.before(tituloMultimedia);

                tmdb.results.forEach(itemData => {
                    const item = document.createElement('div');
                    item.classList.add('resultados-item');

                    const title = itemData.title || itemData.name || 'Sin título';
                    const img = itemData.poster_path 
                        ? `https://image.tmdb.org/t/p/w200${itemData.poster_path}` 
                        : '/assets/placeholder.jpg';

                    const tipo = itemData.media_type;
                    const enlace = tipo && itemData.id ? `/movies/detail.html?id=${itemData.id}&type=${tipo}` : '#';

                    item.innerHTML = `
                        <a href="${enlace}" target="_blank">
                            <img src="${img}" alt="${title}" />
                        </a>
                    `;

                    resultadosMultimedia.appendChild(item);
                });
            }

        } catch (err) {
            console.error('Error al buscar:', err);
            resultadosJuegos.innerHTML = '<p>Error al buscar videojuegos.</p>';
            resultadosMultimedia.innerHTML = '<p>Error al buscar películas o series.</p>';
        }
    });
});
