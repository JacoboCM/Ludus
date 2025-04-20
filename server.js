const express = require('express');
const app = express();
const PORT = 3000;
require("dotenv").config();

//app.use(express.static('public'));

app.use(express.static('public'));

// Importa las rutas
const detallesJuegoRoutes = require('./routes/detalleJuego');

// Monta las rutas
app.use('/api/juego', detallesJuegoRoutes);

// Secure endpoint to get TMDB API key
app.get("/api/config", (req, res) => {
  res.json({
    tmdbApiKey: process.env.TMDB_API_KEY,
  });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});