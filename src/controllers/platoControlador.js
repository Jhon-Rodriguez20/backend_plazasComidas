const multer = require('multer');
const path = require('path');
const platoServicio = require('../services/platoServicio');
const { PlatoDatosResModel, PlatoActualizarReqModel } = require('../models/PlatoModelo');

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        const uploadsPath = path.join(__dirname, '../uploads/platos');
        callback(null, uploadsPath);
    },
    filename: (req, file, callback) => {
        const nombreImagen = file.originalname.replace(/\s+/g, '-').toLowerCase();
        callback(null, `${Date.now()}-${nombreImagen}`);
    }
});

const upload = multer({ storage: storage });
const subirImagen = upload.single('imagenPlato');

const postPlato = async (req, res) => {

    try {
        if(!req.user.error && req.user.rol === "2") {
            const {nombrePlato, precio, descripcion, restauranteId} = req.body;
            const urlImagen = req.file.filename;

            const plato = await platoServicio.crearPlato({ nombrePlato, precio, descripcion, restauranteId, urlImagen }, req.user.sub);
            res.status(201).json({ platoEntity: new PlatoDatosResModel(plato) });
        
        } else {
            res.status(401).json({ mensaje: 'El usuario no tiene permiso para realizar esta acción' });
        }

    } catch (error) {
        res.status(400).json({ mensaje: 'Error al crear el plato', error: error.message });
    }
}

const getPlatos = async (req, res) => {

    try {
        const arrayPlatos = await platoServicio.leerPlatos(req.params.id);
        const losPlatos = arrayPlatos.map(plato => new PlatoDatosResModel(plato));
        res.status(200).json({ platoEntity: losPlatos });

    } catch (error) {
        res.status(400).json({ mensaje: 'Error al leer los platos', error: error.message });
    }
}

const getDetallePlato = async (req, res)=> {

    try {
        const plato = await platoServicio.detallePlato(req.params.id);
        res.status(200).json({ platoEntity: new PlatoDatosResModel(plato) });

    } catch (error) {
        res.status(400).json({ mensaje: 'Error al leer el detalle del plato', error: error.message });
    }
}

const putPlato = async (req, res) => {

    try {
        if(!req.user.error && req.user.rol === "2") {
            const plato = await platoServicio.actualizarPlato(req.params.id, new PlatoActualizarReqModel(req.body), req.user.sub);
            res.status(200).json({ platoEntity: new PlatoDatosResModel(plato) })

        } else {
            res.status(401).json({ mensaje: 'El usuario no tiene permiso para realizar esta acción' });
        }

    } catch (error) {
        res.status(400).json({ mensaje: 'Error al actualizar el plato', error: error.message });
    }
}

const deletePlato = async (req, res) => {

    try {
        if(!req.user.error && req.user.rol === "2") {
            await platoServicio.eliminarPlato(req.params.id, req.user.sub);
            res.status(204).json({ mensaje: "Plato eliminado con éxito" })

        } else {
            res.status(401).json({ mensaje: 'El usuario no tienes permiso para realizar esta acción' });
        }

    } catch (error) {
        res.status(400).json({ mensaje: 'Error al eliminar el plato', error: error.message });
    }
}

module.exports = {subirImagen, postPlato, getPlatos, getDetallePlato, putPlato, deletePlato}