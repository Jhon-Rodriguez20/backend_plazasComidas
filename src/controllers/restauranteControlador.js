const restauranteServicio = require('../services/restauranteServicio');
const { RestauranteDatosResModel } = require('../models/RestauranteModelo');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadsPath = path.join(__dirname, '../uploads/restaurantes');
        cb(null, uploadsPath);
    },
    filename: (req, file, cb) => {
        const nombreImagen = file.originalname.replace(/\s+/g, '-').toLowerCase();
        cb(null, `${Date.now()}-${nombreImagen}`);
    }
});

const upload = multer({ storage: storage });
const subirImagen = upload.single('imagenRestaurante');

const postRestaurante = async (req, res) => {

    try {
        if(!req.user.error && req.user.rol === "1") {
            const {razonSocial, nit, direccion, telefono, idUsuario} = req.body;
            const urlImagen = req.file.filename;
            
            const restaurante = await restauranteServicio.crearRestaurante({ razonSocial, nit, direccion, telefono, urlImagen, idUsuario });
            res.status(201).json({ restauranteEntity: new RestauranteDatosResModel(restaurante) });

        } else {
            res.status(401).json({ mensaje: 'No tienes permiso para hacer esta petición' });
        }

    } catch (err) {
        res.status(400).json({ mensaje: 'Error al crear el restaurante', error: err.message });
    }
}

const getRestaurantes = async (req, res)=> {
    
    try {
        const restaurantes = await restauranteServicio.leerRestaurantes();
        const losRestaurantes = restaurantes.map(restaurante => new RestauranteDatosResModel(restaurante));
        res.status(200).json({ restauranteEntity: losRestaurantes });

    } catch (err) {
        res.status(404).json({ mensaje: 'Error al leer los restaurantes', error: err.message });
    }
}

const getDetalleRestaurante = async (req, res)=> {
    
    try {
        const restaurante = await restauranteServicio.detalleRestaurante(req.params.id);
        res.status(200).json({ restauranteEntity: new RestauranteDatosResModel(restaurante) });

    } catch (err) {
        res.status(404).json({ mensaje: 'Error al leer el detalle del restaurante', error: err.message });
    }
}

module.exports = {subirImagen, postRestaurante, getRestaurantes, getDetalleRestaurante}