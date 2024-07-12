const restauranteRepositorio = require('../db/repositorios/restauranteRepositorio');
const { v4: uuidv4 } = require('uuid');
const { RestauranteEntity } = require('../models/RestauranteModelo');

const crearRestaurante = async (restaurante)=> {

    if(!restaurante.razonSocial || !restaurante.nit || !restaurante.direccion ||
        !restaurante.telefono || !restaurante.idUsuario) {
        throw new Error("Datos vacios o incorrectos")
    }

    const nit = await restauranteRepositorio.buscarNit(restaurante.nit);

    if(nit) throw new Error("El NIT del restaurante ya está registrado.");

    restaurante.idRestaurante = uuidv4();

    await restauranteRepositorio.crear(new RestauranteEntity(restaurante));
    return await restauranteRepositorio.detalle(restaurante.idRestaurante);
}

const leerRestaurantes = async (page, pageSize) => {
    return await restauranteRepositorio.leer(page, pageSize);
}

const detalleRestaurante = async (idRestaurante)=> {
    const restaurantes = await restauranteRepositorio.detalle(idRestaurante);
    if(!restaurantes) throw new Error("No se encontró el detalle del restaurante");
    
    return await restauranteRepositorio.detalle(idRestaurante);
}

module.exports = {crearRestaurante, leerRestaurantes, detalleRestaurante}