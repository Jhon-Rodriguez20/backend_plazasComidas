const conexion = require('../conexionDB.js');

const crear = async (restaurante) => {
    const connection = await conexion.conexionMysql();
    await connection.beginTransaction();

    try {
        const query = "INSERT INTO restaurante SET ?";
        await connection.query(query, restaurante);
        await connection.commit();

    } catch (error) {
        await connection.rollback();
        throw error;

    } finally {
        connection.release();
    }
}

const leer = async (page, pageSize) => {
    const connection = await conexion.conexionMysql();
    await connection.beginTransaction();

    try {
        const offset = (page - 1) * pageSize;
        const query = `
            SELECT
                restaurante.idRestaurante,
                restaurante.razonSocial,
                restaurante.nit,
                restaurante.direccion,
                restaurante.telefono,
                REPLACE(CONCAT('/uploads/restaurantes/', REPLACE(restaurante.urlImagen, ' ', '_')), ' ', '_') AS imgRestaurante,
                usuario.idUsuario AS idGerente,
                usuario.nombre AS nombreUsuario,
                usuario.celular
            FROM restaurante
            INNER JOIN usuario ON restaurante.idUsuario = usuario.idUsuario
            LIMIT ?, ?
        `;
        const [rows] = await connection.query(query, [offset, pageSize]);

        const countQuery = `
            SELECT COUNT(*) as total
            FROM restaurante
        `;
        const [countRows] = await connection.query(countQuery);
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

const detalle = async (idRestaurante) => {
    const connection = await conexion.conexionMysql();
    await connection.beginTransaction();

    try {
        const query = `
            SELECT
                restaurante.idRestaurante,
                restaurante.razonSocial,
                restaurante.nit,
                restaurante.direccion,
                restaurante.telefono,
                REPLACE(CONCAT('/uploads/restaurantes/', REPLACE(restaurante.urlImagen, ' ', '_')), ' ', '_') AS imgRestaurante,
                usuario.idUsuario AS idGerente,
                usuario.nombre AS nombreUsuario,
                usuario.celular
            FROM restaurante
            INNER JOIN usuario ON restaurante.idUsuario = usuario.idUsuario WHERE restaurante.idRestaurante = ?
        `;
        const [rows] = await connection.query(query, [idRestaurante]);
        await connection.commit();
        return rows[0];

    } catch (error) {
        await connection.rollback();
        throw error;

    } finally {
        connection.release();
    }
}

const buscarNit = async (nit) => {
    const connection = await conexion.conexionMysql();
    await connection.beginTransaction();

    try {
        const query = "SELECT nit FROM restaurante WHERE nit = ?";
        const [rows] = await connection.query(query, [nit]);
        await connection.commit();
        return rows[0];

    } catch (error) {
        await connection.rollback();
        throw error;
        
    } finally {
        connection.release();
    }
}

const buscarGerenteRestaurante = async (gerente) => {
    const connection = await conexion.conexionMysql();
    await connection.beginTransaction();

    try {
        const query = "SELECT idRestaurante, idUsuario FROM restaurante WHERE idUsuario = ?";
        const [rows] = await connection.query(query, [gerente]);
        await connection.commit();
        return rows[0];

    } catch (error) {
        await connection.rollback();
        throw error;
        
    } finally {
        connection.release();
    }
}

module.exports = {crear, leer, detalle, buscarNit, buscarGerenteRestaurante}