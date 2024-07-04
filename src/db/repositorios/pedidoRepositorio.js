const conexion = require('../conexionDB.js');

const crear = async (pedido, detallesPedido) => {
    const connection = await conexion.conexionMysql();
    await connection.beginTransaction();

    try {
        const queryPedido = "INSERT INTO pedido SET ?";
        await connection.query(queryPedido, pedido);

        const queryDetalle = "INSERT INTO pedidoDetalle SET ?";
        for (const detalle of detallesPedido) {
            await connection.query(queryDetalle, detalle);
        }

        await connection.commit();

    } catch (error) {
        await connection.rollback();
        throw error;
        
    } finally {
        connection.release();
    }
}

const leer = async (idRestaurante) => {
    const connection = await conexion.conexionMysql();
    await connection.beginTransaction();

    try {
        const query = `
            SELECT
                pd.idPedido,
                pd.numeroPedido,
                pd.totalPagar,
                pd.idEstado,
                pd.fechaPedido,
                pd.idUsuario,
                pd.idRestaurante,
                us.nombre AS nombrePersona,
                us.celular,
                rest.razonSocial,
                dtPd.idDetalle,
                dtPd.idPlato,
                dtPd.cantidad,
                pdMp.idMetodoPago,
                pdMp.metodoPago,
                pl.nombrePlato,
                REPLACE(CONCAT('/uploads/platos/', REPLACE(pl.urlImagen, ' ', '_')), ' ', '_') AS imgPlato,
                pl.precio,
                pdEt.idEstado,
                pdEt.estado
            FROM pedidoDetalle AS dtPd
            JOIN pedido AS pd ON dtPd.idPedido = pd.idPedido
            JOIN pedidoEstado AS pdEt ON pd.idEstado = pdEt.idEstado
            JOIN pedidoMetodoPago AS pdMp ON pd.idMetodoPago = pdMp.idMetodoPago
            JOIN plato AS pl ON dtPd.idPlato = pl.idPlato
            JOIN usuario AS us ON pd.idUsuario = us.idUsuario
            JOIN restaurante AS rest ON pd.idRestaurante = rest.idRestaurante
            WHERE pd.idRestaurante = ?
            ORDER BY pd.fechaPedido ASC
        `;
        const [rows] = await connection.query(query, [idRestaurante]);

        await connection.commit();
        return rows;

    } catch (error) {
        await connection.rollback();
        throw error;

    } finally {
        connection.release();
    }
}

const detalle = async (idPedido) => {
    const connection = await conexion.conexionMysql();
    await connection.beginTransaction();

    try {
        const query = `
            SELECT
                pd.idPedido,
                pd.numeroPedido,
                pd.totalPagar,
                pd.idEstado,
                pd.fechaPedido,
                pd.idUsuario,
                pd.idRestaurante,
                us.nombre AS nombrePersona,
                us.celular,
                rest.razonSocial,
                dtPd.idDetalle,
                dtPd.idPlato,
                dtPd.cantidad,
                pdMp.idMetodoPago,
                pdMp.metodoPago,
                pl.nombrePlato,
                REPLACE(CONCAT('/uploads/platos/', REPLACE(pl.urlImagen, ' ', '_')), ' ', '_') AS imgPlato,
                pl.precio,
                pdEt.idEstado,
                pdEt.estado
            FROM pedidoDetalle AS dtPd
            JOIN pedido AS pd ON dtPd.idPedido = pd.idPedido
            JOIN pedidoEstado AS pdEt ON pd.idEstado = pdEt.idEstado
            JOIN pedidoMetodoPago AS pdMp ON pd.idMetodoPago = pdMp.idMetodoPago
            JOIN plato AS pl ON dtPd.idPlato = pl.idPlato
            JOIN usuario AS us ON pd.idUsuario = us.idUsuario
            JOIN restaurante AS rest ON pd.idRestaurante = rest.idRestaurante
            WHERE pd.idPedido = ?
        `;
        const [rows] = await connection.query(query, [idPedido]);

        await connection.commit();
        return rows;

    } catch (error) {
        await connection.rollback();
        throw error;

    } finally {
        connection.release();
    }
}

const detallePedido = async (idPedido) => {
    const connection = await conexion.conexionMysql();
    await connection.beginTransaction();

    try {
        const query = "SELECT idPedido, idUsuario, idEstado FROM pedido WHERE idPedido = ?";
        const [rows] = await connection.query(query, [idPedido]);

        await connection.commit();
        return rows[0];

    } catch (error) {
        await connection.rollback();
        throw error;

    } finally {
        connection.release();
    }
}

const actualizar = async (pedidoDetalle) => {
    const connection = await conexion.conexionMysql();
    await connection.beginTransaction();

    try {
        const query = "UPDATE pedido SET ? WHERE idPedido = ?";
        await connection.query(query, [pedidoDetalle, pedidoDetalle.idPedido]);
        await connection.commit();

    } catch (error) {
        await connection.rollback();
        throw error;

    } finally {
        connection.release();
    }
}

const eliminar = async (idPedido) => {
    const connection = await conexion.conexionMysql();
    await connection.beginTransaction();

    try {
        const query = "DELETE FROM pedido WHERE idPedido = ?";
        await connection.query(query, [idPedido]);
        await connection.commit();

    } catch (error) {
        await connection.rollback();
        throw error;

    } finally {
        connection.release();
    }
}

module.exports = { crear, leer, detalle, detallePedido, actualizar, eliminar }