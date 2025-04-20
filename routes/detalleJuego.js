const express = require('express');
const router = express.Router();
const igdbController = require('../controllers/igdbController');

router.get('/buscar', async (req, res) => {
    const nombre = req.query.nombre;
    if (!nombre) return res.status(400).json({ error: 'Nombre requerido' });

    try {
        const resultados = await igdbController.buscarJuegoPorNombre(nombre);
        res.json(resultados);
    } catch (error) {
        console.error('Error en la búsqueda:', error.message);
        res.status(500).json({ error: 'Error en la búsqueda de juegos' });
    }
});

router.get('/slider-principal', async (req, res) => {
    try {
        const sliderData = await igdbController.obtenerSliderPrincipal();
        res.json(sliderData);
    } catch (error) {
        console.error('Error en endpoint slider-principal:', error.message);
        res.status(500).json({ error: 'Error al obtener datos para el slider principal' });
    }
});

router.get('/top10', async (req, res) => {
    try {
        const top10 = await igdbController.obtenerTop10();
        res.json(top10);
    } catch (error) {
        console.error('Error en endpoint top10:', error.message);
        res.status(500).json({ error: 'Error al obtener Top 10' });
    }
});

router.get('/nuevos', async (req, res) => {
    try {
        const nuevos = await igdbController.obtenerNuevosLanzamientos();
        res.json(nuevos);
    } catch (error) {
        console.error('Error en endpoint nuevos lanzamientos:', error.message);
        res.status(500).json({ error: 'Error al obtener nuevos lanzamientos' });
    }
});

router.get('/proximos', async (req, res) => {
    try {
        const proximos = await igdbController.obtenerProximosLanzamientos();
        res.json(proximos);
    } catch (error) {
        console.error('Error en endpoint próximos lanzamientos:', error.message);
        res.status(500).json({ error: 'Error al obtener próximos lanzamientos' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const gameId = req.params.id;
        console.log(`Buscando juego con ID: ${gameId}`);
        // Llama a la función del controlador que se encarga de obtener y procesar el juego
        const juego = await igdbController.obtenerJuego(gameId);
        res.json(juego);
    } catch (error) {
        console.error('Error al obtener juego:', error.message);
        if (error.message === 'Juego no encontrado') {
            res.status(404).json({ error: 'Juego no encontrado' });
        } else {
            res.status(500).json({ error: 'Error al obtener datos del juego' });
        }
    }
});

module.exports = router;