class PlatoDatosResModel {
    constructor(plato) {
        this.idPlato = plato.idPlato;
        this.nombrePlato = plato.nombrePlato;
        this.precio = plato.precio;
        this.descPlato = plato.descPlato;
        this.mostrado = plato.mostrado;
        this.imgPlato = plato.imgPlato;
        this.restauranteId = plato.restauranteId;
        this.nombreRestaurante = plato.nombreRestaurante;
    }
}

class PlatoActualizarReqModel {
    constructor(plato) {
        this.precio = plato.precio;
        this.descripcion = plato.descripcion;
        this.mostrado = plato.mostrado;
    }
}

class PlatoEntity {
    constructor(plato) {
        this.idPlato = plato.idPlato;
        this.nombrePlato = plato.nombrePlato;
        this.precio = plato.precio;
        this.descripcion = plato.descripcion;
        this.mostrado = plato.mostrado;
        this.urlImagen = plato.urlImagen;
        this.restauranteId = plato.restauranteId;
    }
}

module.exports = {PlatoActualizarReqModel, PlatoDatosResModel, PlatoEntity}