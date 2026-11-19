const multer = require('multer');
const path = require('path');
const fs = require("fs");
const ruta_temporal = path.join(__dirname, '../../storage/temporales/beneficiarios');

if (!fs.existsSync(ruta_temporal)) {
    fs.mkdirSync(ruta_temporal, { recursive: true });
}

const almacenamiento = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, ruta_temporal);
    },

    filename: (req, file, cb) => {
        const nombre = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.\_-]/g, '_')}`;
        cb (null, nombre);
    }
});

const upload = multer({
    storage: almacenamiento,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        const formatosPermitidos = [
            'application/pdf',
            'image/jpeg',
            'image/png'
        ];

        if (!formatosPermitidos.includes(file.mimetype)) {
            return cb(new Error(
                'Solo se permiten archivos PDF, JPG, JPEG o PNG.'
            ));
        }

        cb(null, true);
    }
});

module.exports = upload;