const { GenerarCartaAdscripcion, EliminarTemporalesAdscripcion } = require("../../services/documentos/carta_adscripcion.service");
const Expedientes = require("../../models/expedientes.model");

async function GenerarAdscripcionController(req, res) {
    try {
        const datos = req.body;

        // Validar información del expediente
        if (!datos.Id_Persona) {
            return res.status(400).json({
                mensaje: "No se recibió el ID de la persona del expediente."
            });
        }

        if (!datos.Id_Carpeta) {
            return res.status(400).json({
                mensaje: "No se recibió el ID de la carpeta del expediente."
            });
        }

        if (!datos.Drive_Folder_Id) {
            return res.status(400).json({
                mensaje: "No se recibió la carpeta de Google Drive del expediente."
            });
        }

        // Obtener información escolar
        const datosEscolares = await Expedientes.obtener_datos_escolares(
            datos.Id_Persona
        );

        console.log("Datos escolares recuperados:", datosEscolares);

        if (!datosEscolares) {
            return res.status(404).json({
                mensaje: "No se encontraron los datos escolares del expediente."
            });
        }

        // Integrar información escolar con los datos del formulario
        Object.assign(datos, datosEscolares);

        // Generar carta y subir PDF a Google Drive
        const documentos = await GenerarCartaAdscripcion(datos);

        return res.status(200).json({
            mensaje: "Carta de adscripción generada correctamente.",
            documentoWord: documentos.documentoWord,
            documentoPDF: documentos.documentoPDF,
            archivoWordTemporal: documentos.archivoWordTemporal,
            archivoPDFTemporal: documentos.archivoPDFTemporal,
            Drive_File_Id: documentos.Drive_File_Id,
            MimeType: documentos.MimeType,
            Tamano: documentos.Tamano,
            drivePDF: documentos.drivePDF
        });

    } catch (error) {

        console.error("Error al generar la carta de adscripción:", error);

        return res.status(500).json({
            mensaje: "Error al generar la carta de adscripción."
        });
    }
}

// ELIMINAR ARCHIVOS TEMPORALES
async function EliminarTemporalesAdscripcionController(req, res) {
    try {
        const resultado = await EliminarTemporalesAdscripcion(req.body);
        return res.status(200).json(resultado);
    } catch (error) {
        console.error("Error al eliminar los archivos temporales de adscripción:", error);
        return res.status(500).json({
            mensaje: "Error al eliminar los archivos temporales."
        });
    }
}

module.exports = { GenerarAdscripcionController, EliminarTemporalesAdscripcionController };