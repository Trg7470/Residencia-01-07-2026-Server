const { ObtenerPlantilla } = require("./encontrarPlantilla.service");
const { ObtenerDatosConstanciaSS } = require("./datos/carta_constancia_ss.datos");
const { GenerarDocumento } = require("./generarDocumento.service");
const { GenerarPDF } = require("./generarPDF.service");
const { subir_archivo, listar_archivos_carpeta, actualizar_archivo, obtener_archivo } = require("../../services/drive.service");

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

    let resultadoDrive;

    if(pdfExistente) {
        // Si ya existe, reemplazarlo
        await actualizar_archivo(
            pdfExistente.id,
            rutaPDF
        );

        // Obtener los metadatos actualizados
        resultadoDrive = await obtener_archivo(
            pdfExistente.id
        );

        console.log("PDF actualizado en Google Drive:", nombrePDF);

    } else {
        // Subir PDF nuevo
        resultadoDrive = await subir_archivo(
            nombrePDF, 
            rutaPDF,
            datos.Drive_Folder_Id
        );

        console.log("PDF nuevo subido a Google Drive:", nombrePDF);
    }

    // Devolver datos del PDF y su ubicación
    return{
        pdf: rutaPDF,
        documentoPDF: resultadoDrive.name,
        Drive_File_Id: resultadoDrive.mimeType,
        Tamano: resultadoDrive.size
    };
}

module.exports = { GenerarCartaConstanciaSS };