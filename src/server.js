const express = require('express');
const { conexionMysql } = require('./db/conexionDB');
const variables = require('./utils/variables');
const usuarioRolRepositorio = require('./db/repositorios/usuarioRolRepositorio');
const pedidoEstadoRepositorio = require('./db/repositorios/pedidoEstadoRepositorio');
const pedidoMetodoPago = require('./db/repositorios/pedidoMetodoPago');
const { configuracionSeguridad } = require('./security/configuracionSeguridad');
const path = require('path');
const fs = require('fs');

const app = express();

const PORT = variables.EXPRESS_PORT;
const HOST = variables.EXPRESS_HOST;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const crearCarpetaSiNoExiste = (ruta) => {
    if (!fs.existsSync(ruta)) {
        fs.mkdirSync(ruta, { recursive: true });
    }
}

const rutas = [
    'uploads/restaurantes',
    'uploads/platos',
    'uploads/usuarios',
];

rutas.forEach(ruta => {
    const rutaCompleta = path.join(__dirname, ruta);
    crearCarpetaSiNoExiste(rutaCompleta);
    app.use(`/${ruta}`, express.static(rutaCompleta));
});

configuracionSeguridad(app);

conexionMysql()
    .then(() => {
        app.listen(PORT, HOST, () => {
            console.log(`Escuchando por el servidor http://${HOST}:${PORT}`);
            usuarioRolRepositorio.crear().then(() => {})
            pedidoEstadoRepositorio.crear().then(() => {})
            pedidoMetodoPago.crear().then(() => {})
        });
    })
    .catch((err) => {
        console.error("Error al conectar a la base de datos: ", err);
        process.exit();
    });