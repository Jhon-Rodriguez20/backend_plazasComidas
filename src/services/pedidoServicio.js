const pedidoRepositorio = require('../db/repositorios/pedidoRepositorio');
const platoRepositorio = require('../db/repositorios/platoRepositorio');
const usuarioRepositorio = require('../db/repositorios/usuarioRepositorio');
const { PedidoEntity, DetallePedidoEntity, PedidoDatosResModel } = require('../models/PedidoModelo');
const { v4: uuidv4 } = require('uuid');

function generarNumeroPedido(longitud) {
    const min = 10 ** (longitud - 1);
    const max = 10 ** longitud - 1;
    const numeroAleatorio = Math.floor(Math.random() * (max - min + 1)) + min;
    return numeroAleatorio.toString().padStart(longitud, '0');
}

const crearPedido = async (pedido, idUsuario, detallesPedido) => {
    if (!pedido.totalPagar || !pedido.idMetodoPago || !pedido.idRestaurante ||
        !detallesPedido || detallesPedido.length === 0) {
        throw new Error("Detalles del pedido vacíos o incorrectos");
    }

    const usuario = await usuarioRepositorio.buscarUsuarioById(idUsuario);
    if(usuario == null) throw new Error("No se encuentra el usuario");

    const idPlatos = detallesPedido.map(detalles => detalles.idPlato);
    const platos = await platoRepositorio.buscarPlatosRestaurante(idPlatos);

    const restauranteInvalido = platos.some(plato => plato.restauranteId !== pedido.idRestaurante);
    if (restauranteInvalido) {
        throw new Error("Uno o más platos no pertenecen al restaurante especificado.");
    }

    pedido.idPedido = uuidv4();
    pedido.numeroPedido = generarNumeroPedido(6);
    pedido.idEstado = "0";
    pedido.fechaPedido = new Date();
    pedido.idEstado = "1";
    pedido.idUsuario = idUsuario;

    const pedidoEntity = new PedidoEntity(pedido);

    const detallesPedidoEntities = detallesPedido.map(detalle => {
        return new DetallePedidoEntity({
            idDetalle: uuidv4(),
            idPedido: pedido.idPedido,
            idPlato: detalle.idPlato,
            cantidad: detalle.cantidad
        });
    });

    await pedidoRepositorio.crear(pedidoEntity, detallesPedidoEntities);
    const pedidoDetalles = await pedidoRepositorio.detalle(pedido.idPedido);
    
    const pedidoData = {
        ...pedidoDetalles[0],
        detalles: pedidoDetalles.map(detalle => ({
            idDetalle: detalle.idDetalle,
            idPlato: detalle.idPlato,
            nombrePlato: detalle.nombrePlato,
            imgPlato: detalle.imgPlato,
            cantidad: detalle.cantidad,
        }))
    }

    return new PedidoDatosResModel(pedidoData, pedidoData.detalles);
}

const leerPedidos = async (idRestaurante, idUsuario, page, pageSize) => {
    const { rows, total } = await pedidoRepositorio.leer(idRestaurante, page, pageSize);
    const usuario = await usuarioRepositorio.buscarUsuarioById(idUsuario);
    if(usuario == null) throw new Error("No se encuentra el usuario");

    const pedidosMap = new Map();

    rows.forEach(detalle => {
        if (!pedidosMap.has(detalle.idPedido)) {
            pedidosMap.set(detalle.idPedido, {
                idPedido: detalle.idPedido,
                numeroPedido: detalle.numeroPedido,
                totalPagar: detalle.totalPagar,
                idEstado: detalle.idEstado,
                estado: detalle.estado,
                idMetodoPago: detalle.idMetodoPago,
                metodoPago: detalle.metodoPago,
                fechaPedido: detalle.fechaPedido,
                idUsuario: detalle.idUsuario,
                idRestaurante: detalle.idRestaurante,
                nombrePersona: detalle.nombrePersona,
                celular: detalle.celular,
                razonSocial: detalle.razonSocial,
                detalles: []
            });
        }

        pedidosMap.get(detalle.idPedido).detalles.push({
            idDetalle: detalle.idDetalle,
            idPlato: detalle.idPlato,
            nombrePlato: detalle.nombrePlato,
            imgPlato: detalle.imgPlato,
            cantidad: detalle.cantidad,
            precio: detalle.precio
        });
    });

    const pedidosData = Array.from(pedidosMap.values()).map(pedido => new PedidoDatosResModel(pedido, pedido.detalles));
    return { pedidos: pedidosData, total };
}

const detallePedido = async (idPedido, idUsuario) => {
    const pedidoDetalles = await pedidoRepositorio.detalle(idPedido);
    const usuario = await usuarioRepositorio.buscarUsuarioById(idUsuario);

    if (pedidoDetalles.length === 0) throw new Error("Pedido no encontrado");
    if (usuario == null) throw new Error("No se encuentra el usuario");

    const pedidoData = {
        ...pedidoDetalles[0],
        detalles: pedidoDetalles.map(detalle => ({
            idDetalle: detalle.idDetalle,
            idPlato: detalle.idPlato,
            nombrePlato: detalle.nombrePlato,
            imgPlato: detalle.imgPlato,
            cantidad: detalle.cantidad,
            precio: detalle.precio
        }))
    }

    return new PedidoDatosResModel(pedidoData, pedidoData.detalles);
}

const actualizarPedido = async (idPedido, pedido, idUsuario) => {
    if (!pedido.idEstado) {
        throw new Error("Datos vacíos o incorrectos");
    }

    const pedidoDetalle = await pedidoRepositorio.detallePedido(idPedido);
    const usuario = await usuarioRepositorio.buscarUsuarioById(idUsuario);

    if (!pedidoDetalle) throw new Error("Pedido no encontrado");
    if (usuario == null) throw new Error("No se encuentra el usuario");

    pedidoDetalle.idEstado = pedido.idEstado;
    await pedidoRepositorio.actualizar(pedidoDetalle);

    const pedidoActualizadoDetalles = await pedidoRepositorio.detalle(idPedido);
    if (!pedidoActualizadoDetalles) {
        throw new Error("Error al recuperar el pedido actualizado");
    }

    const pedidoActualizadoData = {
        ...pedidoActualizadoDetalles[0],
        detalles: pedidoActualizadoDetalles.map(detalle => ({
            idDetalle: detalle.idDetalle,
            idPlato: detalle.idPlato,
            nombrePlato: detalle.nombrePlato,
            imgPlato: detalle.imgPlato,
            cantidad: detalle.cantidad,
            precio: detalle.precio
        }))
    }

    return new PedidoDatosResModel(pedidoActualizadoData, pedidoActualizadoData.detalles);
}

const eliminarPedido = async (idPedido, idUsuario) => {
    
    const pedidoDetalle = await pedidoRepositorio.detallePedido(idPedido);
    const usuario = await usuarioRepositorio.buscarUsuarioById(idUsuario);

    if (usuario == null) throw new Error("No se encuentra el usuario");

    if (pedidoDetalle.idUsuario !== usuario.idUsuario) throw new Error("No se puede cancelar el pedido");
    
    if (pedidoDetalle.idEstado > 1) throw new Error("No se puede cancelar el pedido en preparación");
    

    return await pedidoRepositorio.eliminar(pedidoDetalle.idPedido);
}

module.exports = { crearPedido, leerPedidos, detallePedido, actualizarPedido, eliminarPedido }