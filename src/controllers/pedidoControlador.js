const pedidoServicio = require('../services/pedidoServicio');
const { PedidoCrearReqModel, PedidoDatosResModel, PedidoActualizarReqModel } = require('../models/PedidoModelo');

const postPedido = async (req, res) => {
    
    try {
        if (!req.user.error && req.user.rol === "4") {
            const pedido = await pedidoServicio.crearPedido(new PedidoCrearReqModel(req.body), req.user.sub, req.body.detalles);
            res.status(201).json({ pedidoEntity: pedido });
        } else {
            res.status(401).json({ mensaje: 'El usuario no tiene permiso para realizar esta acción' });
        }

    } catch (error) {
        res.status(400).json({ mensaje: 'Error al realizar el pedido', error: error.message });
    }
}

const getPedidos = async (req, res) => {

    try {
        if (!req.user.error && req.user.rol === "3") {
            const pedidos = await pedidoServicio.leerPedidos(req.params.id, req.user.sub);
            res.status(200).json({ pedidoEntity: pedidos });

        } else {
            res.status(401).json({ mensaje: 'El usuario no tiene permiso para realizar esta acción' });
        }

    } catch (error) {
        res.status(404).json({ mensaje: 'Error al leer los pedidos', error: error.message });
    }
}

const getDetallePedido = async (req, res) => {

    try {
        if (!req.user.error && (req.user.rol === "3" || req.user.rol === "4")) {
            const pedido = await pedidoServicio.detallePedido(req.params.id, req.user.sub);
            res.status(200).json({ pedidoEntity: pedido });

        } else {
            res.status(401).json({ mensaje: 'El usuario no tiene permiso para realizar esta acción' });
        }
    } catch (error) {
        res.status(404).json({ mensaje: 'Error al leer el detalle del pedido', error: error.message });
    }
}

const putPedido = async (req, res) => {

    try {
        if(!req.user.error && req.user.rol === "3") {
            const pedido = await pedidoServicio.actualizarPedido(req.params.id, new PedidoActualizarReqModel(req.body), req.user.sub);
            res.status(200).json({ pedidoEntity: pedido });
        } else {
            res.status(401).json({ mensaje: 'El usuario no tiene permiso para realizar esta acción' });
        }
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al actualizar el estado del pedido', error: error.message });
    }
}


const deletePedido = async (req, res) => {

    try {
        if(!req.user.error && req.user.rol === "4") {
            await pedidoServicio.eliminarPedido(req.params.id, req.user.sub);
            res.status(204).json({ mensaje: "Pedido cancelado con éxito" })

        } else {
            res.status(401).json({ mensaje: 'El usuario no tiene permiso para realizar esta acción' });
        }

    } catch (error) {
        res.status(400).json({ mensaje: 'Error al cancelar el pedido', error: error.message });
    }
}

module.exports = { postPedido, getPedidos, getDetallePedido, putPedido, deletePedido }