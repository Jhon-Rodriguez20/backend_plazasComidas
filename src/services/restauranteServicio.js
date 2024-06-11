const restauranteRepositorio = require('../db/repositorios/restauranteRepositorio');
const { v4: uuidv4 } = require('uuid');
const { RestauranteEntity } = require('../models/RestauranteModelo');

const crearRestaurante = async (restaurante)=> {

    if(!restaurante.razonSocial || !restaurante.nit || !restaurante.direccion ||
        !restaurante.telefono || !restaurante.idUsuario) {
        throw new Error("Datos vacios o incorrectos")
    }

    const nit = await restauranteRepositorio.buscarNit(restaurante.nit);

    if(nit) throw new Error("El NIT del restaurante ya está registrado.")

    restaurante.idRestaurante = uuidv4();

    await restauranteRepositorio.crear(new RestauranteEntity(restaurante));
    return await restauranteRepositorio.detalle(restaurante.idRestaurante);
}

const leerRestaurantes = async ()=> {
    const restaurantes = await restauranteRepositorio.leer();
    if(restaurantes.length === 0) throw new Error("No hay restaurantes");

    return await restauranteRepositorio.leer();
}

const detalleRestaurante = async (idRestaurante)=> {
    const restaurantes = await restauranteRepositorio.detalle(idRestaurante);
    if(!restaurantes) throw new Error("No se encontró el detalle del restaurante");
    
    return await restauranteRepositorio.detalle(idRestaurante);
}

module.exports = {crearRestaurante, leerRestaurantes, detalleRestaurante}