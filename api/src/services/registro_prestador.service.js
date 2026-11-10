
const { mysqlPool } = require('../config/mysql');
const Datos_Personales = require('../models/datos_personales.model');
const Beneficiarios = require('../models/beneficiarios.model');
const Adscripciones = require('../models/adscripciones.model');
const Carpetas_Drive = require('../models/carpetas_drive.model');
const Datos_Escolares = require('../models/datos_escolares.model');
const Contactos_Emergencia = require('../models/contactos_emergencia.model');

class Registro_Prestador_Service {
    static async registrar(datos_personales_data, beneficiarios_data, adscripciones_data, carpeta_drive_data, datos_escolares_data, contactos_emergencia_data) {
        const connection = await mysqlPool.getConnection();

        try {
            await connection.beginTransaction();

            const result_dp = await Datos_Personales.guardar_datos(
                datos_personales_data,
                connection
            );

            const Id_Persona = result_dp.insertId;

            for (const beneficiario of beneficiarios_data) {
                await Beneficiarios.guardar({
                    ...beneficiario,
                    Id_Persona_Beneficiario: Id_Persona
                }, connection);
            }

            const result_a = await Adscripciones.guardar({
                ...adscripciones_data,
                Id_Persona_Adscripcion: Id_Persona
            }, connection);

            const Id_Adscripcion = result_a.insertId;

            const Id_Carpeta = await Carpetas_Drive.crear_carpeta({
                ...carpeta_drive_data,
                Id_Persona_Adscripcion: Id_Adscripcion
            }, connection);

            await Datos_Escolares.guardar({
                ...datos_escolares_data,
                Id_Persona_D_Escolar: Id_Persona
            }, connection);

            const contactos = Array.isArray(contactos_emergencia_data)
                ? contactos_emergencia_data
                : contactos_emergencia_data
                    ? [contactos_emergencia_data]
                    : [];

            for (const contacto of contactos) {
                await Contactos_Emergencia.guardar({
                    ...contacto,
                    Id_Persona_Contacto: Id_Persona
                }, connection);
            }

            await connection.commit();

            return {
                Id_Persona,
                Id_Adscripcion,
                Id_Carpeta
            };
        } catch (error) {
            try {
                await connection.rollback();
            } catch (error_rollback) {
                console.error('Error al ejecutar rollback:', error_rollback);
            }

            throw error;
        } finally {
            connection.release();
        }
    }
}

module.exports = Registro_Prestador_Service;
