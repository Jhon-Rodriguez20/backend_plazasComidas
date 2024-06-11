DROP DATABASE IF EXISTS plazasComidas;
CREATE DATABASE plazasComidas;

USE plazasComidas;

CREATE TABLE `usuarioRol` (
    `idRol` varchar(1) COLLATE utf8mb4_unicode_ci NOT NULL,
    `rolUsuario` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
    PRIMARY KEY (`idRol`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `usuario` (
    `idUsuario` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
    `nombre` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
    `celular` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
    `email` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
    `ocupacion` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
    `descripcionTrabajo` varchar(250) COLLATE utf8mb4_unicode_ci NOT NULL,
    `passwordEncp` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
    `urlImagen` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
    `idRol` varchar(1) COLLATE utf8mb4_unicode_ci NOT NULL,
    `idGerente` varchar(50) COLLATE utf8mb4_unicode_ci,
    PRIMARY KEY (`idUsuario`),
    FOREIGN KEY (`idRol`) REFERENCES `usuarioRol` (`idRol`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `restaurante` (
    `idRestaurante` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
    `razonSocial` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
    `nit` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
    `direccion` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
    `telefono` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
    `urlImagen` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
    `idUsuario` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
    PRIMARY KEY (`idRestaurante`),
    FOREIGN KEY (`idUsuario`) REFERENCES `usuario` (`idUsuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `plato` (
    `idPlato` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
    `nombrePlato` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
    `precio` int(10) NOT NULL,
    `descripcion` varchar(300) COLLATE utf8mb4_unicode_ci NOT NULL,
    `mostrado` varchar(1) COLLATE utf8mb4_unicode_ci NOT NULL,
    `urlImagen` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
    `restauranteId` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
    PRIMARY KEY (`idPlato`),
    FOREIGN KEY (`restauranteId`) REFERENCES `restaurante` (`idRestaurante`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `pedidoEstado` (
    `idEstado` varchar(1) COLLATE utf8mb4_unicode_ci NOT NULL,
    `estado` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
    PRIMARY KEY (`idEstado`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `pedidoMetodoPago` (
    `idMetodoPago` varchar(1) COLLATE utf8mb4_unicode_ci NOT NULL,
    `metodoPago` varchar(35) COLLATE utf8mb4_unicode_ci NOT NULL,
    PRIMARY KEY (`idMetodoPago`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `pedido` (
    `idPedido` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
    `numeroPedido` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
    `totalPagar` int(10) NOT NULL,
    `idEstado` varchar(1) COLLATE utf8mb4_unicode_ci NOT NULL,
    `idMetodoPago` varchar(1) COLLATE utf8mb4_unicode_ci NOT NULL,
    `fechaPedido` DATETIME NOT NULL,
    `idUsuario` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
    `idRestaurante` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
    PRIMARY KEY (`idPedido`),
    KEY (`numeroPedido`),
    FOREIGN KEY (`idUsuario`) REFERENCES `usuario` (`idUsuario`),
    FOREIGN KEY (`idRestaurante`) REFERENCES `restaurante` (`idRestaurante`),
    FOREIGN KEY (`idEstado`) REFERENCES `pedidoEstado` (`idEstado`),
    FOREIGN KEY (`idMetodoPago`) REFERENCES `pedidoMetodoPago` (`idMetodoPago`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `pedidoDetalle` (
    `idDetalle` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
    `idPedido` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
    `idPlato` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
    `cantidad` int(10) NOT NULL,
    PRIMARY KEY (`idDetalle`),
    FOREIGN KEY (`idPedido`) REFERENCES `pedido` (`idPedido`) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (`idPlato`) REFERENCES `plato` (`idPlato`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;