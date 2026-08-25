const express = require('express');
const router = express.Router();
const AuthRoutes = require('./auth.routes');
const EscuelasRoutes = require('./escuelas.routes');
const CarrerasRoutes = require('./carreras.routes');
const UnidadesRoutes = require('./unidades.routes');
const GoogleRoutes = require('./google.routes');
const CarpetasDriveRoutes = require('./carpetas_drive.routes');
const DriveServiceRoutes = require('./drive_service.routes');
const DatosPersonalesRoutes = require('./datos_personales.routes');
const BeneficiariosRoutes = require('./beneficiarios.routes');
const DatosEscolaresRoutes = require('./datos_escolares.routes');
const TiposPersonalRoutes = require('./tipos_personal.routes');
const AdscripcionesRoutes = require('./adscripciones.routes');
const ContactosEmergenciaRoutes = require('./contactos_emergencia.routes');
const DocumentosRoutes = require('./documentos.routes');

//Documentos
const FichaIdentificacionRoutes = require("./documentos/ficha_identificacion.routes");
const CartaAdscripcionRoutes = require("./documentos/carta_adscripcion.routes");
const CartaConstanciaSSRoutes = require("./documentos/carta_constancia_ss.routes");
const CartaPresentacionRoutes = require("./documentos/carta_presentacion.routes");
const IncidenciasBecariosRoutes = require("./documentos/incidencias_becarios.routes");
const VacacionesBecariosRoutes = require("./documentos/vacaciones_becarios.routes");
const GafeteRoutes = require("./documentos/gafete.routes");


router.use('/contactos_emergencia', ContactosEmergenciaRoutes);
router.use('/beneficiarios', BeneficiariosRoutes);
router.use('/datos_personales',DatosPersonalesRoutes);
router.use('/datos_escolares',DatosEscolaresRoutes);
router.use('/drive_service', DriveServiceRoutes);
router.use('/carpetas_drive', CarpetasDriveRoutes);
router.use('/google', GoogleRoutes);
router.use('/carreras', CarrerasRoutes);
router.use('/escuelas', EscuelasRoutes);
router.use('/auth', AuthRoutes);
router.use('/unidades', UnidadesRoutes);
router.use('/personal', TiposPersonalRoutes);
router.use('/adscripciones', AdscripcionesRoutes);

// Rutas documentos
router.use('/documentos/',DocumentosRoutes);
router.use('/documentos/ficha', FichaIdentificacionRoutes);
router.use('/documentos/carta_adscripcion', CartaAdscripcionRoutes);
router.use('/documentos/carta_constancia_ss', CartaConstanciaSSRoutes);
router.use('/documentos/carta_presentacion', CartaPresentacionRoutes);
router.use('/documentos/incidencias_becarios', IncidenciasBecariosRoutes);
router.use('/documentos/vacaciones_becarios', VacacionesBecariosRoutes);
router.use('/documentos/gafete', GafeteRoutes);



module.exports = router;
