const { Router } = require('express');
const restauranteControlador = require('../controllers/restauranteControlador');
const passport = require('passport');
const router = Router();

router.post("/restaurante/crear",
    passport.authenticate("jwt", { session: false }),
    restauranteControlador.subirImagen, restauranteControlador.postRestaurante)

router.get("/restaurantes",
    restauranteControlador.getRestaurantes)

router.get("/restaurante/:id",
    restauranteControlador.getDetalleRestaurante)

module.exports = router;