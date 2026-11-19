const { GenerarCartaComision, EliminarCartaComision, ObtenerCartaComision, EliminarTemporalesCartaComision, ContarComisionesPersona } = require("../../services/documentos/carta_comision.service");

// ==========================================
// GENERAR CARTA DE COMISIÓN
// ==========================================

async function GenerarCartaComisionController(req, res) {
    try {
        const datos = req.body;

        console.log("Datos recibidos para comisión:", datos);

        const documentos = await GenerarCartaComision(datos);

        res.status(200).json({
            mensaje: "Carta de comisión generada correctamente.",
            documentoWord: documentos.documentoWord,
            documentoPDF: documentos.documentoPDF,
            archivoWordTemporal: documentos.archivoWordTemporal,
            archivoPDFTemporal: documentos.archivoPDFTemporal,
            Drive_File_Id: documentos.Drive_File_Id,
            Mime_Type: documentos.Mime_Type,
            Tamano: documentos.Tamano,
            Id_Adscripcion: documentos.Id_Adscripcion,
            Id_Documento: documentos.Id_Documento
        });

    } catch (error) {
        console.error("Error al generar la carta de comisión:", error);

        res.status(400).json({
            mensaje: error.message || "Error al generar la carta de comisión."
        });
    }
}

// ==========================================
// OBTENER CARTA DE COMISIÓN
// ==========================================

async function ObtenerCartaComisionController(req, res) {
    try {
        const { id } = req.params;

        console.log("Solicitud para obtener carta de comisión:", id);

        const resultado = await ObtenerCartaComision(id);

        res.status(200).json({
            mensaje: "Datos de la carta de comisión obtenidos correctamente.",
            datos: resultado
        });

    } catch (error) {
        console.error("Error al obtener carta de comisión:", error);

        res.status(400).json({
            mensaje: error.message || "Error al obtener la carta de comisión."
        });
    }
}

// ==========================================
// ELIMINAR CARTA DE COMISIÓN
// ==========================================

async function EliminarCartaComisionController(req, res) {
    try {
        const { id } = req.params;

        console.log("Solicitud para eliminar carta de comisión:", id);

        const resultado = await EliminarCartaComision(id);

        res.status(200).json({
            mensaje: "Carta de comisión eliminada correctamente.",
            documento: resultado
        });

    } catch (error) {
        console.error("Error al eliminar carta de comisión:", error);

        res.status(400).json({
            mensaje: error.message || "Error al eliminar la carta de comisión."
        });
    }
}

// ==========================================
// ELIMINAR ARCHIVOS TEMPORALES
// ==========================================

async function EliminarTemporalesCartaComisionController(req, res) {
    try {
        console.log("Solicitud para eliminar archivos temporales de comisión.");

        const resultado = await EliminarTemporalesCartaComision(req.body);

        res.status(200).json({
            mensaje: resultado.mensaje
        });

    } catch (error) {
        console.error("Error al eliminar archivos temporales de comisión:", error);

        res.status(400).json({
            mensaje: error.message || "Error al eliminar los archivos temporales."
        });
    }
}

// ==========================================
// CONTAR COMISIONES DE UNA PERSONA
// ==========================================

async function ContarComisionesController(req, res) {
    try {
        const { idPersona } = req.params;
        const totalComisiones = await ContarComisionesPersona(idPersona);
        res.status(200).json({
            totalComisiones
        });
    } catch (error) {
        console.error("Error al consultar las comisiones:", error);
        res.status(400).json({
            mensaje: error.message || "No fue posible consultar las comisiones."
        });
    }
}

module.exports = { GenerarCartaComisionController, ObtenerCartaComisionController, EliminarCartaComisionController, EliminarTemporalesCartaComisionController, ContarComisionesController };