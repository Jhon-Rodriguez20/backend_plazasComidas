const usuarioRepositorio = require('../db/repositorios/usuarioRepositorio');
const { UsuarioEntity } = require('../models/UsuarioModelo');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
const { PedidoDatosResModel } = require('../models/PedidoModelo');

const eliminarImagen = (imgPerfil) => {
    const defaultImage = 'sinImagenPerfil.webp';
    if (imgPerfil !== defaultImage) {
        const filePath = path.join(__dirname, '../uploads/usuarios', imgPerfil);
        fs.unlink(filePath, () => {});
    }
}

const crearUsuario = async (usuario, idUsuario)=> {
        
    if(!usuario.nombre || !usuario.celular || !usuario.email ||
        !usuario.ocupacion || !usuario.descripcionTrabajo || 
        !usuario.password || !usuario.idRol) {
        throw new Error("Datos vacios o incorrectos");
    }

    const email = await usuarioRepositorio.buscarCorreo(usuario.email);
    if(email) throw new Error("El correo ya fue registrado.");

    usuario.idUsuario = uuidv4();
    usuario.passwordEncp = bcrypt.hashSync(usuario.password, 10);
    usuario.idGerente = idUsuario;

    await usuarioRepositorio.crear(new UsuarioEntity(usuario));
    return await usuarioRepositorio.leerUsuario(usuario.idUsuario);

}

const detalleUsuario = async (idUsuario) => {
    const usuario = await usuarioRepositorio.detalleUsuarioDescripcion(idUsuario);
    if(!usuario) throw new Error("No se encontró el detalle del usuario");

    return await usuarioRepositorio.detalleUsuarioDescripcion(idUsuario);
}

const actualizarDescripcion = async (idUsuario, usuario) => {

    if (!usuario.celular) {
        throw new Error("Datos vacíos o incorrectos");
    }

    const usuarioLogueado = await usuarioRepositorio.buscarUsuarioById(idUsuario);
    const usuarioDetalle = await usuarioRepositorio.detalleUsuarioActualizar(idUsuario);

    if (usuarioLogueado == null) throw new Error("No se encuentra el usuario");

    if (usuarioDetalle.idUsuario !== usuarioLogueado.idUsuario) {
        throw new Error('No se puede actualizar la descripción del usuario');
    }

    if (usuario.urlImagen && usuarioDetalle.urlImagen !== 'sinImagenPerfil.webp') {
        eliminarImagen(usuarioDetalle.urlImagen);
    }

    usuarioDetalle.celular = usuario.celular;    
    if (usuario.urlImagen) {
        usuarioDetalle.urlImagen = usuario.urlImagen;
    }

    await usuarioRepositorio.actualizar(usuarioDetalle);
    return await usuarioRepositorio.leerUsuario(usuarioDetalle.idUsuario);
}

const leerMisRestaurantes = async (idUsuario, page, pageSize)=> {
    
    const usuario = await usuarioRepositorio.buscarUsuarioById(idUsuario);
    if(usuario == null) throw new Error("No se encuentra el usuario");
        
    const restaurantes = await usuarioRepositorio.misRestaurantes(usuario.idUsuario, page, pageSize);
    return restaurantes;

}

const leerMisGerentes = async (idUsuario, page, pageSize) => {
    const usuario = await usuarioRepositorio.buscarUsuarioById(idUsuario);
    if (usuario == null) throw new Error("No se encuentra el usuario");
    
    const propietarios = await usuarioRepositorio.misGerentes(usuario.idUsuario, page, pageSize);
    return propietarios;
}

const leerMisEmpleados = async (idUsuario, page, pageSize) => {
    const usuario = await usuarioRepositorio.buscarUsuarioById(idUsuario);
    if (usuario === null) throw new Error("No se encuentra el usuario");

    const empleados = await usuarioRepositorio.misEmpleados(usuario.idUsuario, page, pageSize);
    return empleados;
}

const leerMisPedidos = async (idUsuario, page, pageSize) => {

    const usuario = await usuarioRepositorio.buscarUsuarioById(idUsuario);
    if (usuario === null) throw new Error("No se encuentra el usuario");

    const { rows, total } = await usuarioRepositorio.misPedidos(usuario.idUsuario, page, pageSize);
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

const leerUsuarioLogin = async (correo) => {
    return await usuarioRepositorio.leerUsuarioLogin(correo);
}

module.exports = {crearUsuario, detalleUsuario, actualizarDescripcion, leerMisEmpleados, leerMisGerentes,
    leerMisPedidos, leerMisRestaurantes, leerUsuarioLogin
}