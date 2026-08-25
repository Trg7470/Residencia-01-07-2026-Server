const drive = require("../config/drive");
const fs = require("fs");
const GOOGLE_ROOT_FOLDER_ID = process.env.GOOGLE_ROOT_FOLDER_ID


// ================================
// LISTAR ARCHIVOS
// ================================
async function listar_archivos(pageSize = 100) {
    const respuesta = await drive.files.list({
        pageSize,
        fields: "files(id,name,mimeType,parents,createdTime)"
    });
    return respuesta.data.files;
}

// ================================
// LISTAR CONTENIDO DE UNA CARPETA
// ================================
async function listar_archivos_carpeta(carpetaId) {
    const respuesta = await drive.files.list({
        q: `'${carpetaId}' in parents and trashed=false`,
        fields: "files(id,name,mimeType)"
    });

    return respuesta.data.files;
}

// ================================
// BUSCAR POR NOMBRE
// ================================
async function buscar_archivo(nombre) {
    const respuesta = await drive.files.list({
        q: `name='${nombre}' and trashed=false`,
        fields: "files(id,name,mimeType)"
    });
    return respuesta.data.files;
}

// ================================
// CREAR CARPETA
// ================================
async function crear_carpeta(nombre, carpetaPadre = null) {
    const metadata = {
        name: nombre,
        mimeType: "application/vnd.google-apps.folder"
    };
    if (carpetaPadre) {
        metadata.parents = [carpetaPadre];
    }
    const respuesta = await drive.files.create({
        requestBody: metadata,
        fields: "id,name"
    });
    return respuesta.data;
}

// ================================
// SUBIR ARCHIVO
// ================================
async function subir_archivo(nombre, rutaArchivo, carpetaPadre) {
    const respuesta = await drive.files.create({
        requestBody: {
            name: nombre,
            parents: [carpetaPadre]
        },
        media: {
            body: fs.createReadStream(rutaArchivo)
        },
        fields: "id,name,mimeType, size"
    });
    return respuesta.data;
}

// ================================
// ELIMINAR ARCHIVO
// ================================
async function eliminar_archivo(idArchivo) {
    await drive.files.delete({
        fileId: idArchivo
    });
    return true;
}

// ================================
// ACTUALIZAR (REEMPLAZAR) ARCHIVO
// ================================
async function actualizar_archivo(idArchivo, rutaArchivo) {
    const respuesta = await drive.files.update({
        fileId: idArchivo,
        media: {
            body: fs.createReadStream(rutaArchivo)
        },
        fields: "id,name"
    });
    return respuesta.data;
}

// ================================
// CAMBIAR NOMBRE
// ================================
async function renombrar_archivo(idArchivo, nuevoNombre) {
    const respuesta = await drive.files.update({
        fileId: idArchivo,
        requestBody: {
            name: nuevoNombre
        },
        fields: "id,name"
    });
    return respuesta.data;
}

// ================================
// MOVER ARCHIVO
// ================================
async function mover_archivo(idArchivo, carpetaOrigen, carpetaDestino) {
    const respuesta = await drive.files.update({
        fileId: idArchivo,
        addParents: carpetaDestino,
        removeParents: carpetaOrigen,
        fields: "id,name,parents"
    });
    return respuesta.data;
}

// ================================
// OBTENER INFORMACIÓN
// ================================
async function obtener_archivo(idArchivo) {
    const respuesta = await drive.files.get({
        fileId: idArchivo,
        fields: "id,name,mimeType,size,createdTime,parents"
    });
    return respuesta.data;
}

// ================================
// OBTENER LINK
// ================================
async function obtener_link(idArchivo) {

    await drive.permissions.create({
        fileId: idArchivo,
        requestBody: {
            role: "reader",
            type: "anyone"
        }
    });
    return `https://drive.google.com/file/d/${idArchivo}/view`;
}

// ================================
// DESCARGAR
// ================================
async function descargar_archivo(idArchivo) {
    return drive.files.get({
        fileId: idArchivo,
        alt: "media"
    }, {
        responseType: "stream"
    });
}

// ================================
// OBTENER CARPETA
// ================================
async function obtener_carpeta(nombre, carpetaPadre) {

    const respuesta = await drive.files.list({
        q: `
            name='${nombre}'
            and mimeType='application/vnd.google-apps.folder'
            and '${carpetaPadre}' in parents
            and trashed=false
        `,
        fields: "files(id,name)"
    });

    if (respuesta.data.files.length === 0)
        return null;

    return respuesta.data.files[0];
}

// ================================
// OBTENER O CREAR CARPETA
// ================================
async function obtener_o_crear_carpeta(nombre, carpetaPadre) {

    let carpeta = await obtener_carpeta(nombre, carpetaPadre);

    if (carpeta)
        return carpeta;

    return await crear_carpeta(nombre, carpetaPadre);
}

// ================================
// CREAR RUTA DE EXPEDIENTE
// ================================
async function crear_ruta_expediente(datos) {
    const anio = await obtener_o_crear_carpeta(
        datos.anio,
        GOOGLE_ROOT_FOLDER_ID
    );
    const tipo = await obtener_o_crear_carpeta(
        datos.tipo,
        anio.id
    );
    const escuela = await obtener_o_crear_carpeta(
        datos.escuela,
        tipo.id
    );
    const carrera = await obtener_o_crear_carpeta(
        datos.carrera,
        escuela.id
    );
    const adscripcion = await obtener_o_crear_carpeta(
        datos.adscripcion,
        carrera.id
    );
    const expediente = await obtener_o_crear_carpeta(
        datos.expediente,
        adscripcion.id
    );
    return {
        expediente
    };
}

module.exports = {
    listar_archivos,
    listar_archivos_carpeta,
    buscar_archivo,
    crear_carpeta,
    subir_archivo,
    eliminar_archivo,
    actualizar_archivo,
    renombrar_archivo,
    mover_archivo,
    obtener_archivo,
    obtener_link,
    descargar_archivo,
    obtener_carpeta,
    obtener_o_crear_carpeta,
    crear_ruta_expediente
};