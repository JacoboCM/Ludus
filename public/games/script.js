function buscarJuego(id) {
    fetch(`/api/juego/${id}`)
        .then(response => response.json())
        .then(data => {
            const resultado = document.getElementById('resultado');

            if (data.error) {
                resultado.innerHTML = `<p>${data.error}</p>`;
                return;
            }

            let contenido = "";

            /*
            if (data.cover) {
                contenido += `<img src="${data.cover}" alt="Portada del juego">`;
            }
            */
            contenido += `
                <div class="top-section">
                    <div class="video-container">`;
            if (data.videos && data.videos.length > 0) {
                data.videos.forEach(video => {
                    contenido += `
                            <iframe width="780" height="450"
                                src="${video.url}?autoplay=1&mute=1"
                                frameborder="0"
                                allow="accelerometer; autoplay; mute; encrypted-media; gyroscope; picture-in-picture"
                                referrerpolicy="no-referrer"
                                allowfullscreen>
                            </iframe>
                        `;
                });
            } else {
                contenido += `<p><strong>Videos:</strong> No disponibles</p>`;
            }

            contenido += `
                    </div>  <!-- Fin de video-container -->
                    <div class="detail-container">
                        <h2 class="nombre-titulo">${data.name}</h2>
                        ${data.platforms ? `<p><strong>Plataformas:</strong> ${data.platforms.join(', ')}</p>` : ''}
                        ${data.first_release_date ? `<p><strong>Lanzamiento:</strong> ${data.first_release_date}</p>` : ''}
                        <p class="resumen">${data.summary || 'No disponible'}</p>
                        <p>${data.total_rating || 'No disponible'}</p>
                        <p><strong>Votos:</strong> ${data.total_rating_count || 'No disponible'}</p>
                    </div>  <!-- Fin de details-container -->
                </div>  <!-- Fin de top-section -->
            `;

            contenido += `
                <div class="bottom-section">
                    ${data.updated_at ? `<p><strong>Última actualización:</strong> ${data.updated_at}</p>` : ''}
                    <p> ${data.storyline || 'No disponible'}</p>
                    ${data.genres ? `<p><strong>Géneros:</strong> ${data.genres.join(', ')}</p>` : ''}
                    ${data.themes ? `<p><strong>Temas:</strong> ${data.themes}</p>` : ''}
                    ${data.game_modes ? `<p><strong>Modos de juego:</strong> ${data.game_modes}</p>` : ''}
                    ${data.involved_companies ? `<p><strong>Compañias:</strong> ${data.involved_companies.join(', ')}</p>` : ''}
                    ${data.game_engines ? `<p><strong>Motores:</strong> ${data.game_engines.join(', ')}</p>` : ''}

                    </div>  <!-- Fin de bottom-section -->
            `;

            if (data.screenshots && data.screenshots.length > 0) {
                let screenshotsHTML = `<div class="screenshots-container">`;
                data.screenshots.forEach(screenshot => {
                    screenshotsHTML += `<img class="screenshot" src="${screenshot.url}" alt="Screenshot ${screenshot.id}" />`;
                });
                screenshotsHTML += `</div>`;
                contenido += screenshotsHTML;
            }

            if (data.websites && data.websites.length > 0) {
                contenido += `<h3>Sitios Web para más información</h3>`;
                data.websites.forEach(url => {
                    contenido += `<p><a href="${url}" target="_blank">${url}</a></p>`;
                });
            }

            if (data.similar_games && data.similar_games.length > 0) {
                let similaresHTML = 
                    `<div class="slider-similares">
                        <div class="wrapper">
                    `;
                data.similar_games.forEach(game => {
                    if (game.cover) {
                        similaresHTML += `
                            <div class="item">
                                <a href="/games/detail.html?id=${game.id}">
                                    <img src="${game.cover}" alt="Cover similar" />
                                </a>
                            </div>`;
                    }
                });
                similaresHTML += 
                        `</div>
                    </div>`;
                contenido += similaresHTML;
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
        // Crear puntos de navegación
        const dotsContainer = document.createElement('div');
        dotsContainer.classList.add('slider-dots');
        juegos.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dotsContainer.appendChild(dot);
        });
        sliderContainer.after(dotsContainer);
        //Los puntos hacen scroll al slide correspondiente
        const slides = sliderContainer.querySelectorAll('.item');
        const dots = dotsContainer.querySelectorAll('.dot');

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                // Calcula el desplazamiento del slider
                const scrollAmount = sliderContainer.clientWidth * index;
                sliderContainer.scrollTo({
                    left: scrollAmount,
                    behavior: 'smooth'
                });

                // Actualiza la clase 'active'
                dots.forEach(d => d.classList.remove('active'));
                dot.classList.add('active');
            });
        });
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
        // Crear botones de flechas
        const arrowLeft = document.createElement('button');
        arrowLeft.className = 'arrow-btn arrow-left';
        arrowLeft.textContent = '‹';

        const arrowRight = document.createElement('button');
        arrowRight.className = 'arrow-btn arrow-right';
        arrowRight.textContent = '›';

        const sliderWrapper = document.createElement('div');
        sliderWrapper.className = 'slider-wrapper';
        sliderContainer.parentElement.insertBefore(sliderWrapper, sliderContainer);
        sliderWrapper.appendChild(arrowLeft);
        sliderWrapper.appendChild(sliderContainer);
        sliderWrapper.appendChild(arrowRight);

        arrowLeft.addEventListener('click', () => {
            sliderContainer.scrollBy({ left: -sliderContainer.clientWidth, behavior: 'smooth' });
        });

        arrowRight.addEventListener('click', () => {
            sliderContainer.scrollBy({ left: sliderContainer.clientWidth, behavior: 'smooth' });
        });

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
        // Crear botones de flechas
        const arrowLeft = document.createElement('button');
        arrowLeft.className = 'arrow-btn arrow-left';
        arrowLeft.textContent = '‹';

        const arrowRight = document.createElement('button');
        arrowRight.className = 'arrow-btn arrow-right';
        arrowRight.textContent = '›';

        const sliderWrapper = document.createElement('div');
        sliderWrapper.className = 'slider-wrapper';
        sliderContainer.parentElement.insertBefore(sliderWrapper, sliderContainer);
        sliderWrapper.appendChild(arrowLeft);
        sliderWrapper.appendChild(sliderContainer);
        sliderWrapper.appendChild(arrowRight);

        arrowLeft.addEventListener('click', () => {
            sliderContainer.scrollBy({ left: -sliderContainer.clientWidth, behavior: 'smooth' });
        });

        arrowRight.addEventListener('click', () => {
            sliderContainer.scrollBy({ left: sliderContainer.clientWidth, behavior: 'smooth' });
        });
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
        // Crear botones de flechas
        const arrowLeft = document.createElement('button');
        arrowLeft.className = 'arrow-btn arrow-left';
        arrowLeft.textContent = '‹';

        const arrowRight = document.createElement('button');
        arrowRight.className = 'arrow-btn arrow-right';
        arrowRight.textContent = '›';

        const sliderWrapper = document.createElement('div');
        sliderWrapper.className = 'slider-wrapper';
        sliderContainer.parentElement.insertBefore(sliderWrapper, sliderContainer);
        sliderWrapper.appendChild(arrowLeft);
        sliderWrapper.appendChild(sliderContainer);
        sliderWrapper.appendChild(arrowRight);

        arrowLeft.addEventListener('click', () => {
            sliderContainer.scrollBy({ left: -sliderContainer.clientWidth, behavior: 'smooth' });
        });

        arrowRight.addEventListener('click', () => {
            sliderContainer.scrollBy({ left: sliderContainer.clientWidth, behavior: 'smooth' });
        });
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