class UsuarioDatosResModel {
    constructor(usuario) {
        this.idUsuario = usuario.idUsuario;
        this.nombre = usuario.nombre;
        this.celular = usuario.celular;
        this.email = usuario.email;
        this.ocupacion = usuario.ocupacion;
        this.descripcionTrabajo = usuario.descripcionTrabajo;
        this.imgPerfil = usuario.imgPerfil;
        this.idRol = usuario.idRol;
    }
}

class UsuarioEntity {
    constructor(usuario) {
        this.idUsuario = usuario.idUsuario;
        this.nombre = usuario.nombre;
        this.celular = usuario.celular;
        this.email = usuario.email;
        this.ocupacion = usuario.ocupacion;
        this.descripcionTrabajo = usuario.descripcionTrabajo;
        this.passwordEncp = usuario.passwordEncp;
        this.urlImagen = usuario.urlImagen;
        this.idRol = usuario.idRol;
        this.idGerente = usuario.idGerente;
    }
}

module.exports = {UsuarioDatosResModel, UsuarioEntity}