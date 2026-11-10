
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const ruta_temporal = path.join(
    __dirname,
    '../../storage/temporales/documentos'
);

if (!fs.existsSync(ruta_temporal)) {
    fs.mkdirSync(ruta_temporal, { recursive: true });
}

const almacenamiento = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, ruta_temporal);
    },
    filename: (req, file, cb) => {
        const nombre = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
        cb(null, nombre);
    }
});

const upload = multer({
    storage: almacenamiento,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'application/pdf') {
            return cb(new Error('Solamente se permiten archivos PDF.'));
        }

        cb(null, true);
    }
});

module.exports = upload;
