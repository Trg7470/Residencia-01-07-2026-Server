
const { mysqlPool } = require('../config/mysql');

class CartaComision {

    // ==========================================
    // OBTENER ADSCRIPCIÓN PRINCIPAL
    // ==========================================

    static async obtener_adscripcion_principal(id_persona) {

        const [resultado] = await mysqlPool.query(`
            SELECT
                Id_Adscripcion,
                Id_Persona_Adscripcion,
                Id_Unidad_Adscripcion,
                Id_Tipo_Personal_Ad
            FROM adscripciones
            WHERE Id_Persona_Adscripcion = ?
            AND Tipo_Adscripcion = 'Principal'
            LIMIT 1
        `, [id_persona]);

        return resultado[0];
    }

    // ==========================================
    // OBTENER CARPETA DEL EXPEDIENTE
    // ==========================================

    static async obtener_carpeta_expediente(id_adscripcion) {

        const [resultado] = await mysqlPool.query(`
            SELECT
                Id_Carpeta,
                Drive_Folder_Id,
                Nombre_Carpeta
            FROM carpetas_drive
            WHERE Id_Adscripcion = ?
            LIMIT 1
        `, [id_adscripcion]);

        return resultado[0];
    }

    // ==========================================
    // REGISTRAR COMISIÓN
    // ==========================================

    static async registrar_comision(datos, connection) {
        // 1. Obtener los datos de la adscripción Principal
        const [principal] = await connection.query(`
            SELECT
                CIFRHS,
                Tipo_Plaza
            FROM adscripciones
            WHERE Id_Persona_Adscripcion = ?
            AND Id_Tipo_Personal_Ad = ?
            AND Tipo_Adscripcion = 'Principal'
            LIMIT 1
        `, [
            datos.Id_Persona,
            datos.Id_Tipo_Personal
        ]);

        // 2. Verificar que exista una adscripción Principal
        if (principal.length === 0) {
            throw new Error(
                "No se encontró la adscripción Principal para obtener CIFRHS y Tipo_Plaza."
            );
        }

        const { CIFRHS, Tipo_Plaza } = principal[0];

        // 3. Registrar la Comisión heredando ambos valores
        const [resultado] = await connection.query(`
            INSERT INTO adscripciones (
                Fecha_Inicio,
                Fecha_Termino,
                CIFRHS,
                Tipo_Plaza,
                Id_Persona_Adscripcion,
                Id_Unidad_Adscripcion,
                Id_Tipo_Personal_Ad,
                Tipo_Adscripcion
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, 'Comision')
        `, [
            datos.Fecha_Inicio,
            datos.Fecha_Termino,
            CIFRHS,
            Tipo_Plaza,
            datos.Id_Persona,
            datos.Id_Unidad_Comision,
            datos.Id_Tipo_Personal
        ]);

        return resultado.insertId;
    }

    // ==========================================
    // CONTAR COMISIONES
    // ==========================================

    static async contar_comisiones(id_persona, connection = mysqlPool) {

        const [resultado] = await connection.query(`
            SELECT COUNT(*) AS total
            FROM adscripciones
            WHERE Id_Persona_Adscripcion = ?
            AND Tipo_Adscripcion = 'Comision'
        `, [id_persona]);

        return resultado[0].total;
    }

    // ==========================================
    // OBTENER ADSCRIPCIÓN ACTUAL
    // ==========================================

    static async obtener_adscripcion_actual(id_persona) {

        const [resultado] = await mysqlPool.query(`
            SELECT
                Id_Adscripcion,
                Id_Persona_Adscripcion,
                Id_Unidad_Adscripcion,
                Id_Tipo_Personal_Ad,
                Tipo_Adscripcion,
                Fecha_Inicio,
                Fecha_Termino
            FROM adscripciones
            WHERE Id_Persona_Adscripcion = ?
            ORDER BY
                CASE
                    WHEN Tipo_Adscripcion = 'Comision' THEN 1
                    ELSE 2
                END,
                Id_Adscripcion DESC
            LIMIT 1
        `, [id_persona]);

        return resultado[0];
    }

    // ==========================================
    // OBTENER UNIDAD
    // ==========================================

    static async obtener_unidad(id_unidad) {

        const [resultado] = await mysqlPool.query(`
            SELECT
                Id_Unidad,
                Nombre,
                Municipio
            FROM unidades
            WHERE Id_Unidad = ?
            LIMIT 1
        `, [id_unidad]);

        return resultado[0];
    }

    // ==========================================
    // OBTENER COMISIÓN POR ADSCRIPCIÓN
    // ==========================================

    static async obtener_comision_por_adscripcion(id_adscripcion) {

        const [resultado] = await mysqlPool.query(`
            SELECT
                Id_Adscripcion,
                Id_Persona_Adscripcion,
                Id_Unidad_Adscripcion,
                Id_Tipo_Personal_Ad,
                Fecha_Inicio,
                Fecha_Termino,
                Tipo_Adscripcion
            FROM adscripciones
            WHERE Id_Adscripcion = ?
            AND Tipo_Adscripcion = 'Comision'
            LIMIT 1
        `, [id_adscripcion]);

        return resultado[0];
    }

    // ==========================================
    // OBTENER COMISIONES DE UNA PERSONA
    // ==========================================

    static async obtener_comisiones(id_persona) {

        const [resultado] = await mysqlPool.query(`
            SELECT
                Id_Adscripcion,
                Id_Persona_Adscripcion,
                Id_Unidad_Adscripcion,
                Id_Tipo_Personal_Ad,
                Fecha_Inicio,
                Fecha_Termino,
                Tipo_Adscripcion
            FROM adscripciones
            WHERE Id_Persona_Adscripcion = ?
            AND Tipo_Adscripcion = 'Comision'
            ORDER BY Id_Adscripcion ASC
        `, [id_persona]);

        return resultado;
    }

    // ==========================================
    // ELIMINAR COMISIÓN
    // ==========================================

    static async eliminar_comision(id_adscripcion, connection) {

        const [resultado] = await connection.query(`
            DELETE FROM adscripciones
            WHERE Id_Adscripcion = ?
            AND Tipo_Adscripcion = 'Comision'
        `, [id_adscripcion]);

        return resultado;
    }

    // ==========================================
    // REGISTRAR DATOS DE LA CARTA
    // ==========================================

    static async registrar_carta_comision(datos, connection) {

        const [resultado] = await connection.query(`
            INSERT INTO carta_presentacion (
                Id_Documento,
                Id_Adscripcion,
                Fecha_Carta,
                Abreviatura_Destinatario,
                Dirigido_A,
                Ocupacion_Destinatario,
                Abreviatura_Alumno,
                Ocupacion_Encargado,
                Abreviatura_Encargado,
                Encargado
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            datos.Id_Documento,
            datos.Id_Adscripcion,
            datos.Fecha_Carta,
            datos.Abreviatura_Destinatario,
            datos.Dirigido_A,
            datos.Ocupacion_Destinatario,
            datos.Abreviatura_Alumno,
            datos.Ocupacion_Encargado,
            datos.Abreviatura_Encargado,
            datos.Encargado
        ]);

        return resultado;
    }

    // ==========================================
    // OBTENER DATOS DE LA CARTA POR DOCUMENTO
    // ==========================================

    static async obtener_carta_comision_por_documento(id_documento) {

        const [resultado] = await mysqlPool.query(`
            SELECT
                Id_Carta,
                Id_Documento,
                Id_Adscripcion,
                Fecha_Carta,
                Abreviatura_Destinatario,
                Dirigido_A,
                Ocupacion_Destinatario,
                Abreviatura_Alumno,
                Ocupacion_Encargado,
                Abreviatura_Encargado,
                Encargado,
                Fecha_Registro
            FROM carta_presentacion
            WHERE Id_Documento = ?
            LIMIT 1
        `, [id_documento]);

        return resultado[0];
    }

    // ==========================================
    // ACTUALIZAR DATOS DE LA CARTA
    // ==========================================

    static async actualizar_carta_comision(datos, connection) {

        const [resultado] = await connection.query(`
            UPDATE carta_presentacion
            SET
                Fecha_Carta = ?,
                Abreviatura_Destinatario = ?,
                Dirigido_A = ?,
                Ocupacion_Destinatario = ?,
                Abreviatura_Alumno = ?,
                Ocupacion_Encargado = ?,
                Abreviatura_Encargado = ?,
                Encargado = ?
            WHERE Id_Carta = ?
        `, [
            datos.Fecha_Carta,
            datos.Abreviatura_Destinatario,
            datos.Dirigido_A,
            datos.Ocupacion_Destinatario,
            datos.Abreviatura_Alumno,
            datos.Ocupacion_Encargado,
            datos.Abreviatura_Encargado,
            datos.Encargado,
            datos.Id_Carta
        ]);

        return resultado;
    }

    // ==========================================
    // ELIMINAR DATOS DE LA CARTA
    // ==========================================

    static async eliminar_carta_comision(id_documento, connection) {

        const [resultado] = await connection.query(`
            DELETE FROM carta_presentacion
            WHERE Id_Documento = ?
        `, [id_documento]);

        return resultado;
    }
}

module.exports = CartaComision;