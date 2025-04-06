const express = require('express');
const app = express();
const PORT = 3000;

//app.use(express.static('public'));

app.use(express.static('public'));

// Importa las rutas
const detallesJuegoRoutes = require('./routes/detalleJuego');

// Monta las rutas
app.use('/api/juego', detallesJuegoRoutes);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});