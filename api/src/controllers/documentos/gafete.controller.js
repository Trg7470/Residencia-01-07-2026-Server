const { GenerarVista } = require("../../services/gafete/vista/generarVista.service");
const { GenerarPDFGafete } = require("../../services/documentos/generarPDFGafete.service");
const { subir_archivo } = require("../../services/drive.service");
const ExpedientesModel = require("../../models/expedientes.model");
const Documentos = require("../../models/documentos.model");
const fs = require("fs").promises;

async function GenerarGafeteController(req, res) {
    try {
        const { Id_Carpeta, ...datosFormulario } = req.body;

        if (!Id_Carpeta) {
            return res.status(400).json({
                mensaje: "No se recibió el ID del expediente."
            });
        }

        // Obtener informacion general del expediente
        const expediente = await ExpedientesModel.obtener_general(Id_Carpeta);

        if (!expediente) {
            return res.status(404).json({
                mensaje: "No se encontró el expediente."
            });
        }

        if (!expediente.Drive_Folder_Id) {
            return res.status(400).json({
                mensaje: "El expediente no tiene una carpeta de Google Drive."
            });
        }

        // Preparar datos para generar el gafete
        const datosExpediente = {
            ...expediente,
            ...datosFormulario,
            Carrera: expediente.Carrera || ""
        };

        // Obtener la fotografia recibida
        if (req.file) {
            datosExpediente.Fotografia = req.file.path;
        }

        // Generar vista html
        const html = await GenerarVista(datosExpediente);

        // Preparar nombre del documento
        const partesNombre = (datosExpediente.Nombre_Completo || "").trim().split(/\s+/);

        const apellidos = partesNombre.length >= 3
            ? partesNombre.slice(-2).join("_")
            : partesNombre.join("_");

        const nombreDocumento = `Gafete_${apellidos}`;

        // Convertir la vista html a pdf
        const rutaPDF = await GenerarPDFGafete(html, nombreDocumento);

        // Obtener tamaño del pdf
        const informacionPDF = await fs.stat(rutaPDF);

        // Subir pdf a google drive
        const archivoDrive = await subir_archivo(
            `${nombreDocumento}.pdf`,
            rutaPDF,
            expediente.Drive_Folder_Id
        );

        // Registrar documento en mysql
        await Documentos.crear({
            Nombre: `${nombreDocumento}.pdf`,
            Drive_File_Id: archivoDrive.id,
            Mime_Type: "application/pdf",
            Tamano: informacionPDF.size,
            Fecha_Subida: new Date(),
            Subido_Por_Usuario: datosFormulario.Subido_Por_Usuario,
            Id_Carpeta_Documento: Id_Carpeta,
            Id_Tipo_Doc_D: 36
        });

        return res.status(200).json({
            mensaje: "Gafete generado y guardado correctamente.",
            archivo: archivoDrive.name
        });
    } catch (error) {
        console.error("Error al generar el gafete:", error);
        return res.status(500).json({
            mensaje: "Error al generar o guardar el gafete."
        });
    }
}

module.exports = { GenerarGafeteController };