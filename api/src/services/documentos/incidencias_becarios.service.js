const { ObtenerPlantilla } = require("./encontrarPlantilla.service");
const { GenerarDocumento } = require("./generarDocumento.service");
const { GenerarPDF } = require("./generarPDF.service");
const {ObtenerIdPersonaPorCarpeta,CrearIncidenciaBecario} = require("../../models/incidencias_becarios.model.js");
const { subir_archivo } = require("../drive.service");
async function GenerarIncidenciasBecarios(data) {
    try {
        console.log("GENERANDO INCIDENCIA PARA BECARIO");
        console.log("Datos recibidos:", data);
        // 1. OBTENER ID DE PERSONA
        const Id_Persona_Incidencia =await ObtenerIdPersonaPorCarpeta(data.Id_Carpeta);
        console.log("Id_Persona encontrado:",Id_Persona_Incidencia);
        // 2. GUARDAR INCIDENCIA EN MYSQL
        const incidencia =
            await CrearIncidenciaBecario({
                Fecha_Actual:data.Fecha_Actual,
                Fecha_Solicitada:data.Fecha_Solicitada,
                Promocion:data.Promocion,
                Motivo:data.Motivo,
                Id_Persona_Incidencia:Id_Persona_Incidencia
            });
        console.log("Incidencia guardada en MySQL:",incidencia.Id_Incidencia);
        // 3. OBTENER PLANTILLA
        const plantilla =ObtenerPlantilla("Formato_Incidencias_Becarios");
        // 4. CREAR NOMBRE DEL ARCHIVO
        const nombreCompleto =(data.Nombre_Becario || "").trim();
        const partesNombre =nombreCompleto.split(/\s+/);
        let apellidoPat = "";
        let apellidoMat = "";
        if (partesNombre.length >= 2) {
            apellidoMat =partesNombre[partesNombre.length - 2];
            apellidoPat =partesNombre[partesNombre.length - 1];
        }
        const fecha = new Date();
        const anio =fecha.getFullYear();
        const mes =String(fecha.getMonth() + 1).padStart(2, "0");
        const dia =String(fecha.getDate()).padStart(2, "0");
        const nombreArchivo =`Incidencias_Becarios_${apellidoPat}_${apellidoMat}_${anio}-${mes}-${dia}`;
        // 5. GENERAR WORD
        const rutaDocumento =await GenerarDocumento(plantilla,data,nombreArchivo);
        console.log("Word generado:",rutaDocumento);
        // 6. GENERAR PDF
        const rutaPDF =await GenerarPDF(rutaDocumento,nombreArchivo);
        console.log("PDF generado:",rutaPDF);
        // 7. VALIDAR CARPETA DRIVE
        if (!data.Drive_Folder_Id) {
            throw new Error(
                "No se recibió el Drive_Folder_Id del expediente."
            );
        }
        // 8. SUBIR ÚNICAMENTE EL PDF
        const archivoPDFDrive =
            await subir_archivo(
                `${nombreArchivo}.pdf`,
                rutaPDF,
                data.Drive_Folder_Id
            );
        console.log("PDF subido correctamente a Google Drive.");
        // 9. DEVOLVER RESULTADO
        return {
            Id_Incidencia:incidencia.Id_Incidencia,
            docx:rutaDocumento,
            pdf:rutaPDF,
            driveFolderId:data.Drive_Folder_Id,
            drivePDF:archivoPDFDrive
        };
    } catch (error) {
        console.error("ERROR GENERANDO INCIDENCIA DE BECARIOS");
        console.error(error);
        throw error;
    }
}
module.exports = {GenerarIncidenciasBecarios};