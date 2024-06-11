const { Router } = require('express');
const platoControlador = require('../controllers/platoControlador');
const passport = require('passport');
const router = Router();

router.post("/",
    passport.authenticate("jwt", {session: false}),
    platoControlador.subirImagen, platoControlador.postPlato)

router.get("/restaurante/:id",
    platoControlador.getPlatos)

router.get("/:id",
    platoControlador.getDetallePlato)

router.put("/:id",
    passport.authenticate("jwt", {session: false}),
    platoControlador.putPlato)

router.delete("/:id",
    passport.authenticate("jwt", {session: false}),
    platoControlador.deletePlato)

module.exports = router;