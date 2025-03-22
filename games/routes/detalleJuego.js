const express = require('express');
const router = express.Router();
const igdbController = require('../controllers/igdbController');

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