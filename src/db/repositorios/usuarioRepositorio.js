const conexion = require('../conexionDB.js');

const crear = async (usuario) => {
    const connection = await conexion.conexionMysql();
    await connection.beginTransaction();

    try {
        const query = "INSERT INTO usuario SET ?";
        await connection.query(query, usuario);
        await connection.commit();

    } catch (error) {
        await connection.rollback();
        throw error;

    } finally {
        connection.release();
    }
}

const detalleUsuario = async (idUsuario)=> {
    const connection = await conexion.conexionMysql();
    const query = "SELECT * FROM usuario WHERE idUsuario = ?";
    const [rows] = await connection.query(query, [idUsuario]);
    connection.release();
    return rows[0];
}

const actualizar = async (usuarioDetalle) => {
    const connection = await conexion.conexionMysql();
    await connection.beginTransaction();

    try {
        const query = "UPDATE usuario SET ? WHERE idUsuario = ?";
        await connection.query(query, [usuarioDetalle, usuarioDetalle.idUsuario]);
        await connection.commit();

    } catch (error) {
        await connection.rollback();
        throw error;
        
    } finally {
        connection.release();
    }
}

const leerUsuarioLogin = async (email)=> {
    const connection = await conexion.conexionMysql();
    const query = "SELECT * FROM usuario WHERE email = ?";
    const [rows] = await connection.query(query, [email]);
    connection.release();
    return rows[0];
}

const leerUsuario = async (usuario)=> {
    const connection = await conexion.conexionMysql();
    const query = `
        SELECT
            idUsuario,
            nombre,
            celular,
            email,
            ocupacion,
            descripcionTrabajo,
            idRol,
            REPLACE(CONCAT('/uploads/usuarios/', REPLACE(urlImagen, ' ', '_')), ' ', '_') AS imgPerfil
        FROM usuario
        WHERE idUsuario = ?
    `;
    const [rows] = await connection.query(query, [usuario]);
    connection.release();
    return rows[0];
}

const misGerentes = async (idGerente) => {
    const connection = await conexion.conexionMysql();
    const query = "SELECT * FROM usuario WHERE idRol = '2' AND idGerente = ?";
    const [rows] = await connection.query(query, [idGerente]);
    connection.release();
    return rows;
}

const misEmpleados = async (idGerente) => {
    const connection = await conexion.conexionMysql();
    const query = "SELECT * FROM usuario WHERE idRol = '3' AND idGerente = ?";
    const [rows] = await connection.query(query, [idGerente]);
    connection.release();
    return rows;
}

const misRestaurantes = async (idUsuario)=> {
    const connection = await conexion.conexionMysql();
    const query = `
        SELECT
            restaurante.idRestaurante,
            restaurante.razonSocial,
            restaurante.nit,
            restaurante.direccion,
            restaurante.telefono,
            usuario.idUsuario AS idGerente,
            usuario.nombre AS nombreUsuario,
            usuario.celular
        FROM restaurante
        INNER JOIN usuario ON restaurante.idUsuario = usuario.idUsuario
        WHERE usuario.idUsuario = ?
    `;
    const [rows] = await connection.query(query, [idUsuario]);
    connection.release();
    return rows;
}

const buscarCorreo = async (email)=> {
    const connection = await conexion.conexionMysql();
    const query = "SELECT email FROM usuario WHERE email = ?";
    const [rows] = await connection.query(query, [email]);
    connection.release();
    return rows[0];
}

const buscarUsuarioById = async (idUsuario)=> {
    const connection = await conexion.conexionMysql();
    const query = "SELECT idUsuario FROM usuario WHERE idUsuario = ?";
    const [rows] = await connection.query(query, [idUsuario]);
    connection.release();
    return rows[0];
}

module.exports = {crear, actualizar, detalleUsuario, leerUsuarioLogin, leerUsuario,
    misEmpleados, misGerentes, misRestaurantes, buscarCorreo, buscarUsuarioById
}