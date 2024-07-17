const conexion = require('../conexionDB.js');

const crear = async (plato) => {
    const connection = await conexion.conexionMysql();
    await connection.beginTransaction();

    try {
        const query = "INSERT INTO plato SET ?";
        await connection.query(query, plato);
        await connection.commit();

    } catch (error) {
        await connection.rollback();
        throw error;

    } finally {
        connection.release();
    }
}

const leer = async (idRestaurante, page, pageSize) => {
    const connection = await conexion.conexionMysql();
    await connection.beginTransaction();

    try {
        const offset = (page - 1) * pageSize;
        const query = `
            SELECT
                pl.idPlato,
                pl.nombrePlato,
                pl.precio,
                pl.descripcion AS descPlato,
                pl.mostrado,
                REPLACE(CONCAT('/uploads/platos/', REPLACE(pl.urlImagen, ' ', '_')), ' ', '_') AS imgPlato,
                pl.restauranteId,
                rest.idRestaurante,
                rest.razonSocial AS nombreRestaurante
            FROM plato AS pl
            JOIN restaurante AS rest ON pl.restauranteId = rest.idRestaurante
            WHERE pl.restauranteId = ?
            LIMIT ?, ?`;

        const [rows] = await connection.query(query, [idRestaurante, offset, pageSize]);
        const countQuery = `SELECT COUNT(*) as total FROM plato WHERE restauranteId = ?`;
        const [countRows] = await connection.query(countQuery, [idRestaurante]);
        const total = countRows[0].total;

        await connection.commit();
        return { rows, total };

    } catch (error) {
        await connection.rollback();
        throw error;

    } finally {
        connection.release();
    }
}

const detalle = async (idPlato) => {
    const connection = await conexion.conexionMysql();
    await connection.beginTransaction();

    try {
        const query = `
            SELECT
                pl.idPlato,
                pl.nombrePlato,
                pl.precio,
                pl.descripcion AS descPlato,
                pl.mostrado,
                REPLACE(CONCAT('/uploads/platos/', REPLACE(pl.urlImagen, ' ', '_')), ' ', '_') AS imgPlato,
                pl.restauranteId,
                rest.idRestaurante,
                rest.razonSocial AS nombreRestaurante
            FROM plato AS pl 
            JOIN restaurante AS rest ON pl.restauranteId = rest.idRestaurante 
            WHERE pl.idPlato = ?`;
        const [rows] = await connection.query(query, [idPlato]);
        await connection.commit();
        return rows[0];

    } catch (error) {
        await connection.rollback();
        throw error;

    } finally {
        connection.release();
    }
}

const detallePlato = async (idPlato) => {
    const connection = await conexion.conexionMysql();
    await connection.beginTransaction();

    try {
        const query = "SELECT idPlato, restauranteId, urlImagen FROM plato WHERE idPlato = ?";
        const [rows] = await connection.query(query, [idPlato]);

        await connection.commit();
        return rows[0];

    } catch (error) {
        await connection.rollback();
        throw error;

    } finally {
        connection.release();
    }
}

const actualizar = async (platoDetalle) => {
    const connection = await conexion.conexionMysql();
    await connection.beginTransaction();

    try {
        const query = "UPDATE plato SET ? WHERE idPlato = ?";
        await connection.query(query, [platoDetalle, platoDetalle.idPlato]);
        await connection.commit();

    } catch (error) {
        await connection.rollback();
        throw error;

    } finally {
        connection.release();
    }
}

const eliminar = async (idPlato) => {
    const connection = await conexion.conexionMysql();
    await connection.beginTransaction();

    try {
        const query = "DELETE FROM plato WHERE idPlato = ?";
        await connection.query(query, [idPlato]);
        await connection.commit();

    } catch (error) {
        await connection.rollback();
        throw error;
        
    } finally {
        connection.release();
    }
}

const buscarPlatosRestaurante = async (idPlatos) => {
    const connection = await conexion.conexionMysql();
    await connection.beginTransaction();

    try {
        const query = `SELECT idPlato, restauranteId FROM plato WHERE idPlato IN (?)`;
        const [rows] = await connection.query(query, [idPlatos]);
        await connection.commit();
        return rows;

    } catch (error) {
        await connection.rollback();
        throw error;

    } finally {
        connection.release();
    }
}

module.exports = {crear, leer, detalle, detallePlato, actualizar, eliminar, buscarPlatosRestaurante}