import { TMDB_API_KEY } from "../services/tmdbService";

document.addEventListener("DOMContentLoaded", () => {
  const input = document.querySelector("#input-buscador");
  const boton = document.querySelector("#btn-buscar");
  const resultados = document.querySelector("#resultados");

  boton.addEventListener("click", async () => {
    const query = input.value.trim();
    if (!query) return;

    const resultadosJuegos = document.querySelector("#resultados");
    let resultadosMultimedia = document.querySelector("#resultados-multimedia");

    if (!resultadosMultimedia) {
      resultadosMultimedia = document.createElement("div");
      resultadosMultimedia.id = "resultados-multimedia";
      resultadosMultimedia.classList.add("resultados");
      resultados.parentNode.insertBefore(
        resultadosMultimedia,
        resultados.nextSibling
      );
    }

    document
      .querySelectorAll("h3.resultado-titulo")
      .forEach((el) => el.remove());

    resultadosJuegos.innerHTML = "";
    resultadosMultimedia.innerHTML = "";

    try {
      // Buscar videojuegos
      const juegosResponse = await fetch(
        `/api/juego/buscar?nombre=${encodeURIComponent(query)}`
      );
      const juegos = await juegosResponse.json();

      if (juegos.length === 0) {
        resultadosJuegos.innerHTML = "<p>No se encontraron videojuegos.</p>";
      } else {
        const tituloJuegos = document.createElement("h3");
        tituloJuegos.textContent = "🎮 Videojuegos";
        tituloJuegos.classList.add("resultado-titulo");
        resultadosJuegos.before(tituloJuegos);

        juegos.forEach((juego) => {
          const item = document.createElement("div");
          item.classList.add("resultados-item");
          item.innerHTML = `
                        <a href="/games/detail.html?id=${juego.id}">
                            <img src="${
                              juego.cover || "/assets/placeholder.jpg"
                            }" alt="${juego.name}" />
                        </a>
                    `;
          resultadosJuegos.appendChild(item);
        });
      }

      // Buscar en TMDB
      const tmdbResponse = await fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&language=es-ES&query=${encodeURIComponent(
          query
        )}`
      );
      const tmdb = await tmdbResponse.json();

      if (tmdb.results.length === 0) {
        resultadosMultimedia.innerHTML =
          "<p>No se encontraron películas o series.</p>";
      } else {
        const tituloMultimedia = document.createElement("h3");
        tituloMultimedia.textContent = "🎬 Películas y Series";
        tituloMultimedia.classList.add("resultado-titulo");
        resultadosMultimedia.before(tituloMultimedia);

        // Mostrar resultados de TMDB
        const multimediaSection = document.getElementById(
          "resultados-multimedia"
        );
        multimediaSection.innerHTML = "";

        if (tmdb.results && tmdb.results.length > 0) {
          const multimediaGrid = document.createElement("div");
          multimediaGrid.className = "resultados-grid";

          tmdb.results.forEach((item) => {
            if (item.media_type === "movie" || item.media_type === "tv") {
              const card = document.createElement("div");
              card.className = "resultados-item";
              card.innerHTML = `
                <a href="/detail.html?id=${item.id}&type=${item.media_type}">
                  <img src="https://image.tmdb.org/t/p/w500${
                    item.poster_path
                  }" alt="${item.title || item.name}" />
                </a>
              `;
              multimediaGrid.appendChild(card);
            }
          });

          multimediaSection.appendChild(multimediaGrid);
        }
      }
    } catch (err) {
      console.error("Error al buscar:", err);
      resultadosJuegos.innerHTML = "<p>Error al buscar videojuegos.</p>";
      resultadosMultimedia.innerHTML =
        "<p>Error al buscar películas o series.</p>";
    }
  });
});
