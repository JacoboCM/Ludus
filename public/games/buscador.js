document.addEventListener('DOMContentLoaded', () => {
    const input = document.querySelector('#input-buscador');
    const boton = document.querySelector('#btn-buscar');
    const resultados = document.querySelector('#resultados');

    boton.addEventListener('click', async () => {
        const query = input.value.trim();
        if (!query) return;

        try {
            const response = await fetch(`/api/juego/buscar?nombre=${encodeURIComponent(query)}`);
            const juegos = await response.json();

            resultados.innerHTML = ''; // Limpiar resultados anteriores

            if (juegos.length === 0) {
                resultados.innerHTML = '<p>No se encontraron resultados.</p>';
                return;
            }

            juegos.forEach(juego => {
                const item = document.createElement('div');
                item.classList.add('resultados-item');

                item.innerHTML = `
                    <a href="/games/detail.html?id=${juego.id}">
                        <img src="${juego.cover || '/assets/placeholder.jpg'}" alt="${juego.name}" />
                        <p>${juego.name}</p>
                    </a>
                `;

                resultados.appendChild(item);
            });
        } catch (err) {
            console.error('Error al buscar:', err);
            resultados.innerHTML = '<p>Ocurrió un error al buscar el juego.</p>';
        }
    });
});
