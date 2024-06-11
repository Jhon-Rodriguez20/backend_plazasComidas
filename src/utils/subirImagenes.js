// const multer = require('multer');
// const path = require('path');

// const crearMulterMiddleware = (rutaDestino, campoNombre) => {
//     const storage = multer.diskStorage({
//         destination: (req, file, cb) => {
//             const uploadsPath = path.join(__dirname, rutaDestino);
//             cb(null, uploadsPath);
//         },
//         filename: (req, file, cb) => {
//             const nombreImagen = file.originalname.replace(/\s+/g, '-').toLowerCase();
//             cb(null, `${Date.now()}-${nombreImagen}`);
//         }
//     });

//     return multer({ storage: storage }).single(campoNombre);
// }

// module.exports = crearMulterMiddleware;