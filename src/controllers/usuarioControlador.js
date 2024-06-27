const respuestasHttp = require('../utils/respuestasHttp');
const usuarioServicio = require('../services/usuarioServicio');
const { UsuarioDatosResModel } = require('../models/UsuarioModelo');
const { RestauranteDatosResModel } = require('../models/RestauranteModelo');
const multer = require('multer');
const path = require('path');
const { PedidoDatosResModel } = require('../models/PedidoModelo');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadsPath = path.join(__dirname, '../uploads/usuarios');
        cb(null, uploadsPath);
    },
    filename: (req, file, cb) => {
        const nombreImagen = file.originalname.replace(/\s+/g, '-').toLowerCase();
        cb(null, `${Date.now()}-${nombreImagen}`);
    }
});

const upload = multer({ storage: storage });
const subirImagen = upload.single('imagenPerfil');

const postUsuario = async (req, res, tipoUsuario) => {
    
    try {
        if(!req.user.error) {
            const {nombre, celular, email, ocupacion, descripcionTrabajo, password, idRol} = req.body;
            const urlImagen = req.file ? req.file.filename : 'sinImagenPerfil.jpg';

            const usuario = await usuarioServicio.crearUsuario({nombre, celular, email, ocupacion, descripcionTrabajo, password, idRol, urlImagen}, req.user.sub);
            res.status(201).json({ usuarioEntity: new UsuarioDatosResModel(usuario) });
        
        } else {
            res.status(401).json({ mensaje: 'No tienes permiso para hacer esta petición' });
        }

    } catch (err) {
        res.status(400).json({ mensaje: 'Error al crear el usuario', error: err.message });
    }
}

const postUsuarioGerente = async (req, res) => {
    req.user.rol === "1" ? postUsuario(req, res, 'Gerente') : res.status(401).json({ mensaje: 'No tienes permiso para hacer esta petición' });
}

const postUsuarioEmpleado = async (req, res) => {
    req.user.rol === "2" ? postUsuario(req, res, 'Empleado') : res.status(401).json({ mensaje: 'No tienes permiso para hacer esta petición' });
}

const postUsuarioCliente = async (req, res) => {

    try {
        const { nombre, celular, email, ocupacion, descripcionTrabajo, password, idRol } = req.body;
        const urlImagen = req.file ? req.file.filename : 'sinImagenPerfil.jpg';

        const usuario = await usuarioServicio.crearUsuario({ nombre, celular, email, ocupacion, descripcionTrabajo, password, idRol, urlImagen });
        res.status(201).json({ usuarioEntity: new UsuarioDatosResModel(usuario) });

    } catch (err) {
        res.status(400).json({ mensaje: 'Error al crear el usuario', error: err.message });
    }
}

const putDescripcionUsuario = async (req, res) => {

    try {
        if(!req.user.error) {
            const { celular, descripcionTrabajo } = req.body;
            const urlImagen = req.file.filename;

            const usuario = await usuarioServicio.actualizarDescripcion(req.params.id, { celular, descripcionTrabajo, urlImagen }, req.user.sub);
            res.status(200).json({ usuarioEntity: new UsuarioDatosResModel(usuario) });
            
        } else {
            res.status(401).json({ mensaje: 'No tienes permiso para hacer esta petición' });
        }

    } catch (error) {
        res.status(400).json({ mensaje: 'Error al actualizar la descripción del usuario', error: error.message });
    }
}

const getMisGerentes = async (req, res) => {

    try {
        if(!req.user.error && req.user.rol === "1") {
            const gerentes = await usuarioServicio.leerMisGerentes(req.user.sub);
            const losGerentes = gerentes.map(gerente=> new UsuarioDatosResModel(gerente));
            res.status(200).json({ usuarioEntity: losGerentes });

        } else {
            res.status(401).json({ mensaje: 'No tienes permiso para hacer esta petición' });
        }

    } catch (err) {
        res.status(404).json({ mensaje: 'Error al leer mis gerentes', error: err.message });
    }
}

const getMisEmpleados = async (req, res) => {

    try {
        if(!req.user.error && req.user.rol === "2") {
            const empleados = await usuarioServicio.leerMisEmpleados(req.user.sub);
            const losEmpleados = empleados.map(empleado=> new UsuarioDatosResModel(empleado));
            res.status(200).json({ usuarioEntity: losEmpleados });

        } else {
            res.status(401).json({ mensaje: 'No tienes permiso para hacer esta petición' });
        }

    } catch (err) {
        res.status(404).json({ mensaje: 'Error al leer mis empleados', error: err.message });
    }
}

const getMisRestaurantes = async (req, res) => {

    try {
        if(!req.user.error && (req.user.rol === "2" || req.user.rol === "3")) {
            const restaurantes = await usuarioServicio.leerMisRestaurantes(req.user.sub);
            const losRestaurantes = restaurantes.map(restaurante=> new RestauranteDatosResModel(restaurante));
            res.status(200).json({ restauranteEntity: losRestaurantes });

        } else {
            res.status(401).json({ mensaje: 'No tienes permiso para hacer esta petición' });
        }

    } catch (err) {
        res.status(404).json({ mensaje: 'Error al leer mis restaurantes', error: err.message });
    }
}

const getMisPedidos = async (req, res) => {

    try {
        if(!req.user.error && (req.user.rol === "4")) {
            const pedidos = await usuarioServicio.leerMisPedidos(req.user.sub);
            res.status(200).json({ pedidoEntity: pedidos });

        } else {
            res.status(401).json({ mensaje: 'No tienes permiso para hacer esta petición' });
        }

    } catch (err) {
        res.status(404).json({ mensaje: 'Error al leer mis pedidos', error: err.message });
    }
}

const postSignin = (req, res) => {
    if (!req.user.error) {
        respuestasHttp.signin(req, res, "", 200);
    } else {
        res.status(404).json({ mensaje: 'Credenciales incorrectas. Por favor, vuelve a intentarlo' });
    }
}

module.exports = { subirImagen, postUsuarioGerente, postUsuarioEmpleado, postUsuarioCliente,
    putDescripcionUsuario, getMisGerentes, getMisEmpleados, getMisRestaurantes, getMisPedidos, postSignin
}