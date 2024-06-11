class RestauranteDatosResModel {
    constructor(restaurante){
        this.idRestaurante = restaurante.idRestaurante;
        this.razonSocial = restaurante.razonSocial;
        this.nit = restaurante.nit;
        this.direccion = restaurante.direccion;
        this.telefono = restaurante.telefono;
        this.imgRestaurante = restaurante.imgRestaurante;
        this.idGerente = restaurante.idGerente;
        this.nombreUsuario = restaurante.nombreUsuario;
        this.celular = restaurante.celular;
    }
}

class RestauranteEntity {
    constructor(restaurante){
        this.idRestaurante = restaurante.idRestaurante;
        this.razonSocial = restaurante.razonSocial;
        this.nit = restaurante.nit;
        this.direccion = restaurante.direccion;
        this.telefono = restaurante.telefono;
        this.urlImagen = restaurante.urlImagen;
        this.idUsuario = restaurante.idUsuario;
    }
}

module.exports = {RestauranteDatosResModel, RestauranteEntity}