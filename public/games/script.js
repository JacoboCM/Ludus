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

            if (data.similar_games) {
                contenido += `<p><strong>Juegos similares:</strong> ${data.similar_games}</p>`;
            }

            if (data.involved_companies) {
                contenido += `<p><strong>Compañias:</strong> ${data.involved_companies.join(', ')}</p>`;
            }

            if (data.game_engines) {
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

async function cargarSliderPrincipal() {
    try {
        const response = await fetch('/api/juego/slider-principal');
        const juegos = await response.json();
        const sliderContainer = document.getElementById('slider-principal');
        let sliderHTML = '';

        juegos.forEach(juego => {
            sliderHTML += `
            <div class="item">
                <a href="/games/detail.html?id=${juego.id}">
                    <img src="${juego.screenshot ? juego.screenshot : 'ruta/imagen-por-defecto.jpg'}" alt="${juego.name}" />
                </a>
                <p>${juego.name}</p>
            </div>
        `;
        });
        sliderContainer.innerHTML = sliderHTML;
    } catch (error) {
        console.error('Error al cargar el slider principal:', error);
    }
}

//document.addEventListener("DOMContentLoaded", cargarSliderPrincipal);

async function cargarTop10() {
    try {
        // Asegúrate de que la URL del fetch coincida con la ruta montada en tu servidor.
        const response = await fetch('/api/juego/top10');
        const top10Games = await response.json();
        console.log("Top 10 Games:", top10Games);

        const sliderContainer = document.getElementById('slider-top10');
        if (!sliderContainer) {
            console.error("No se encontró el contenedor slider-top10");
            return;
        }

        // Creamos un section que contendrá los items
        let sliderHTML = '';
        top10Games.forEach(game => {
            sliderHTML += `
                <div class="item">
                    <a href="/games/detail.html?id=${game.id}">
                        <img src="${game.cover ? game.cover : 'ruta/imagen-por-defecto.jpg'}" alt="${game.name}" />
                    </a>
                </div>
                `;
        });
        sliderContainer.innerHTML = sliderHTML;

        // Opcional: Aquí puedes inicializar la funcionalidad de desplazamiento o agregar eventos a las flechas
        // Por ejemplo, si usas una librería o tienes funciones propias para mover el slider.

    } catch (error) {
        console.error('Error al cargar Top 10:', error);
    }
}

async function cargarNuevos() {
    try {
        const response = await fetch('/api/juego/nuevos'); // O '/api/juegos/nuevos', según cómo montaste la ruta.
        const nuevosGames = await response.json();
        const sliderContainer = document.getElementById('slider-nuevos');
        let sliderHTML = '';

        nuevosGames.forEach(game => {
            sliderHTML += `
                <div class="item">
                    <a href="/games/detail.html?id=${game.id}">
                        <img src="${game.cover ? game.cover : 'ruta/imagen-por-defecto.jpg'}" alt="${game.name}" />
                    </a>
                </div>
            `;
        });
        sliderContainer.innerHTML = sliderHTML;
    } catch (error) {
        console.error('Error al cargar nuevos lanzamientos:', error);
    }
}

async function cargarProximos() {
    try {
        const response = await fetch('/api/juego/proximos');
        const proximosGames = await response.json();
        const sliderContainer = document.getElementById('slider-proximos');
        let sliderHTML = '';

        proximosGames.forEach(game => {
            sliderHTML += `
                <div class="item">
                    <a href="/games/detail.html?id=${game.id}">
                        <img src="${game.cover ? game.cover : 'ruta/imagen-por-defecto.jpg'}" alt="${game.name}" />
                    </a>
                </div>
            `;
        });
        sliderContainer.innerHTML = sliderHTML;
    } catch (error) {
        console.error('Error al cargar próximos lanzamientos:', error);
    }
}

function getQueryParam(param) {
    const params = new URLSearchParams(window.location.search);
    return params.get(param);
}

// Llamar a las funciones en DOMContentLoaded o al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    // Si existe el contenedor para el slider principal, cargar ese slider:
    if (document.getElementById("slider-principal")) {
        cargarSliderPrincipal();
    }
    
    // Si existen contenedores para top10, nuevos y próximos, cargarlos:
    if (document.getElementById("slider-top10")) {
        cargarTop10();
    }
    if (document.getElementById("slider-nuevos")) {
        cargarNuevos();
    }
    if (document.getElementById("slider-proximos")) {
        cargarProximos();
    }
    
    // Si la URL tiene un parámetro "id", se asume que se está en la página de detalle
    const gameId = getQueryParam("id");
    if (gameId && document.getElementById("resultado")) {
        buscarJuego(gameId);
    }
});

// Prueba con un ID de juego
//buscarJuego(25076);