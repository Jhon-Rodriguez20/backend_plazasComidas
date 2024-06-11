class PedidoCrearReqModel {
    constructor(pedido) {
        this.totalPagar = pedido.totalPagar;
        this.idRestaurante = pedido.idRestaurante;
        this.idMetodoPago = pedido.idMetodoPago;
        this.detalles = pedido.detalles;
    }
}

class PedidoDatosResModel {
    constructor(pedido, detalles) {
        this.idPedido = pedido.idPedido;
        this.numeroPedido = pedido.numeroPedido;
        this.totalPagar = pedido.totalPagar;
        this.idEstado = pedido.idEstado;
        this.estado = pedido.estado;
        this.idMetodoPago = pedido.idMetodoPago;
        this.metodoPago = pedido.metodoPago;
        this.fechaPedido = pedido.fechaPedido;
        this.idRestaurante = pedido.idRestaurante;
        this.razonSocial = pedido.razonSocial;
        this.idUsuario = pedido.idUsuario;
        this.nombrePersona = pedido.nombrePersona;
        this.celular = pedido.celular;
        this.detalles = detalles.map(detalle => ({
            idDetalle: detalle.idDetalle,
            idPlato: detalle.idPlato,
            nombrePlato: detalle.nombrePlato,
            imgPlato: detalle.imgPlato,
            cantidad: detalle.cantidad,
            precio: detalle.precio
        }));
    }
}

class PedidoActualizarReqModel {
    constructor(pedido) {
        this.idEstado = pedido.idEstado;
    }
}

class PedidoEntity {
    constructor(pedido) {
        this.idPedido = pedido.idPedido;
        this.numeroPedido = pedido.numeroPedido;
        this.totalPagar = pedido.totalPagar;
        this.idEstado = pedido.idEstado;
        this.idMetodoPago = pedido.idMetodoPago;
        this.fechaPedido = pedido.fechaPedido;
        this.idRestaurante = pedido.idRestaurante;
        this.idUsuario = pedido.idUsuario;
    }
}

class DetallePedidoEntity {
    constructor(detalle) {
        this.idDetalle = detalle.idDetalle;
        this.idPedido = detalle.idPedido;
        this.idPlato = detalle.idPlato;
        this.cantidad = detalle.cantidad;
    }
}

module.exports = { PedidoCrearReqModel, PedidoDatosResModel, PedidoActualizarReqModel, PedidoEntity, DetallePedidoEntity }
