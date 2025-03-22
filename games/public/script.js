function buscarJuego(id) {
    fetch(`/api/juego/${id}`)
        .then(response => response.json())
        .then(data => {
            const resultado = document.getElementById('resultado');

            if (data.error) {
                resultado.innerHTML = `<p>${data.error}</p>`;
                return;
            }

            let contenido = `<h2>${data.name}</h2>`;

            if (data.cover) {
                contenido += `<img src="${data.cover}" alt="Portada del juego">`;
            }

            if (data.updated_at) {
                contenido += `<p><strong>Última actualización:</strong> ${data.updated_at}</p>`;
            }
            
            // Mostrar los datos básicos
            contenido += `
                <p><strong>Resumen:</strong> ${data.summary || 'No disponible'}</p>
                <p><strong>Historia:</strong> ${data.storyline || 'No disponible'}</p>
                <p><strong>Puntuación:</strong> ${data.total_rating || 'No disponible'}</p>
                <p><strong>Número de votos:</strong> ${data.total_rating_count || 'No disponible'}</p>`;

            if (data.platforms) {
                contenido += `<p><strong>Plataformas:</strong> ${data.platforms.join(', ')}</p>`;
            }

            if (data.first_release_date) {
                contenido += `<p><strong>Fecha de lanzamiento:</strong> ${data.first_release_date}</p>`;
            }

            if (data.genres) {
                contenido += `<p><strong>Géneros:</strong> ${data.genres.join(', ')}</p>`;
            }
            if (data.themes) {
                contenido += `<p><strong>Temas:</strong> ${data.themes}</p>`;
            }
            if (data.game_modes) {
                contenido += `<p><strong>Modos de juego:</strong> ${data.game_modes}</p>`;
            }
            
            if (data.similar_games){
                contenido += `<p><strong>Juegos similares:</strong> ${data.similar_games}</p>`;
            }

            if (data.involved_companies){
                contenido += `<p><strong>Compañias:</strong> ${data.involved_companies.join(', ')}</p>`;
            }

            if (data.game_engines){
                contenido += `<p><strong>Motor:</strong> ${data.game_engines}</p>`;
            }

            if (data.videos && data.videos.length > 0) {
                contenido += `<h3>Videos</h3>`;
                data.videos.forEach(video => {
                    contenido += `
                    <iframe width="560" height="315"
                        src="${video.url}"
                        frameborder="0"
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                        referrerpolicy="no-referrer"
                        allowfullscreen>
                    </iframe>
                `;
                });
            } else {
                contenido += `<p><strong>Videos:</strong> No disponibles</p>`;
            }

            if (data.screenshots && data.screenshots.length > 0) {
                contenido += `<h3>Screenshots</h3>`;
                data.screenshots.forEach(screenshot => {
                    contenido += `<img src="${screenshot.url}" alt="Screenshot ${screenshot.id}" style="max-width: 100%; margin-bottom: 1rem;">`;
                });
            }

            if (data.websites && data.websites.length > 0) {
                contenido += `<h3>Sitios Web</h3>`;
                data.websites.forEach(url => {
                    contenido += `<p><a href="${url}" target="_blank">${url}</a></p>`;
                });
            }
            resultado.innerHTML = contenido;
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('resultado').innerHTML = '<p>Error al cargar los datos.</p>';
        });
}

// Prueba con un ID de juego
buscarJuego(25076);