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
                    <div class="video-container contenedor-blur">`;
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
                    <div class="detail-container contenedor-blur">
                        <h2 class="nombre-titulo">${data.name}</h2>
                        ${data.platforms ? `<p><strong>Plataformas:</strong> ${data.platforms.join(', ')}</p>` : ''}
                        ${data.first_release_date ? `<p><strong>Lanzamiento:</strong> ${data.first_release_date}</p>` : ''}
                        ${data.total_rating ? `
                            <div class="rating-container">
                                <p><strong>Votos:</strong> ${data.total_rating_count || 'No disponible'}</p>
                                <div class="rating-score">${Math.round(data.total_rating)}</div>
                                <div class="rating-bar">
                                    <div class="rating-fill verde" style="width: ${data.total_rating}%;"></div>
                                    <div class="rating-fill rojo" style="width: ${100 - data.total_rating}%;"></div>
                                </div>
                            </div>
                        ` : '<p>Puntuación: No disponible</p>'}
                        <p class="resumen">${data.summary}</p>
                        ${data.updated_at ? `<p class="ultima"><strong>Última actualización:</strong> ${data.updated_at}</p>` : ''}
                    </div>  <!-- Fin de details-container -->
                </div>  <!-- Fin de top-section -->
            `;

            contenido += `
                <div class="bottom-section contenedor-blur">
                    <p>${data.storyline}</p>
                    ${data.genres ? `<p><strong>Géneros:</strong> ${data.genres.join(', ')}</p>` : ''}
                    ${data.themes ? `<p><strong>Temas:</strong> ${data.themes}</p>` : ''}
                    ${data.game_modes ? `<p><strong>Modos de juego:</strong> ${data.game_modes}</p>` : ''}
                    ${data.involved_companies ? `<p><strong>Compañias:</strong> ${data.involved_companies.join(', ')}</p>` : ''}
                    ${data.game_engines ? `<p><strong>Motores:</strong> ${data.game_engines.join(', ')}</p>` : ''}

                    </div>  <!-- Fin de bottom-section -->
            `;

            if (data.screenshots && data.screenshots.length > 0) {
                let screenshotsHTML = `<div class="screenshots-container contenedor-blur">`;
                data.screenshots.forEach(screenshot => {
                    screenshotsHTML += `<img class="screenshot" src="${screenshot.url}" alt="Screenshot ${screenshot.id}" />`;
                });
                screenshotsHTML += `</div>`;
                contenido += screenshotsHTML;
                setTimeout(() => {
                    const screenshots = document.querySelectorAll(".screenshot");
                    screenshots.forEach(img => {
                        img.addEventListener("click", () => {
                            basicLightbox.create(`<img src="${img.src}" alt="${img.alt}" style="max-width: 90vw; max-height: 90vh;" />`).show();
                        });
                    });
                }, 0);
            }

            if (data.websites && data.websites.length > 0) {
                contenido += `
                <div class="webs-relacionadas contenedor-blur">
                    <h3>Sitios Web para más información</h3>
                    <ul>
                        ${data.websites.map(url => {
                            const dominio = url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0];
                            return `<li><a href="${url}" target="_blank">${dominio}</a></li>`;
                        }).join('')}
                    </ul>
                </div>
            `;
            }

            if (data.similar_games && data.similar_games.length > 0) {
                let sliderHTML = '';
                data.similar_games.forEach(game => {
                    const rating = game.total_rating || 0;
                    const formattedRating = Math.round(rating);
                    const releaseDate = game.first_release_date || 'Sin fecha';

                    if (game.cover) {
                        sliderHTML += `
                            <div class="item">
                                <a href="/games/detail.html?id=${game.id}">
                                    <img src="${game.cover}" alt="Cover similar" />
                                    <div class="info-slider">
                                        <h4 class="titulo-juego">${game.name}</h4>
                                        <p class="fecha-lanzamiento">📅 ${releaseDate}</p>
                                        <div class="rating-estrella">
                                            <span class="estrella">★</span> ${formattedRating}
                                        </div>
                                    </div>
                                </a>
                            </div>`;
                    }
                });

                const sliderWrapper = document.createElement('div');
                sliderWrapper.className = 'slider-wrapper';

                const sliderContainer = document.createElement('div');
                sliderContainer.className = 'wrapper';
                sliderContainer.id = 'slider-relacionados';
                sliderContainer.innerHTML = sliderHTML;

                const arrowLeft = document.createElement('button');
                arrowLeft.className = 'arrow-btn arrow-left';
                arrowLeft.textContent = '‹';

                const arrowRight = document.createElement('button');
                arrowRight.className = 'arrow-btn arrow-right';
                arrowRight.textContent = '›';

                sliderWrapper.appendChild(arrowLeft);
                sliderWrapper.appendChild(sliderContainer);
                sliderWrapper.appendChild(arrowRight);

                arrowLeft.addEventListener('click', () => {
                    sliderContainer.scrollBy({ left: -sliderContainer.clientWidth, behavior: 'smooth' });
                });

                arrowRight.addEventListener('click', () => {
                    sliderContainer.scrollBy({ left: sliderContainer.clientWidth, behavior: 'smooth' });
                });

                contenido += `<h3 class="titulo-slider">Juegos relacionados</h3>`;
                setTimeout(() => {
                    const contenedorSlider = document.createElement('div');
                    contenedorSlider.className = 'slider-similares';
                    document.getElementById('resultado').appendChild(contenedorSlider);
                    contenedorSlider.appendChild(sliderWrapper);
                }, 0);
            }

            resultado.innerHTML = contenido;
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('resultado').innerHTML = '<p>Error al cargar los datos.</p>';
        });
}

//Crea la barra de puntuación
function aplicarBarraDePuntuacion(puntuacion) {
    const barra = document.querySelector(".rating-bar");
    const verde = barra.querySelector(".rating-fill.verde");
    const rojo = barra.querySelector(".rating-fill.rojo");

    const porcentajeVerde = Math.min(puntuacion, 100);
    const porcentajeRojo = 100 - porcentajeVerde;

    verde.style.width = `${porcentajeVerde}%`;
    rojo.style.width = `${porcentajeRojo}%`;
}

// Cargar el slider principal
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
                // Actualiza el índice actual para el scroll automático
                currentIndex = index;
            });
        });

        // Scroll automático mejorado cada 5 segundos
        let currentIndex = 0;
        const slidesAuto = sliderContainer.querySelectorAll('.item');
        const dotsAuto = sliderContainer.nextElementSibling?.querySelectorAll('.dot');

        function goToSlide(index) {
            const scrollAmount = sliderContainer.clientWidth * index;
            sliderContainer.scrollTo({
                left: scrollAmount,
                behavior: 'smooth'
            });

            // Actualizar puntos activos
            if (dotsAuto && dotsAuto.length > 0) {
                dotsAuto.forEach(dot => dot.classList.remove('active'));
                if (dotsAuto[index]) dotsAuto[index].classList.add('active');
            }
        }

        setInterval(() => {
            currentIndex++;
            if (currentIndex >= slidesAuto.length) {
                // Ir al inicio sin animación para evitar el salto visual
                sliderContainer.scrollTo({ left: 0, behavior: 'auto' });
                currentIndex = 0;
                goToSlide(currentIndex); // reposiciona con animación suave
                return;
            }
            goToSlide(currentIndex);
        }, 5000);
    } catch (error) {
        console.error('Error al cargar el slider principal:', error);
    }
}

async function cargarTop10() {
    try {
        // Asegúrate de que la URL del fetch coincida con la ruta montada en tu servidor.
        const response = await fetch('/api/juego/top10');
        const top10Games = await response.json();

        const sliderContainer = document.getElementById('slider-top10');
        if (!sliderContainer) {
            console.error("No se encontró el contenedor slider-top10");
            return;
        }

        // Creamos un section que contendrá los items
        let sliderHTML = '';
        top10Games.forEach(game => {
            const rating = game.total_rating || 0;
            const formattedRating = Math.round(rating);
            const releaseDate = game.first_release_date || 'Sin fecha';

            sliderHTML += `
                <div class="item">
                    <a href="/games/detail.html?id=${game.id}">
                        <img src="${game.cover ? game.cover : 'ruta/imagen-por-defecto.jpg'}" alt="${game.name}" />
                        <div class="info-slider">
                            <h4 class="titulo-juego">${game.name}</h4>
                            <p class="fecha-lanzamiento">📅 ${releaseDate}</p>
                            <div class="rating-estrella">
                                <span class="estrella">★</span> ${formattedRating}
                            </div>
                        </div>
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
        console.error('Error al cargar Top 10:', error);
    }
}

async function cargarNuevos() {
    try {
        const response = await fetch('/api/juego/nuevos'); 
        const nuevosGames = await response.json();
        const sliderContainer = document.getElementById('slider-nuevos');
        let sliderHTML = '';

        nuevosGames.forEach(game => {
            const rating = game.total_rating || 0;
            const formattedRating = Math.round(rating);
            const releaseDate = game.first_release_date || 'Sin fecha';

            sliderHTML += `
                <div class="item">
                    <a href="/games/detail.html?id=${game.id}">
                        <img src="${game.cover ? game.cover : 'ruta/imagen-por-defecto.jpg'}" alt="${game.name}" />
                        <div class="info-slider">
                            <h4 class="titulo-juego">${game.name}</h4>
                            <p class="fecha-lanzamiento">📅 ${releaseDate}</p>
                            <div class="rating-estrella">
                                <span class="estrella">★</span> ${formattedRating}
                            </div>
                        </div>
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
            const rating = game.total_rating || 0;
            const formattedRating = Math.round(rating);
            const releaseDate = game.first_release_date || 'Sin fecha';

            sliderHTML += `
                <div class="item">
                    <a href="/games/detail.html?id=${game.id}">
                        <img src="${game.cover ? game.cover : 'ruta/imagen-por-defecto.jpg'}" alt="${game.name}" />
                        <div class="info-slider">
                            <h4 class="titulo-juego">${game.name}</h4>
                            <p class="fecha-lanzamiento">📅 ${releaseDate}</p>
                        </div>
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

// Nueva función: cargarTop10PorRuta
async function cargarTop10PorRuta(ruta, idContenedor) {
    try {
        const response = await fetch(ruta);
        const juegos = await response.json();
        console.log('Respuesta recibida para', ruta, juegos);
        const sliderContainer = document.getElementById(idContenedor);
        let sliderHTML = '';
        if (!Array.isArray(juegos)) {
            console.error("Respuesta inválida para", ruta, juegos);
            return;
        }
        juegos.forEach(game => {
            const rating = game.total_rating || 0;
            const formattedRating = Math.round(rating);
            const releaseDate = game.first_release_date || 'Sin fecha';

            sliderHTML += `
                <div class="item">
                    <a href="/games/detail.html?id=${game.id}">
                        <img src="${game.cover ? game.cover : 'ruta/imagen-por-defecto.jpg'}" alt="${game.name}" />
                        <div class="info-slider">
                            <h4 class="titulo-juego">${game.name}</h4>
                            <p class="fecha-lanzamiento">📅 ${releaseDate}</p>
                            <div class="rating-estrella">
                                <span class="estrella">★</span> ${formattedRating}
                            </div>
                        </div>
                    </a>
                </div>
            `;
        });
        sliderContainer.innerHTML = sliderHTML;

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
        console.error(`Error al cargar juegos de ${ruta}:`, error);
    }
}

async function cargarNuevosPorPlataforma(plataforma, idContenedor) {
    try {
        const response = await fetch(`/api/juego/exclusivos/${plataforma}`);
        const nuevosGames = await response.json();
        console.log('Respuesta recibida para', plataforma, nuevosGames);
        const sliderContainer = document.getElementById(idContenedor);
        let sliderHTML = '';
        if (!Array.isArray(nuevosGames)) {
            console.error("Respuesta inválida para", plataforma, nuevosGames);
            return;
        }
        nuevosGames.forEach(game => {
            const rating = game.total_rating || 0;
            const formattedRating = Math.round(rating);
            const releaseDate = game.first_release_date || 'Sin fecha';

            sliderHTML += `
                <div class="item">
                    <a href="/games/detail.html?id=${game.id}">
                        <img src="${game.cover ? game.cover : 'ruta/imagen-por-defecto.jpg'}" alt="${game.name}" />
                        <div class="info-slider">
                            <h4 class="titulo-juego">${game.name}</h4>
                            <p class="fecha-lanzamiento">📅 ${releaseDate}</p>
                            <div class="rating-estrella">
                                <span class="estrella">★</span> ${formattedRating}
                            </div>
                        </div>
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
        console.error(`Error al cargar nuevos de ${plataforma}:`, error);
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

    //Cargar top10 por ruta específica para PS5, XBOX+PC y Nintendo
    if (document.getElementById("slider-top-consola")) {
        cargarTop10PorRuta('/api/juego/top10/consola', 'slider-top-consola');
    }

    if (document.getElementById("slider-top-pc")) {
        cargarTop10PorRuta('/api/juego/top10/pc', 'slider-top-pc');
    }
/*
    if (document.getElementById("slider-top-nintendo")) {
        cargarTop10PorRuta('/api/juego/top10/nintendo', 'slider-top-nintendo');
    }
*/
    // Si la URL tiene un parámetro "id", se asume que se está en la página de detalle
    const gameId = getQueryParam("id");
    if (gameId && document.getElementById("resultado")) {
        buscarJuego(gameId);
    }
});

// Prueba con un ID de juego
//buscarJuego(25076);