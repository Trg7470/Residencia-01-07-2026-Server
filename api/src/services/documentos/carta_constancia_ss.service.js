const { ObtenerPlantilla } = require("./encontrarPlantilla.service");
const { ObtenerDatosConstanciaSS } = require("./datos/carta_constancia_ss.datos");
const { GenerarDocumento } = require("./generarDocumento.service");
const { GenerarPDF } = require("./generarPDF.service");
const { subir_archivo, listar_archivos_carpeta, actualizar_archivo } = require("../../services/drive.service");

async function GenerarCartaConstanciaSS(datosFormulario) {
    // Obtener plantilla
    const plantilla = ObtenerPlantilla("Formato_Constancia_Servicio_Social");

    // Obtener y preparar datos
    const datos = await ObtenerDatosConstanciaSS(datosFormulario);
    console.log("DATOS PARA GENERAR WORD:", datos);

    // Obtener apellidos del alumno
    const apellidoPaterno = datos.Apellido_Paterno.trim();
    const apellidoMaterno = datos.Apellido_Materno.trim();

    // Nombre base de los archivos
    const nombreArchivo = `Constancia_Servicio_Social_${apellidoPaterno}_${apellidoMaterno}`;

    // Generar documento word
    const rutaDocumento = await GenerarDocumento(
        plantilla,
        datos,
        nombreArchivo
    );

    // Generar PDF
    const rutaPDF = await GenerarPDF(
        rutaDocumento,
        nombreArchivo
    );

    const nombrePDF = `${nombreArchivo}.pdf`;

    // Buscar archivos dentro de la carpeta del expediente
    const archivos = await listar_archivos_carpeta(
        datos.Drive_Folder_Id
    );

    // Buscar el PDF por nombre
    const pdfExistente = archivos.find(
        archivo => archivo.name === nombrePDF
    );

    if(pdfExistente) {
        // Si ya existe, reemplazarlo
        await actualizar_archivo(
            pdfExistente.id,
            rutaPDF
        );

        console.log("PDF actualizado en Google Drive:", nombrePDF);
    } else {
        // Si no existe, subirlo
        await subir_archivo(
            nombrePDF,
            rutaPDF,
            datos.Drive_Folder_Id
        );

        console.log("PDF nuevo subido a Google Drive:", nombrePDF);
    }

    return{
        docx: rutaDocumento,
        pdf: rutaPDF
    };
}

module.exports = { GenerarCartaConstanciaSS };