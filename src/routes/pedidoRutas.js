const { Router } = require('express');
const pedidoControlador = require('../controllers/pedidoControlador');
const passport = require('passport');
const router = Router();

router.post("/realizar",
    passport.authenticate("jwt", { session: false }),
    pedidoControlador.postPedido)

router.get("/restaurante/mostrar/:id",
    passport.authenticate("jwt", {session: false}),
    pedidoControlador.getPedidos)

router.get("/:id",
    passport.authenticate("jwt", {session: false}),
    pedidoControlador.getDetallePedido)

router.put("/:id",
    passport.authenticate("jwt", {session: false}),
    pedidoControlador.putPedido)

router.delete("/:id",
    passport.authenticate("jwt", {session: false}),
    pedidoControlador.deletePedido)

module.exports = router;