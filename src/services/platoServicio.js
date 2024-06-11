const platoRepositorio = require('../db/repositorios/platoRepositorio');
const restauranteRepositorio = require('../db/repositorios/restauranteRepositorio');
const usuarioRepositorio = require('../db/repositorios/usuarioRepositorio');
const { PlatoEntity } = require('../models/PlatoModelo');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

const crearPlato = async (plato, idUsuario) => {

    if (!plato.nombrePlato || !plato.precio || !plato.descripcion ||
        !plato.urlImagen || !plato.restauranteId) {
        throw new Error("Datos vacíos o incorrectos");
    }

    const gerenteUsuario = await usuarioRepositorio.buscarUsuarioById(idUsuario);
    const gerentePerteneciente = await restauranteRepositorio.buscarGerenteRestaurante(idUsuario);

    if (gerenteUsuario == null) throw new Error("No se encuentra el usuario");

    if (gerentePerteneciente.idUsuario !== gerenteUsuario.idUsuario ||
        gerentePerteneciente.idRestaurante != plato.restauranteId) {
        throw new Error('No se puede crear el plato');
    }

    plato.idPlato = uuidv4();
    plato.idUsuario = idUsuario;
    plato.mostrado = "0";

    await platoRepositorio.crear(new PlatoEntity(plato));
    return await platoRepositorio.detalle(plato.idPlato);
}

const leerPlatos = async (idRestaurante) => {
    const platos = await platoRepositorio.leer(idRestaurante);
    if(platos.length === 0) throw new Error("No hay platos en este restaurante");

    return await platoRepositorio.leer(idRestaurante);
}

const detallePlato = async (idPlato) => {
    const plato = await platoRepositorio.detalle(idPlato);
    if(!plato) throw new Error("No se encontró el detalle del plato");

    return await platoRepositorio.detalle(idPlato);
}

const actualizarPlato = async (idPlato, plato, idUsuario) => {

    const platoUrl = await platoRepositorio.detalle(idPlato);
    const usuario = await usuarioRepositorio.buscarUsuarioById(idUsuario);
    const platoDetalle = await platoRepositorio.detallePlato(idPlato);

    if(!platoUrl) throw new Error("No se encontró el detalle del plato");

    if (!plato.precio || !plato.descripcion || !plato.mostrado) {
        throw new Error("Datos vacíos o incorrectos");
    }
    if (usuario == null) throw new Error("No se encuentra el usuario");

    platoDetalle.precio = plato.precio;
    platoDetalle.descripcion = plato.descripcion;
    platoDetalle.mostrado = plato.mostrado;

    await platoRepositorio.actualizar(platoDetalle);
    return await platoRepositorio.detalle(platoDetalle.idPlato);
}

const eliminarImagen = (imgPlato) => {
    const filePath = path.join(__dirname, '../uploads/platos', imgPlato);
    fs.unlink(filePath, () => {});
}

const eliminarPlato = async (idPlato, idUsuario)=> {

    const platoUrl = await platoRepositorio.detalle(idPlato);
    const usuario = await usuarioRepositorio.buscarUsuarioById(idUsuario);
    const platoDetalle = await platoRepositorio.detallePlato(idPlato);

    if (usuario == null) throw new Error("No se encuentra el usuario");
    if (!platoUrl) throw new Error("No se encontró el detalle del plato");

    eliminarImagen(platoDetalle.urlImagen);
    return await platoRepositorio.eliminar(platoDetalle.idPlato);
}

module.exports = {crearPlato, leerPlatos, detallePlato, actualizarPlato, eliminarPlato}