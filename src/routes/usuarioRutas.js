const usuarioControlador = require('../controllers/usuarioControlador');
const { Router } = require('express');
const passport = require('passport');
const router = Router();

router.post("/crearUsuario/gerente",
    passport.authenticate("jwt", {session: false}),
    usuarioControlador.subirImagen, usuarioControlador.postUsuarioGerente);

router.post("/crearUsuario/empleado",
    passport.authenticate("jwt", {session: false}),
    usuarioControlador.postUsuarioEmpleado);

router.post("/crearUsuario/externo",
    usuarioControlador.postUsuarioCliente);

router.put("/descripcion/:id",
    passport.authenticate("jwt", {session: false}),
    usuarioControlador.subirImagen, usuarioControlador.putDescripcionUsuario);

router.get("/gerentes",
    passport.authenticate("jwt", {session: false}),
    usuarioControlador.getMisGerentes);

router.get("/empleados",
    passport.authenticate("jwt", {session: false}),
    usuarioControlador.getMisEmpleados);

router.get("/restaurantes/pertenecientes",
    passport.authenticate("jwt", {session: false}),
    usuarioControlador.getMisRestaurantes);

router.get("/pedidos/hechos",
    passport.authenticate("jwt", {session: false}),
    usuarioControlador.getMisPedidos);

router.post("/login",
    passport.authenticate("local", {session: false}),
    usuarioControlador.postSignin)

module.exports = router;