const usuarioRepositorio = require('../db/repositorios/usuarioRepositorio');
const { UsuarioEntity } = require('../models/UsuarioModelo');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

const eliminarImagen = (imgPerfil) => {
    const defaultImage = 'sinImagenPerfil.jpg';
    if (imgPerfil !== defaultImage) {
        const filePath = path.join(__dirname, '../uploads/usuarios', imgPerfil);
        fs.unlink(filePath, () => {});
    }
}

const crearUsuario = async (usuario, idUsuario)=> {
        
    if(!usuario.nombre || !usuario.celular || !usuario.email ||
        !usuario.ocupacion || !usuario.descripcionTrabajo || 
        !usuario.password || !usuario.idRol) {
        throw new Error("Datos vacios o incorrectos");
    }

    const email = await usuarioRepositorio.buscarCorreo(usuario.email);
    if(email) throw new Error("El correo ya fue registrado.");

    const usuarioLogueado = await usuarioRepositorio.buscarUsuarioById(idUsuario);
    if (usuarioLogueado == null) throw new Error("No se encuentra el usuario");

    usuario.idUsuario = uuidv4();
    usuario.passwordEncp = bcrypt.hashSync(usuario.password, 10);
    usuario.idGerente = idUsuario;

    await usuarioRepositorio.crear(new UsuarioEntity(usuario));
    return await usuarioRepositorio.leerUsuario(usuario.idUsuario);

}

const actualizarDescripcion = async (idUsuario, usuario) => {

    if (!usuario.celular || !usuario.descripcionTrabajo) {
        throw new Error("Datos vacíos o incorrectos");
    }

    const usuarioLogueado = await usuarioRepositorio.buscarUsuarioById(idUsuario);
    const usuarioDetalle = await usuarioRepositorio.detalleUsuario(idUsuario);

    if (usuarioLogueado == null) throw new Error("No se encuentra el usuario");

    if (usuarioDetalle.idUsuario !== usuarioLogueado.idUsuario) {
        throw new Error('No se puede actualizar la descripción del usuario');
    }

    if (usuario.urlImagen && usuarioDetalle.urlImagen !== 'sinImagenPerfil.jpg') {
        eliminarImagen(usuarioDetalle.urlImagen);
    }

    usuarioDetalle.celular = usuario.celular;
    usuarioDetalle.descripcionTrabajo = usuario.descripcionTrabajo;
    
    if (usuario.urlImagen) {
        usuarioDetalle.urlImagen = usuario.urlImagen;
    }

    await usuarioRepositorio.actualizar(usuarioDetalle);
    return await usuarioRepositorio.leerUsuario(usuarioDetalle.idUsuario);
}

const leerMisRestaurantes = async (idUsuario)=> {
    
    const usuario = await usuarioRepositorio.buscarUsuarioById(idUsuario);
    if(usuario == null) throw new Error("No se encuentra el usuario");
        
    const restaurantes = await usuarioRepositorio.misRestaurantes(usuario.idUsuario);
    return restaurantes;

}

const leerMisGerentes = async (idUsuario, idRol)=> {

    const usuario = await usuarioRepositorio.buscarUsuarioById(idUsuario);
    if(usuario == null) throw new Error("No se encuentra el usuario");
        
    const propietarios = await usuarioRepositorio.misGerentes(usuario.idUsuario);
    return propietarios;
}

const leerMisEmpleados = async (idUsuario, idRol) => {

    const usuario = await usuarioRepositorio.buscarUsuarioById(idUsuario);
    if (usuario === null) throw new Error("No se encuentra el usuario");

    const empleados = await usuarioRepositorio.misEmpleados(usuario.idUsuario);
    return empleados;
}

const leerMisPlatos = async (idUsuario) => {

    const usuario = await usuarioRepositorio.buscarUsuarioById(idUsuario);
    if (usuario === null) throw new Error("No se encuentra el usuario");

    const platos = await platoRepositorio.misPlatos(usuario.idUsuario);
    return platos;
}

const leerMisPedidos = async (idUsuario) => {

    const usuario = await usuarioRepositorio.buscarUsuarioById(idUsuario);
    if (usuario === null) throw new Error("No se encuentra el usuario");

    const pedidos = await pedidoRepositorio.misPedidos(usuario.idUsuario);
    return pedidos;
}

const leerUsuarioLogin = async (correo) => {
    return await usuarioRepositorio.leerUsuarioLogin(correo);
}

module.exports = {crearUsuario, actualizarDescripcion, leerMisEmpleados, leerMisGerentes,
    leerMisPedidos, leerMisRestaurantes, leerUsuarioLogin, leerMisPlatos
}