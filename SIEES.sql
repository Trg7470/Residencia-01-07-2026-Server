-- SIEES - Script SQL normalizado

-- MySQL 8.x / 9.x


DROP DATABASE IF EXISTS `SIEES`;

CREATE DATABASE `SIEES` CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

USE `SIEES`;


-- Tabla: carpetas_drive

CREATE TABLE `carpetas_drive` (
  `Id_Carpeta` int NOT NULL AUTO_INCREMENT,
  `Drive_Folder_Id` varchar(150) NOT NULL,
  `Nombre_Carpeta` varchar(150) NOT NULL,
  `Fecha_Creacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Id_Adscripcion` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`Id_Carpeta`),
  UNIQUE KEY `Drive_Folder_Id` (`Drive_Folder_Id`),
  KEY `FK_Id_Adscripcion` (`Id_Adscripcion`)
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- Tabla: carreras

CREATE TABLE `carreras` (
  `Id_Carrera` int NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(150) NOT NULL,
  `Tipo_Carrera` varchar(30) NOT NULL,
  PRIMARY KEY (`Id_Carrera`)
) ENGINE=InnoDB AUTO_INCREMENT=320 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- Tabla: datos_personales

CREATE TABLE `datos_personales` (
  `Id_Persona` int NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(80) NOT NULL,
  `Apellido_Paterno` varchar(50) NOT NULL,
  `Apellido_Materno` varchar(50) NOT NULL,
  `RFC` varchar(13) NOT NULL,
  `CURP` varchar(18) NOT NULL,
  `Fecha_Nac` date NOT NULL,
  `Lugar_Nac` varchar(100) NOT NULL,
  `Telefono` varchar(20) NOT NULL,
  `Telefono_Casa` varchar(20) DEFAULT NULL,
  `Correo` varchar(100) NOT NULL,
  `Calle_Numero` varchar(100) NOT NULL,
  `Colonia` varchar(100) NOT NULL,
  `Ciudad` varchar(100) NOT NULL,
  `Codigo_Postal` varchar(5) NOT NULL,
  `Estado` varchar(50) NOT NULL,
  `Estado_Civil` varchar(30) NOT NULL,
  `Fecha_Registro` date NOT NULL,
  PRIMARY KEY (`Id_Persona`),
  UNIQUE KEY `RFC` (`RFC`),
  UNIQUE KEY `CURP` (`CURP`)
) ENGINE=InnoDB AUTO_INCREMENT=90 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- Tabla: escuelas

CREATE TABLE `escuelas` (
  `Id_Escuela` int NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(150) NOT NULL,
  `Estado` varchar(30) NOT NULL,
  `Municipio` varchar(30) NOT NULL,
  `Tipo` varchar(20) NOT NULL,
  PRIMARY KEY (`Id_Escuela`)
) ENGINE=InnoDB AUTO_INCREMENT=141 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- Tabla: roles

CREATE TABLE `roles` (
  `Id_Rol` int NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(50) NOT NULL,
  `Descripcion` text,
  PRIMARY KEY (`Id_Rol`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- Tabla: tipos_documento

CREATE TABLE `tipos_documento` (
  `Id_Tipo_Documento` int NOT NULL AUTO_INCREMENT,
  `Codigo` varchar(50) NOT NULL,
  `Nombre` varchar(50) NOT NULL,
  `Descripcion` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`Id_Tipo_Documento`),
  UNIQUE KEY `Nombre` (`Nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- Tabla: tipos_personal

CREATE TABLE `tipos_personal` (
  `Id_Tipo_Personal` int NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(50) NOT NULL,
  `Descripcion` text,
  PRIMARY KEY (`Id_Tipo_Personal`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- Tabla: unidades

CREATE TABLE `unidades` (
  `Id_Unidad` int NOT NULL AUTO_INCREMENT,
  `Area` int NOT NULL,
  `Municipio` varchar(50) NOT NULL,
  `CLUES` varchar(30) NOT NULL,
  `Nombre` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`Id_Unidad`)
) ENGINE=InnoDB AUTO_INCREMENT=79 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- Tabla: adscripciones

CREATE TABLE `adscripciones` (
  `Id_Adscripcion` int NOT NULL AUTO_INCREMENT,
  `Fecha_Inicio` date NOT NULL,
  `Fecha_Termino` date DEFAULT NULL,
  `Id_Persona_Adscripcion` int NOT NULL,
  `Id_Unidad_Adscripcion` int NOT NULL,
  `Id_Tipo_Personal_Ad` int NOT NULL,
  `Tipo_Adscripcion` enum('Principal','Comision') NOT NULL,
  PRIMARY KEY (`Id_Adscripcion`),
  KEY `FK_Id_Persona_Adscripcion` (`Id_Persona_Adscripcion`),
  KEY `FK_Id_Unidad_Adscripcion` (`Id_Unidad_Adscripcion`),
  KEY `FK_Id_Tipo_Personal_Ad` (`Id_Tipo_Personal_Ad`),
  CONSTRAINT `FK_Id_Persona_Adscripcion` FOREIGN KEY (`Id_Persona_Adscripcion`) REFERENCES `datos_personales` (`Id_Persona`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_Id_Tipo_Personal_Ad` FOREIGN KEY (`Id_Tipo_Personal_Ad`) REFERENCES `tipos_personal` (`Id_Tipo_Personal`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `FK_Id_Unidad_Adscripcion` FOREIGN KEY (`Id_Unidad_Adscripcion`) REFERENCES `unidades` (`Id_Unidad`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=74 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- Tabla: beneficiarios

CREATE TABLE `beneficiarios` (
  `Id_Beneficiario` int NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(100) NOT NULL,
  `Edad` int NOT NULL,
  `Parentesco` varchar(50) NOT NULL,
  `Id_Persona_Beneficiario` int NOT NULL,
  PRIMARY KEY (`Id_Beneficiario`),
  KEY `FK_Id_Persona_Beneficiario` (`Id_Persona_Beneficiario`),
  CONSTRAINT `FK_Id_Persona_Beneficiario` FOREIGN KEY (`Id_Persona_Beneficiario`) REFERENCES `datos_personales` (`Id_Persona`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=77 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- Tabla: contactos_emergencia

CREATE TABLE `contactos_emergencia` (
  `Id_Contacto` int NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(100) NOT NULL,
  `Parentesco` varchar(50) NOT NULL,
  `Telefono` varchar(20) NOT NULL,
  `Id_Persona_Contacto` int NOT NULL,
  PRIMARY KEY (`Id_Contacto`),
  KEY `FK_Id_Persona_Contacto` (`Id_Persona_Contacto`),
  CONSTRAINT `FK_Id_Persona_Contacto` FOREIGN KEY (`Id_Persona_Contacto`) REFERENCES `datos_personales` (`Id_Persona`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- Tabla: datos_escolares

CREATE TABLE `datos_escolares` (
  `Id_Dato_Escoalr` int NOT NULL AUTO_INCREMENT,
  `Promedio` decimal(4,2) NOT NULL,
  `Cuenta_NSS` tinyint(1) NOT NULL DEFAULT '0',
  `Numero_Afiliacion` varchar(20) DEFAULT NULL,
  `Id_Carrera_D_Escolar` int NOT NULL,
  `Id_Persona_D_Escolar` int NOT NULL,
  `Id_Escuela_D_Escolar` int NOT NULL,
  PRIMARY KEY (`Id_Dato_Escoalr`),
  UNIQUE KEY `Id_Persona_D_Escolar` (`Id_Persona_D_Escolar`),
  KEY `Fk_Id_Escuela_idx` (`Id_Escuela_D_Escolar`),
  CONSTRAINT `FK_Id_Carrera` FOREIGN KEY (`Id_Persona_D_Escolar`) REFERENCES `carreras` (`Id_Carrera`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Fk_Id_Escuela` FOREIGN KEY (`Id_Escuela_D_Escolar`) REFERENCES `escuelas` (`Id_Escuela`),
  CONSTRAINT `FK_Id_Persona` FOREIGN KEY (`Id_Persona_D_Escolar`) REFERENCES `datos_personales` (`Id_Persona`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- Tabla: usuarios

CREATE TABLE `usuarios` (
  `Id_Usuario` int NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(50) NOT NULL,
  `Apellido_Paterno` varchar(50) NOT NULL,
  `Apellido_Materno` varchar(50) NOT NULL,
  `Correo` varchar(100) NOT NULL,
  `Contrasena` varchar(255) NOT NULL,
  `Fecha_Registro` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Activo` tinyint(1) NOT NULL DEFAULT '1',
  `Id_Rol_Usuario` int NOT NULL,
  PRIMARY KEY (`Id_Usuario`),
  UNIQUE KEY `Correo` (`Correo`),
  KEY `FK_Id_Rol` (`Id_Rol_Usuario`),
  CONSTRAINT `FK_Id_Rol` FOREIGN KEY (`Id_Rol_Usuario`) REFERENCES `roles` (`Id_Rol`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- Tabla: bitacora

CREATE TABLE `bitacora` (
  `Id_Bitacora` int NOT NULL AUTO_INCREMENT,
  `Accion` varchar(100) NOT NULL,
  `Tabla_Afectada` varchar(50) NOT NULL,
  `Fecha_Hora` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Id_Usuario_Bitacora` int NOT NULL,
  `Id_Persona_Bitacora` int NOT NULL,
  PRIMARY KEY (`Id_Bitacora`),
  KEY `FK_Id_Usuario_Bitacora` (`Id_Usuario_Bitacora`),
  KEY `FK_Id_Persona_Bitacora` (`Id_Persona_Bitacora`),
  CONSTRAINT `FK_Id_Persona_Bitacora` FOREIGN KEY (`Id_Persona_Bitacora`) REFERENCES `datos_personales` (`Id_Persona`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_Id_Usuario_Bitacora` FOREIGN KEY (`Id_Usuario_Bitacora`) REFERENCES `usuarios` (`Id_Usuario`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- Tabla: documentos

CREATE TABLE `documentos` (
  `Id_Documento` int NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(255) NOT NULL,
  `Drive_File_Id` varchar(150) NOT NULL,
  `Mime_Type` varchar(100) NOT NULL,
  `Tamano` bigint NOT NULL,
  `Fecha_Subida` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Subido_Por_Usuario` int NOT NULL,
  `Id_Carpeta_Documento` int NOT NULL,
  `Id_Tipo_Doc_D` int NOT NULL,
  `Tipo` varchar(100) NOT NULL,
  PRIMARY KEY (`Id_Documento`),
  UNIQUE KEY `Drive_File_Id` (`Drive_File_Id`),
  KEY `FK_Id_Usuario` (`Subido_Por_Usuario`),
  KEY `FK_Id_Carpeta` (`Id_Carpeta_Documento`),
  KEY `FK_Id_Tipo_Documento` (`Id_Tipo_Doc_D`),
  CONSTRAINT `FK_Id_Carpeta` FOREIGN KEY (`Id_Carpeta_Documento`) REFERENCES `carpetas_drive` (`Id_Carpeta`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `FK_Id_Tipo_Documento` FOREIGN KEY (`Id_Tipo_Doc_D`) REFERENCES `tipos_documento` (`Id_Tipo_Documento`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `FK_Id_Usuario` FOREIGN KEY (`Subido_Por_Usuario`) REFERENCES `usuarios` (`Id_Usuario`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- Datos

-- Datos de: carpetas_drive

INSERT INTO `carpetas_drive` VALUES (60,'1nD2N0i2zBnkw39UqaXh4iEUsamXgul1m','Ileana Sarai Hurtado Flores','2026-09-03 12:25:32','73');



-- Datos de: carreras

INSERT INTO `carreras` VALUES (1,'Administración Fiscal','Universidad'),(2,'Administración de Empresas','Universidad'),(3,'Administración de Empresas Turísticas','Universidad'),(4,'Administración de Tecnologías de la Información','Universidad'),(5,'Administración y Gestión Empresarial','Universidad'),(6,'Administración y Gestión de Negocios','Universidad'),(7,'Arquitectura','Universidad'),(8,'Arquitectura/Administración de la Empresa Constructora','Universidad'),(9,'Ciencias Políticas y Gestión Pública','Universidad'),(10,'Ciencias de la Comunicación','Universidad'),(11,'Ciencias y Técnicas de la Comunicación','Universidad'),(12,'Cine y Producción Audiovisual','Universidad'),(13,'Cirujano Dentista','Universidad'),(14,'Comercio Exterior y Aduanas','Universidad'),(15,'Comercio Internacional','Universidad'),(16,'Comercio y Negocios Internacionales','Universidad'),(17,'Comunicación','Universidad'),(18,'Contabilidad','Universidad'),(19,'Contador Público','Universidad'),(20,'Contaduría Pública y Consultoría de Negocios','Universidad'),(21,'Contaduría Pública y Finanzas','Universidad'),(22,'Contaduría y Auditoría','Universidad'),(23,'Cosmetología','Universidad'),(24,'Criminología','Universidad'),(25,'Derecho','Universidad'),(26,'Derecho Administrativo y Fiscal','Universidad'),(27,'Derecho y Argumentación Jurídica','Universidad'),(28,'Dirección Comercial y Mercadotecnia','Universidad'),(29,'Diseño Gráfico','Universidad'),(30,'Diseño Industrial','Universidad'),(31,'Diseño Multimedia','Universidad'),(32,'Diseño de Modas','Universidad'),(33,'Diseño y Decoración de Interiores','Universidad'),(34,'Diseño y Mercadotecnia en Modas','Universidad'),(35,'Doctorados en Ciencias de la Educación y Tecnologías de la Información','Universidad'),(36,'Educación Física','Universidad'),(37,'Educación Media Superior','Universidad'),(38,'Educación y Práctica Docente','Universidad'),(39,'Electrónica y Automatización','Universidad'),(40,'Energías Renovables','Universidad'),(41,'Enfermería','Universidad'),(42,'Entornos Virtuales y Negocios Digitales','Universidad'),(43,'Fisioterapia','Universidad'),(44,'Gastronomía','Universidad'),(45,'Gestión Artística y Cultural','Universidad'),(46,'Gestión de Negocios y Proyectos','Universidad'),(47,'Imagen y Relaciones Públicas','Universidad'),(48,'Ingeniero Agrícola y Ambiental','Universidad'),(49,'Ingeniero Agrónomo Administrador','Universidad'),(50,'Ingeniero Agrónomo Parasitólogo','Universidad'),(51,'Ingeniero Agrónomo Zootecnista','Universidad'),(52,'Ingeniero Agrónomo en Desarrollo Rural','Universidad'),(53,'Ingeniero Agrónomo en Horticultura','Universidad'),(54,'Ingeniero Agrónomo en Irrigación','Universidad'),(55,'Ingeniero Agrónomo en Producción','Universidad'),(56,'Ingeniero Forestal','Universidad'),(57,'Ingeniero Mecánico Agrícola','Universidad'),(58,'Ingeniero en Agrobiología','Universidad'),(59,'Ingeniero en Agroecología','Universidad'),(60,'Ingeniero en Biotecnología','Universidad'),(61,'Ingeniero en Ciencia y Tecnología de Alimentos','Universidad'),(62,'Ingeniero en Ciencias Agrarias','Universidad'),(63,'Ingeniero en Procesos Ambientales','Universidad'),(64,'Ingeniería','Universidad'),(65,'Ingeniería Agrónoma','Universidad'),(66,'Ingeniería Ambiental','Universidad'),(67,'Ingeniería Ambiental y Energías Alternativas','Universidad'),(68,'Ingeniería Ambiental y Sustentabilidad','Universidad'),(69,'Ingeniería Biomédica','Universidad'),(70,'Ingeniería Bioquímica','Universidad'),(71,'Ingeniería Civil','Universidad'),(72,'Ingeniería Electromecánica','Universidad'),(73,'Ingeniería Electrónica','Universidad'),(74,'Ingeniería Eléctrica','Universidad'),(75,'Ingeniería Forestal','Universidad'),(76,'Ingeniería Industrial','Universidad'),(77,'Ingeniería Industrial Administrativa','Universidad'),(78,'Ingeniería Industrial en Calidad','Universidad'),(79,'Ingeniería Industrial en Manufactura','Universidad'),(80,'Ingeniería Industrial y de Sistemas','Universidad'),(81,'Ingeniería Informática','Universidad'),(82,'Ingeniería Mecatrónica','Universidad'),(83,'Ingeniería Mecánica','Universidad'),(84,'Ingeniería Mecánica en Tecnología Industrial','Universidad'),(85,'Ingeniería Mecánica y Materiales','Universidad'),(86,'Ingeniería Mecánico en Maquinaria Automotriz','Universidad'),(87,'Ingeniería Química','Universidad'),(88,'Ingeniería Química y Desarrollo Sustentable','Universidad'),(89,'Ingeniería de Negocios','Universidad'),(90,'Ingeniería en Administración','Universidad'),(91,'Ingeniería en Agronomía','Universidad'),(92,'Ingeniería en Agronomía Zootecnista','Universidad'),(93,'Ingeniería en Agronomía con especialidad en Fitotecnia','Universidad'),(94,'Ingeniería en Animación y Efectos Visuales','Universidad'),(95,'Ingeniería en Biotecnología','Universidad'),(96,'Ingeniería en Ciberseguridad','Universidad'),(97,'Ingeniería en Ciencia de los Materiales','Universidad'),(98,'Ingeniería en Datos e Inteligencia Artificial','Universidad'),(99,'Ingeniería en Energía y Desarrollo Sostenible','Universidad'),(100,'Ingeniería en Energías Renovables','Universidad'),(101,'Ingeniería en Fruticultura','Universidad'),(102,'Ingeniería en Gestión Empresarial','Universidad'),(103,'Ingeniería en Industrias Alimentarias','Universidad'),(104,'Ingeniería en Informática','Universidad'),(105,'Ingeniería en Informática de Negocios','Universidad'),(106,'Ingeniería en Innovación Agrícola Sustentable','Universidad'),(107,'Ingeniería en Logística','Universidad'),(108,'Ingeniería en Logística Internacional','Universidad'),(109,'Ingeniería en Manejo Ambiental','Universidad'),(110,'Ingeniería en Manufactura Avanzada','Universidad'),(111,'Ingeniería en Manufactura y Robótica','Universidad'),(112,'Ingeniería en Materiales','Universidad'),(113,'Ingeniería en Mecatrónica','Universidad'),(114,'Ingeniería en Mercadotecnia','Universidad'),(115,'Ingeniería en Minas','Universidad'),(116,'Ingeniería en Nanotecnología','Universidad'),(117,'Ingeniería en Procesos Industriales','Universidad'),(118,'Ingeniería en Procesos de Calidad','Universidad'),(119,'Ingeniería en Producción Multimedia','Universidad'),(120,'Ingeniería en Sistemas Ambientales','Universidad'),(121,'Ingeniería en Sistemas Automotrices','Universidad'),(122,'Ingeniería en Sistemas Computacionales','Universidad'),(123,'Ingeniería en Sistemas Computacionales y Administrativos','Universidad'),(124,'Ingeniería en Software','Universidad'),(125,'Ingeniería en Tecnologías Computacionales','Universidad'),(126,'Ingeniería en Tecnologías de Manufactura','Universidad'),(127,'Ingeniería en Tecnologías de la Información','Universidad'),(128,'Ingeniería en Tecnologías de la Información e Innovación Digital','Universidad'),(129,'Ingeniería en Tecnologías de la Información y Comunicación','Universidad'),(130,'Ingeniería en Tecnologías de la Información y Negocios','Universidad'),(131,'Licenciado en Contaduría Pública','Universidad'),(132,'Licenciado en Economía Agrícola y Agronegocios','Universidad'),(133,'Licenciatura en Actuaría','Universidad'),(134,'Licenciatura en Administración','Universidad'),(135,'Licenciatura en Administración Estratégica','Universidad'),(136,'Licenciatura en Administración Financiera','Universidad'),(137,'Licenciatura en Administración Fiscal','Universidad'),(138,'Licenciatura en Administración Fiscal y Financiera','Universidad'),(139,'Licenciatura en Administración Industrial','Universidad'),(140,'Licenciatura en Administración de Empresas','Universidad'),(141,'Licenciatura en Administración de Empresas Turísticas','Universidad'),(142,'Licenciatura en Administración de Negocios','Universidad'),(143,'Licenciatura en Administración de Negocios Gastronómicos','Universidad'),(144,'Licenciatura en Administración de Obra Pública','Universidad'),(145,'Licenciatura en Administración de Recursos Humanos','Universidad'),(146,'Licenciatura en Administración y Estrategia de Negocios','Universidad'),(147,'Licenciatura en Administración y Gestión de Pymes','Universidad'),(148,'Licenciatura en Administración y Mercadotecnia','Universidad'),(149,'Licenciatura en Arquitectura','Universidad'),(150,'Licenciatura en Artes Visuales','Universidad'),(151,'Licenciatura en Artes Visuales y Plásticas','Universidad'),(152,'Licenciatura en Biología','Universidad'),(153,'Licenciatura en Biotecnología','Universidad'),(154,'Licenciatura en Capital Humano','Universidad'),(155,'Licenciatura en Ciencias Educativas','Universidad'),(156,'Licenciatura en Ciencias Políticas','Universidad'),(157,'Licenciatura en Ciencias Políticas y Administración Pública','Universidad'),(158,'Licenciatura en Ciencias Religiosas','Universidad'),(159,'Licenciatura en Ciencias de la Computación','Universidad'),(160,'Licenciatura en Ciencias de la Comunicación','Universidad'),(161,'Licenciatura en Ciencias de la Educación','Universidad'),(162,'Licenciatura en Ciencias y Técnicas de la Comunicación','Universidad'),(163,'Licenciatura en Comercio Internacional','Universidad'),(164,'Licenciatura en Comercio y Negocios Internacionales','Universidad'),(165,'Licenciatura en Comunicación Audiovisual y Multimedia','Universidad'),(166,'Licenciatura en Comunicación Social','Universidad'),(167,'Licenciatura en Comunicación y Medios Digitales','Universidad'),(168,'Licenciatura en Comunicación y Periodismo','Universidad'),(169,'Licenciatura en Consejería Familiar','Universidad'),(170,'Licenciatura en Contador Público','Universidad'),(171,'Licenciatura en Contaduría','Universidad'),(172,'Licenciatura en Contaduría Pública','Universidad'),(173,'Licenciatura en Contaduría Pública y Auditoría','Universidad'),(174,'Licenciatura en Contaduría Pública y Finanzas','Universidad'),(175,'Licenciatura en Criminología','Universidad'),(176,'Licenciatura en Criminología y Criminalística','Universidad'),(177,'Licenciatura en Criminología, Criminalística y Técnicas Periciales','Universidad'),(178,'Licenciatura en Cultura Física y Deporte','Universidad'),(179,'Licenciatura en Cultura y Expresión Artística','Universidad'),(180,'Licenciatura en Derecho','Universidad'),(181,'Licenciatura en Derecho con Acentuación en América del Norte','Universidad'),(182,'Licenciatura en Desarrollo de Talento y Cultura Organizacional','Universidad'),(183,'Licenciatura en Desarrollo e Innovación Educativa','Universidad'),(184,'Licenciatura en Diseño Gráfico','Universidad'),(185,'Licenciatura en Diseño Gráfico y Animación','Universidad'),(186,'Licenciatura en Diseño Industrial','Universidad'),(187,'Licenciatura en Diseño de Interiores','Universidad'),(188,'Licenciatura en Diseño y Comunicación Gráfica','Universidad'),(189,'Licenciatura en Docencia Tecnológica','Universidad'),(190,'Licenciatura en Docencia de Lengua Inglesa','Universidad'),(191,'Licenciatura en Economía','Universidad'),(192,'Licenciatura en Economía y Negocios Internacionales','Universidad'),(193,'Licenciatura en Educación','Universidad'),(194,'Licenciatura en Educación Artística Escolar','Universidad'),(195,'Licenciatura en Educación Especial','Universidad'),(196,'Licenciatura en Educación Física','Universidad'),(197,'Licenciatura en Educación Física y Deporte','Universidad'),(198,'Licenciatura en Educación Física, Deporte y Recreación','Universidad'),(199,'Licenciatura en Educación Física, Recreación y Deporte','Universidad'),(200,'Licenciatura en Educación Media','Universidad'),(201,'Licenciatura en Educación Preescolar','Universidad'),(202,'Licenciatura en Educación Preescolar y Primaria para el Medio Indígena','Universidad'),(203,'Licenciatura en Educación Primaria','Universidad'),(204,'Licenciatura en Educación Secundaria','Universidad'),(205,'Licenciatura en Educación Secundaria con especialidad en Biología, Geografía, Física, Química o Civismo','Universidad'),(206,'Licenciatura en Educación y Gestión de Instituciones Educativas','Universidad'),(207,'Licenciatura en Emprendimiento e Innovación','Universidad'),(208,'Licenciatura en Enfermería','Universidad'),(209,'Licenciatura en Enfermería y Obstetricia','Universidad'),(210,'Licenciatura en Enseñanza del Inglés','Universidad'),(211,'Licenciatura en Enseñanza y Aprendizaje de la Biología, Física, Química, Historia, Geografía o Formación Cívica y Ética en Educación Secundar','Universidad'),(212,'Licenciatura en Enseñanza y Aprendizaje de las Matemáticas en Educación Secundaria','Universidad'),(213,'Licenciatura en Enseñanza y Aprendizaje del Español en Educación Secundaria','Universidad'),(214,'Licenciatura en Enseñanza y Aprendizaje del Inglés en Educación Secundaria','Universidad'),(215,'Licenciatura en Estrategia y Transformación de Negocios','Universidad'),(216,'Licenciatura en Filosofía','Universidad'),(217,'Licenciatura en Finanzas','Universidad'),(218,'Licenciatura en Fisioterapia','Universidad'),(219,'Licenciatura en Física','Universidad'),(220,'Licenciatura en Gastronomía','Universidad'),(221,'Licenciatura en Gerontología Social','Universidad'),(222,'Licenciatura en Idioma Inglés','Universidad'),(223,'Licenciatura en Idiomas','Universidad'),(224,'Licenciatura en Idiomas y Relaciones Internacionales','Universidad'),(225,'Licenciatura en Idiomas y Relaciones Públicas','Universidad'),(226,'Licenciatura en Imagen Personal y Corporativa','Universidad'),(227,'Licenciatura en Inclusión Educativa','Universidad'),(228,'Licenciatura en Informática','Universidad'),(229,'Licenciatura en Inteligencia de Negocios','Universidad'),(230,'Licenciatura en Intervención Educativa','Universidad'),(231,'Licenciatura en Lenguas','Universidad'),(232,'Licenciatura en Logística Empresarial','Universidad'),(233,'Licenciatura en Matemáticas','Universidad'),(234,'Licenciatura en Medicina','Universidad'),(235,'Licenciatura en Mercadotecnia','Universidad'),(236,'Licenciatura en Mercadotecnia Digital','Universidad'),(237,'Licenciatura en Mercadotecnia y Publicidad','Universidad'),(238,'Licenciatura en Médico Cirujano','Universidad'),(239,'Licenciatura en Música','Universidad'),(240,'Licenciatura en Negocios Internacionales','Universidad'),(241,'Licenciatura en Nutrición','Universidad'),(242,'Licenciatura en Optometría','Universidad'),(243,'Licenciatura en Organización de Servicios Turísticos','Universidad'),(244,'Licenciatura en Pedagogía','Universidad'),(245,'Licenciatura en Pedagogía/Educación','Universidad'),(246,'Licenciatura en Psicología','Universidad'),(247,'Licenciatura en Psicología Humanista','Universidad'),(248,'Licenciatura en Radiología e Imagen','Universidad'),(249,'Licenciatura en Radiología e Imagenología','Universidad'),(250,'Licenciatura en Seguridad e Higiene Industrial','Universidad'),(251,'Licenciatura en Sistemas y Tecnologías de la Información','Universidad'),(252,'Licenciatura en Sociología','Universidad'),(253,'Licenciatura en Tecnologías de la Información','Universidad'),(254,'Licenciatura en Teología Holística','Universidad'),(255,'Licenciatura en Teología con enfoque en Servicio Social','Universidad'),(256,'Licenciatura en Teología con orientación en Consejería Familiar','Universidad'),(257,'Licenciatura en Terapia Física','Universidad'),(258,'Licenciatura en Terapia Física y Rehabilitación','Universidad'),(259,'Licenciatura en Terapia Ocupacional','Universidad'),(260,'Licenciatura en Trabajo Social','Universidad'),(261,'Licenciatura en Trabajo Social y Desarrollo Humano','Universidad'),(262,'Logística Internacional','Universidad'),(263,'Mantenimiento Industrial','Universidad'),(264,'Manufactura Inteligente','Universidad'),(265,'Mecatrónica','Universidad'),(266,'Medicina General','Universidad'),(267,'Mercadotecnia','Universidad'),(268,'Mercadotecnia Estratégica','Universidad'),(269,'Metal-Mecánica','Universidad'),(270,'Médico Cirujano','Universidad'),(271,'Médico Cirujano Odontólogo','Universidad'),(272,'Médico Veterinario Zootecnista','Universidad'),(273,'Negocios de la Hospitalidad','Universidad'),(274,'Nutrición','Universidad'),(275,'Nutrición y Ciencia de los Alimentos','Universidad'),(276,'Nutrición y Gastronomía','Universidad'),(277,'Odontología','Universidad'),(278,'Operaciones Comerciales Internacionales','Universidad'),(279,'Procesos Industriales','Universidad'),(280,'Psicología','Universidad'),(281,'Psicopedagogía','Universidad'),(282,'Químico Biotecnólogo','Universidad'),(283,'Químico Farmacéutico Biólogo','Universidad'),(284,'Relaciones Internacionales','Universidad'),(285,'Relaciones Internacionales e Idiomas','Universidad'),(286,'Sistemas de Computación Administrativa','Universidad'),(287,'TSU en Gerontología Social','Universidad'),(288,'TSU en Mantenimiento Industrial','Universidad'),(289,'TSU en Minería','Universidad'),(290,'TSU en Operaciones Comerciales Internacionales','Universidad'),(291,'TSU en Radiología e Imagen','Universidad'),(292,'TSU en Tecnologías de la Información y Comunicación','Universidad'),(293,'TSU en Terapia Física y Rehabilitación','Universidad'),(294,'Tecnologías de la Producción','Universidad'),(295,'Turismo','Universidad'),(296,'Técnico Profesional en Diseño Gráfico y Publicitario','Universidad'),(297,'Técnico Superior Universitario en Radiología e Imagen','Universidad'),(298,'Técnico en Radiología','Universidad'),(299,'Técnico en Terapia Física','Universidad'),(300,'Desarrollo Comunitario','Universidad'),(301,'Mercadotecnia Internacional','Universidad'),(302,'Administración y Gestión Pública','Universidad'),(303,'Gestión Territorial','Universidad'),(304,'Políticas y Proyectos Sociales','Universidad'),(305,'Gestión y Administración de PyME','Universidad'),(306,'Seguridad Pública','Universidad'),(307,'Ingeniería en Logística y Transporte','Universidad'),(308,'Ingeniería en Telemática','Universidad'),(309,'Licenciatura en Enseñanza de las Matemáticas','Universidad'),(310,'Licenciatura en Ingeniería en Gestión Industrial','Universidad'),(311,'Ingeniería en Tecnología Ambiental','Universidad'),(312,'Licenciatura en Gerencia de Servicios de Salud','Universidad'),(313,'Licenciatura en Nutrición Aplicada','Universidad'),(314,'Licenciatura en Promoción y Educación para la Salud','Universidad'),(315,'Licenciatura en Seguridad Alimentaria','Universidad'),(316,'Desarrollo de Videojuegos','Universidad'),(317,'Negocios y Manufactura','Universidad'),(318,'Diseño de Software y Redes','Universidad'),(319,'Finanzas y Banca','Universidad');



-- Datos de: datos_personales

INSERT INTO `datos_personales` VALUES (89,'Ileana Sarai','Hurtado','Flores','HUFI041127BQ3','HUFI041127MDGRLLA9','2004-11-27','Lerdo, Durango','8714296971','8714296971','ileanasf2711@gmail.com','Trigales 75','Hijos de Ejidatarios','Lerdo','35168','Durango','Soltero','2026-09-03');



-- Datos de: escuelas

INSERT INTO `escuelas` VALUES (1,'Escuela Superior de Educación Artistica Quetzalcoatl, S C.','Durango','Lerdo','Universidad'),(2,'Instituto de Estudios Superiores DCM','Durango','Lerdo','Universidad'),(3,'Instituto de Estudios Superiores de Educación Normal Gral. Lázaro Cárdenas del Rio','Durango','Lerdo','Universidad'),(4,'Instituto Tecnológico Superior de Lerdo (TecNM)','Durango','Lerdo','Universidad'),(5,'Escuela de Licenciatura en Educación Física, Deporte y Recreación Profr.  \"Antonio Estopier Estopier\"','Durango','Lerdo','Universidad'),(6,'Universidad Tecnológica de la Laguna de Durango','Durango','Lerdo','Universidad'),(7,'Instituto Tecnológico y de Estudios Superiores de Monterrey (ITESM), Campus Gómez Palacio','Durango','Gómez Palacio','Universidad'),(8,'División de Estudios Superiores del Instituto \"18 de Marzo\"','Durango','Gómez Palacio','Universidad'),(9,'Facultad de Ingeniería, Ciencias y Arquitectura (FICA) - UJED','Durango','Gómez Palacio','Universidad'),(10,'Escuela Normal Superior de la Laguna C.I','Durango','Gómez Palacio','Universidad'),(11,'Escuela Normal Superior de la Laguna C.O','Durango','Gómez Palacio','Universidad'),(12,'Facultad de Agricultura y Zootecnia (FAZ) - UJED','Durango','Gómez Palacio','Universidad'),(13,'Facultad de Ciencias de la Salud (FCS) - UJED','Durango','Gómez Palacio','Universidad'),(14,'Instituto de Educación Superior Francisco Gonzalez de la Vega','Durango','Gómez Palacio','Universidad'),(15,'Instituto Superior Francisco Gomez Palacio','Durango','Gómez Palacio','Universidad'),(16,'Universidad Autónoma de Durango (UAD), Campus Gómez Palacio','Durango','Gómez Palacio','Universidad'),(17,'Universidad Interamericana para el Desarrollo (UNID), Campus Gómez Palacio','Durango','Gómez Palacio','Universidad'),(18,'Universidad La Salle Laguna','Durango','Gómez Palacio','Universidad'),(19,'Universidad Politécnica de Gómez Palacio (UPGOP)','Durango','Gómez Palacio','Universidad'),(20,'Escuela Superior de Educación Artística Quetzalcóatl, S.C.','Durango','Gómez Palacio','Universidad'),(21,'Universidad del Tercer Milenio, Campus Gómez Palacio','Durango','Gómez Palacio','Universidad'),(22,'Benemérita y Centenaria Escuela Normal del Estado de Durango','Durango','Durango','Universidad'),(23,'Centro de Actualización del Magisterio','Durango','Durango','Universidad'),(24,'Centro de Estudios Universitarios Durango','Durango','Durango','Universidad'),(25,'Centro de Rehabilitación y Educación Especial (CREE)','Durango','Durango','Universidad'),(26,'Centro Universitario de Autoaprendizaje en Lenguas','Durango','Durango','Universidad'),(27,'Facultad de Ciencias Químicas - UJED','Durango','Durango','Universidad'),(28,'Facultad de Ciencias de la Cultura Física y Deporte - UJED','Durango','Durango','Universidad'),(29,'Facultad de Matemáticas - UJED','Durango','Durango','Universidad'),(30,'Facultad de Medicina - UJED','Durango','Durango','Universidad'),(31,'Facultad de Medicina Veterinaria y Zootecnia - UJED','Durango','Durango','Universidad'),(32,'Facultad de Trabajo Social - UJED','Durango','Durango','Universidad'),(33,'Instituto de Educación y Cultura Alejandría','Durango','Durango','Universidad'),(34,'Instituto Superior Fides et Ratio','Durango','Durango','Universidad'),(35,'Universidad Durango Santander','Durango','Durango','Universidad'),(36,'Universidad Politécnica de Durango','Durango','Durango','Universidad'),(37,'Universidad TecMilenio, Campus Durango','Durango','Durango','Universidad'),(38,'Facultad de Odontología - UJED','Durango','Durango','Universidad'),(39,'Escuela de Pintura, Escultura y Artesanías (EPEA) - UJED','Durango','Durango','Universidad'),(40,'Escuela Normal Superior \"Profr.  Moisés Sáenz Garza\".','Durango','Durango','Universidad'),(41,'Facultad de Ciencias Forestales y Ambientales - UJED','Durango','Durango','Universidad'),(42,'Facultad de Economía, Contaduría y Administración (FECA) - UJED','Durango','Durango','Universidad'),(43,'Facultad de Derecho y Ciencias Políticas - UJED','Durango','Durango','Universidad'),(44,'Facultad de Enfermería y Obstetricia - UJED','Durango','Durango','Universidad'),(45,'Universidad Autónoma de Durango (UAD), Campus Durango','Durango','Durango','Universidad'),(46,'Universidad José Vasconcelos (UJV)','Durango','Durango','Universidad'),(47,'Colegio Anglo Español de Durango A.C.','Durango','Durango','Universidad'),(48,'Universidad del Tercer Milenio, Campus Durango','Durango','Durango','Universidad'),(49,'Universidad Vizcaya de las Américas, Campus Durango','Durango','Durango','Universidad'),(50,'Instituto Tecnológico de Durango (TecNM)','Durango','Durango','Universidad'),(51,'Universidad Interamericana para el Desarrollo (UNID), Campus Durango','Durango','Durango','Universidad'),(52,'Universidad Autónoma España de Durango','Durango','Durango','Universidad'),(53,'Instituto Mexicano de Formación Ejecutiva (IMFE)','Durango','Durango','Universidad'),(54,'Instituto Tecnológico de Valle del Guadiana (TecNM)','Durango','Durango','Universidad'),(55,'Instituto Superior para la Actualización Magisterial y Ejecutiva (ISPAME)','Durango','Durango','Universidad'),(56,'Universidad Pedagógica Nacional, Unidad 101','Durango','Durango','Universidad'),(57,'Universidad del Valle de Guadiana','Durango','Durango','Universidad'),(58,'CIIDIR Durango IPN','Durango','Durango','Universidad'),(59,'Universidad Internacional Mexicana (UIM)','Durango','Durango','Universidad'),(60,'Academia de Arte y Diseño','Coahuila','Torreón','Universidad'),(61,'Centro de Estudios en Educación y Desarrollo Humano','Coahuila','Torreón','Universidad'),(62,'Centro Universitario Angloamericano, Plantel Torreón','Coahuila','Torreón','Universidad'),(63,'Colegio de Diseño y Decoración (CODISDEC)','Coahuila','Torreón','Universidad'),(64,'Facultad de Arquitectura - Universidad Autónoma de Coahuila (UAdeC)','Coahuila','Torreón','Universidad'),(65,'Facultad de Ciencias Biológicas - Universidad Autónoma de Coahuila (UAdeC)','Coahuila','Torreón','Universidad'),(66,'Facultad de Trabajo Social - Universidad Autónoma de Coahuila (UAdeC)','Coahuila','Torreón','Universidad'),(67,'Facultad de Enfermería \"Dr. Santiago Valdés Galindo\" - (UAdeC)','Coahuila','Torreón','Universidad'),(68,'Escuela Normal de Torreón','Coahuila','Torreón','Universidad'),(69,'Escuela Normal Particular Nueva Laguna','Coahuila','Torreón','Universidad'),(70,'Facultad de Administración Fiscal y Financiera (FAFF) - (UAdeC)','Coahuila','Torreón','Universidad'),(71,'Facultad de Ciencias Políticas y Sociales (FCPyS) - (UAdeC)','Coahuila','Torreón','Universidad'),(72,'Facultad de Contaduría y Administración - Universidad Autónoma de Coahuila (UAdeC)','Coahuila','Torreón','Universidad'),(73,'Facultad de Derecho - Universidad Autónoma de Coahuila (UAdeC)','Coahuila','Torreón','Universidad'),(74,'Facultad de Economía y Mercadotecnia - Universidad Autónoma de Coahuila (UAdeC)','Coahuila','Torreón','Universidad'),(75,'Facultad de Ingeniería Civil - Universidad Autónoma de Coahuila (UAdeC)','Coahuila','Torreón','Universidad'),(76,'Facultad de Ingeniería Mecánica y Eléctrica - Universidad Autónoma de Coahuila (UAdeC)','Coahuila','Torreón','Universidad'),(77,'Facultad de Medicina Unidad Torreón - Universidad Autónoma de Coahuila (UAdeC)','Coahuila','Torreón','Universidad'),(78,'Universidad Autónoma de La Laguna (UAL)','Coahuila','Torreón','Universidad'),(79,'Instituto Tecnológico y de Estudios Superiores de Monterrey (ITESM), Campus Laguna','Coahuila','Torreón','Universidad'),(80,'Universidad del Desarrollo Profesional (UNIDEP), Plantel Torreón','Coahuila','Torreón','Universidad'),(81,'Universidad Iberoamericana Torreón','Coahuila','Torreón','Universidad'),(82,'Escuela de Sistemas UL - Universidad Autónoma de Coahuila (UAdeC)','Coahuila','Torreón','Universidad'),(83,'Facultad de Odontología Unidad Torreón - Universidad Autónoma de Coahuila (UAdeC)','Coahuila','Torreón','Universidad'),(84,'Instituto de Educación Media y Superior Ma. Esther Zuno de Echeverría','Coahuila','Torreón','Universidad'),(85,'Instituto de Estudios de Posgrado en Ciencias y Humanidades A.C.','Coahuila','Torreón','Universidad'),(86,'Instituto Doctor Carlos Coqui (Universidad IDCC)','Coahuila','Torreón','Universidad'),(87,'Instituto Grecolatino A.C.','Coahuila','Torreón','Universidad'),(88,'Instituto Mexicano de Estudios Superiores (IMES)','Coahuila','Torreón','Universidad'),(89,'Instituto Superior de Administración y Negocios (ISAN)','Coahuila','Torreón','Universidad'),(90,'Instituto Tecnológico de la Laguna (TecNM)','Coahuila','Torreón','Universidad'),(91,'Instituto Tecnológico de Torreón (TecNM)','Coahuila','Torreón','Universidad'),(92,'Instituto Universitario del Norte (INSUNTE)','Coahuila','Torreón','Universidad'),(93,'Universidad Autónoma del Noreste (UANE), Campus Torreón','Coahuila','Torreón','Universidad'),(94,'Universidad de Estudios Avanzados (UNEA), Campus Torreón','Coahuila','Torreón','Universidad'),(95,'Universidad del Valle de México (UVM)','Coahuila','Torreón','Universidad'),(96,'Universidad TecMilenio, Campus Laguna','Coahuila','Torreón','Universidad'),(97,'Universidad Tecnológica de Torreón (UTT)','Coahuila','Torreón','Universidad'),(98,'Universidad Pedagógica Nacional (UPN), Unidad 052 Torreón','Coahuila','Torreón','Universidad'),(99,'Benemérita Escuela Normal de Coahuila','Coahuila','Saltillo','Universidad'),(100,'Facultad de Artes Plásticas Prof. Rubén Herrera - (UAdeC)','Coahuila','Saltillo','Universidad'),(101,'Escuela de Ciencias Sociales - Universidad Autónoma de Coahuila (UAdeC)','Coahuila','Saltillo','Universidad'),(102,'Facultad de Enfermería y Nutrición “Dr.  Santiago Valdés Galindo” - (UAdeC)','Coahuila','Saltillo','Universidad'),(103,'Facultad de Psicología - Universidad Autónoma de Coahuila (UAdeC)','Coahuila','Saltillo','Universidad'),(104,'Escuela Normal de Educación Física de Saltillo (ENEF)','Coahuila','Saltillo','Universidad'),(105,'Escuela Normal de Educación Prescolar del Estado','Coahuila','Saltillo','Universidad'),(106,'Escuela Normal Regional de Especialización (ENRE)','Coahuila','Saltillo','Universidad'),(107,'Escuela Superior de Música, Campus Saltillo - (UAdeC)','Coahuila','Saltillo','Universidad'),(108,'Facultad de Arquitectura - Universidad Autónoma de Coahuila (UAdeC)','Coahuila','Saltillo','Universidad'),(109,'Facultad de Ciencias de la Administración - Universidad Autónoma de Coahuila (UAdeC)','Coahuila','Saltillo','Universidad'),(110,'Facultad de Ciencias de la Comunicación - Universidad Autónoma de Coahuila (UAdeC)','Coahuila','Saltillo','Universidad'),(111,'Facultad de Ciencias de la Educación y Humanidades - Universidad Autónoma de Coahuila (UAdeC)','Coahuila','Saltillo','Universidad'),(112,'Facultad de Ciencias Físico Matemáticas (FCFM) - Universidad Autónoma de Coahuila (UAdeC)','Coahuila','Saltillo','Universidad'),(113,'Facultad de Ciencias Químicas - Universidad Autónoma de Coahuila (UAdeC)','Coahuila','Saltillo','Universidad'),(114,'Facultad de Economía - Universidad Autónoma de Coahuila (UAdeC)','Coahuila','Saltillo','Universidad'),(115,'Facultad de Ingeniería - Universidad Autónoma de Coahuila (UAdeC)','Coahuila','Saltillo','Universidad'),(116,'Facultad de Jurisprudencia - Universidad Autónoma de Coahuila (UAdeC)','Coahuila','Saltillo','Universidad'),(117,'Facultad de Medicina - Universidad Autónoma de Coahuila (UAdeC)','Coahuila','Saltillo','Universidad'),(118,'Facultad de Mercadotecnia - Universidad Autónoma de Coahuila (UAdeC)','Coahuila','Saltillo','Universidad'),(119,'Facultad de Odontología - Universidad Autónoma de Coahuila (UAdeC)','Coahuila','Saltillo','Universidad'),(120,'Facultad de Sistemas - Universidad Autónoma de Coahuila (UAdeC)','Coahuila','Saltillo','Universidad'),(121,'Facultad de Trabajo Social - Universidad Autónoma de Coahuila (UAdeC)','Coahuila','Saltillo','Universidad'),(122,'Facultades Universitarias de Saltillo','Coahuila','Saltillo','Universidad'),(123,'Instituto de Ciencia y Cultura A.C.','Coahuila','Saltillo','Universidad'),(124,'Instituto de Estudios Superiores Enseñanza y Capacitación','Coahuila','Saltillo','Universidad'),(125,'Instituto de Estudios Superiores para el Desarrollo Integral (IESDI)','Coahuila','Saltillo','Universidad'),(126,'Instituto Tecnológico y de Estudios Superiores de Monterrey (ITESM), Campus Saltillo','Coahuila','Saltillo','Universidad'),(127,'Instituto Tecnológico de Saltillo (ITS)','Coahuila','Saltillo','Universidad'),(128,'Instituto Universitario del Norte','Coahuila','Saltillo','Universidad'),(129,'Universidad a Distancia Extensión Derramadero','Coahuila','Saltillo','Universidad'),(130,'Universidad Autónoma Agraria Antonio Narro (UAAAN)','Coahuila','Saltillo','Universidad'),(131,'Universidad Autónoma del Noreste (UANE)','Coahuila','Saltillo','Universidad'),(132,'Universidad CNCI, Campus Saltillo','Coahuila','Saltillo','Universidad'),(133,'Universidad Vizcaya de las Américas (UVA), Campus Saltillo','Coahuila','Saltillo','Universidad'),(134,'Universidad del Desarrollo Profesional (UNIDEP), Plantel Saltillo','Coahuila','Saltillo','Universidad'),(135,'Universidad del Valle de México (UVM), Campus Saltillo','Coahuila','Saltillo','Universidad'),(136,'Universidad del Valle de Santiago (UNIVAS)','Coahuila','Saltillo','Universidad'),(137,'Universidad Interamericana para el Desarrollo (UNID), Campus Saltillo','Coahuila','Saltillo','Universidad'),(138,'Universidad La Salle Saltillo','Coahuila','Saltillo','Universidad'),(139,'Universidad Tecnológica de Saltillo (UTS)','Coahuila','Saltillo','Universidad'),(140,'Universidad Pedagógica Nacional (UPN), Unidad 051 Saltillo','Coahuila','Saltillo','Universidad');



-- Datos de: roles

INSERT INTO `roles` VALUES (1,'Administrador','Tiene acceso completo al sistema. Puede gestionar usuarios, expedientes, formularios, formatos, catálogos y la configuración del sistema.'),(2,'Usuario','Puede registrar y consultar expedientes, llenar formularios y generar formatos de acuerdo con los permisos asignados.');



-- Datos de: tipos_documento

INSERT INTO `tipos_documento` VALUES (1,'ADSCRIPCION','Adscripción','Documentos relacionados con la asignación del prestador a una unidad de salud, cambios de adscripción y oficios correspondientes.'),(2,'SERVICIO_SOCIAL','Servicio Social','Documentos relacionados con el proceso de servicio social del prestador.'),(3,'FICHA_IDENTIFICACION','Ficha de Identificación','Ficha que contiene la información personal, escolar, de adscripción y de contacto del prestador.'),(4,'INCIDENCIAS_BECARIOS','Incidencias Becarios','Documentos que registran incidencias administrativas, disciplinarias o de asistencia del becario.'),(5,'VACACIONES_BECARIOS','Vacaciones Becarios','Solicitudes, autorizaciones y documentos relacionados con los periodos vacacionales del becario.'),(6,'LIBERACION','Liberación','Documentos que acreditan la conclusión y liberación de la residencia, internado, prácticas o servicio social.'),(7,'COMISION','Comisión','Documentos que autorizan al prestador a realizar actividades fuera de su unidad de adscripción.'),(8,'CARTA_PRESENTACION','Carta de Presentación','Documento emitido por la institución educativa para presentar oficialmente al alumno ante la unidad receptora.'),(9,'CARTA_ACEPTACION','Carta de Aceptación','Documento emitido por la unidad receptora mediante el cual acepta al prestador.'),(10,'CARTA_TERMINO','Carta de Término','Documento que acredita la conclusión satisfactoria del periodo de formación.'),(11,'CURP','CURP','Copia de la Clave Única de Registro de Población del prestador.'),(12,'RFC','RFC','Constancia de inscripción al Registro Federal de Contribuyentes.'),(13,'ACTA_NACIMIENTO','Acta de Nacimiento','Documento oficial que acredita la identidad y fecha de nacimiento del prestador.'),(14,'IDENTIFICACION_OFICIAL','Identificación Oficial','Documento oficial vigente con fotografía para acreditar la identidad del prestador.'),(15,'COMPROBANTE_DOMICILIO','Comprobante de Domicilio','Documento que acredita el domicilio actual del prestador.'),(16,'CONSTANCIA_ESTUDIOS','Constancia de Estudios','Documento expedido por la institución educativa que acredita la situación académica del alumno.'),(17,'HISTORIAL_ACADEMICO','Historial Académico','Documento oficial que contiene las materias cursadas, calificaciones y promedio.'),(18,'CERTIFICADO_ESTUDIOS','Certificado de Estudios','Documento que acredita la conclusión parcial o total de un programa académico.'),(19,'TITULO_PROFESIONAL','Título Profesional','Documento que acredita la obtención del grado profesional correspondiente.'),(20,'CEDULA_PROFESIONAL','Cédula Profesional','Documento oficial que autoriza el ejercicio profesional.'),(21,'SEGURO_FACULTATIVO','Seguro Facultativo','Documento que acredita la afiliación al seguro facultativo o cobertura médica.'),(22,'VIGENCIA_DERECHOS','Constancia de Vigencia de Derechos','Documento emitido por la institución de seguridad social que acredita la vigencia de los derechos del prestador.'),(23,'CARTA_COMPROMISO','Carta Compromiso','Documento mediante el cual el prestador acepta cumplir las normas y obligaciones institucionales.'),(24,'CARTA_CONFIDENCIALIDAD','Carta de Confidencialidad','Documento mediante el cual el prestador se compromete a proteger la información confidencial de la institución.'),(25,'CURRICULUM_VITAE','Currículum Vitae','Resumen de la formación académica, experiencia y competencias del prestador.'),(26,'FOTOGRAFIA','Fotografía','Fotografía reciente del prestador para identificación en el expediente.'),(27,'CONSTANCIA_VACUNACION','Constancia de Vacunación','Documento que acredita el cumplimiento del esquema de vacunación requerido.'),(28,'EXAMEN_MEDICO','Examen Médico','Documento que certifica el estado de salud y la aptitud del prestador para realizar sus actividades.'),(29,'OFICIO','Oficio','Documento administrativo utilizado para comunicaciones oficiales relacionadas con el expediente.'),(30,'CONSTANCIA','Constancia','Documento que certifica un hecho, actividad o situación específica del prestador.'),(31,'OTRO','Otro','Documento que no corresponde a ninguna de las categorías anteriores.');



-- Datos de: tipos_personal

INSERT INTO `tipos_personal` VALUES (1,'Residente','Prestador que realiza una residencia dentro de una unidad o institución registrada en el SIEES.'),(2,'Practicante','Prestador que realiza prácticas académicas o profesionales en una unidad o institución registrada en el SIEES.'),(3,'Servicio Social','Prestador que cumple con su servicio social en una unidad o institución registrada en el SIEES.'),(4,'Pasante','Prestador que participa como pasante en una unidad o institución registrada en el SIEES.');



-- Datos de: unidades

INSERT INTO `unidades` VALUES (1,1,'GÓMEZ PALACIO','DGSSA000710','RUBÉN JARAMILLO'),(2,1,'GÓMEZ PALACIO','DGSSA000722','GONZÁLEZ DE LA VEGA'),(3,1,'GÓMEZ PALACIO','DGSSA000734','INDEPENDENCIA'),(4,1,'GÓMEZ PALACIO','DGSSA000746','COLONIA LAS LUISAS'),(5,1,'GÓMEZ PALACIO','DGSSA000751','NOGALES'),(6,1,'GÓMEZ PALACIO','DGSSA000763','COLONIA JOSÉ LÓPEZ PORTILLO'),(7,1,'GÓMEZ PALACIO','DGSSA000775','COLONIA 15 DE DICIEMBRE'),(8,1,'GÓMEZ PALACIO','DGSSA000780','CESSA DR. ISAURO VENZOR (JEF. ÁREA 1)'),(9,1,'GÓMEZ PALACIO','DGSSA000792','BRITTINGHAM'),(10,1,'GÓMEZ PALACIO','DGSSA000804','EJIDO CALIFORNIA'),(11,1,'GÓMEZ PALACIO','DGSSA000816','GREGORIO GARCÍA'),(12,1,'GÓMEZ PALACIO','DGSSA000821','PASTOR ROUAIX'),(13,1,'GÓMEZ PALACIO','DGSSA000833','LA POPULAR'),(14,1,'GÓMEZ PALACIO','DGSSA000845','SAN FELIPE (EL COMPÁS)'),(15,1,'GÓMEZ PALACIO','DGSSA000850','SANTA CRUZ LUJÁN'),(16,1,'GÓMEZ PALACIO','DGSSA002262','SAN JOSÉ DEL VIÑEDO'),(17,1,'GÓMEZ PALACIO','DGSSA002332','COLONIA FELIPE ÁNGELES'),(18,1,'GÓMEZ PALACIO','DGSSA017423','UNEME CECOSAMA GÓMEZ PALACIO'),(19,1,'GÓMEZ PALACIO','DGSSA017435','UNEME SALUD MENTAL GÓMEZ PALACIO (CISAME)'),(20,1,'GÓMEZ PALACIO','DGSSA017686','UNEME CRÓNICAS GÓMEZ PALACIO'),(21,1,'GÓMEZ PALACIO','DGSSA003131','UNEME CÁNCER DE MAMA GÓMEZ PALACIO (DEDICAM)'),(22,1,'GÓMEZ PALACIO','DGSSA002414','HOSPITAL NUEVO GÓMEZ PALACIO 2° NIVEL'),(23,1,'MAPIMÍ','DGSSA001166','BERMEJILLO'),(24,1,'MAPIMÍ','DGSSA001171','CEBALLOS'),(25,1,'MAPIMÍ','DGSSA001183','JARALITO'),(26,1,'MAPIMÍ','DGSSA017295','H.I MAPIMÍ'),(27,1,'MAPIMÍ','DGSSA001154','UNIDAD MÉDICA MÓVIL T0, MAPIMÍ'),(28,1,'MAPIMÍ','DGSSA017715','UNIDAD MÉDICA MÓVIL T3 MAPIMÍ, CENTRO'),(29,1,'MAPIMÍ','DGSSA017814','UNEME ENFERMEDADES CRÓNICAS BERMEJILLO'),(30,1,'MAPIMÍ','DGSSA001796','UNIDAD MÉDICA MÓVIL SAN JUAN DE GPE 1'),(31,1,'TLAHUALILO','DGSSA002105','TLAHUALILO DE ZARAGOZA'),(32,1,'TLAHUALILO','DGSSA002110','BANCO NACIONAL'),(33,1,'TLAHUALILO','DGSSA002122','LA CAMPANA'),(34,1,'TLAHUALILO','DGSSA002134','SAN FRANCISCO DE HORIZONTE'),(35,1,'TLAHUALILO','DGSSA002146','JAUJA'),(36,1,'TLAHUALILO','DGSSA002151','LUCERO'),(37,1,'TLAHUALILO','DGSSA002164','UNIDAD MÉDICA MÓVIL T0 TLAHUALILO'),(38,1,'TLAHUALILO','DGSSA017621','GRANJA MORELOS'),(39,2,'LERDO','DGSSA001014','COLONIA CÉSAR G. MERAZ'),(40,2,'LERDO','DGSSA001026','COLONIA SAN ISIDRO'),(41,2,'LERDO','DGSSA001031','DR. ROBERTO GARCÍA SOSA (JEF. ÁREA 2)'),(42,2,'LERDO','DGSSA001043','LOS ÁNGELES'),(43,2,'LERDO','DGSSA001055','CARLOS REAL'),(44,2,'LERDO','DGSSA001060','LEÓN GUZMÁN'),(45,2,'LERDO','DGSSA001072','JUAN E. GARCÍA'),(46,2,'LERDO','DGSSA001084','LA LOMA'),(47,2,'LERDO','DGSSA001096','LA LUZ'),(48,2,'LERDO','DGSSA001101','NAZARENO'),(49,2,'LERDO','DGSSA001113','NUEVO GRACEROS'),(50,2,'LERDO','DGSSA001125','21 DE MARZO'),(51,2,'LERDO','DGSSA001130','CD. JUÁREZ, DGO'),(52,2,'LERDO','DGSSA002320','CENTRO DE SALUD SAPIORIZ'),(53,2,'LERDO','DGSSA003173','CENTRO DE SALUD RURAL SAN JACINTO'),(54,2,'LERDO','DGSSA003140','UNEME ENFERMEDADES CRÓNICAS LERDO'),(55,2,'LERDO','DGSSA017761','HOSPITAL GENERAL LERDO 2° NIVEL'),(56,2,'SIMÓN BOLÍVAR','DGSSA000664','IGNACIO ZARAGOZA'),(57,3,'NAZAS','DGSSA017826','H.I NAZAS (JEF. ÁREA 3)'),(58,3,'NAZAS','DGSSA001352','PASO NACIONAL'),(59,3,'NAZAS','DGSSA001364','LA PERLA'),(60,3,'NAZAS','DGSSA001376','LÁZARO CÁRDENAS'),(61,3,'NAZAS','DGSSA001340','DOLORES HIDALGO'),(62,3,'SAN LUIS DEL CORDERO','DGSSA001854','SAN LUIS DEL CORDERO'),(63,3,'SAN PEDRO DEL GALLO','DGSSA001866','SAN PEDRO DEL GALLO'),(64,3,'SAN PEDRO DEL GALLO','DGSSA001871','SANTO DOMINGO'),(65,4,'CUÉNCAMÉ','DGSSA000121','CUÉNCAMÉ (JEF. ÁREA 4)'),(66,4,'CUÉNCAMÉ','DGSSA000133','IGNACIO LÓPEZ RAYÓN'),(67,4,'CUÉNCAMÉ','DGSSA000145','PEDRO VÉLEZ'),(68,4,'CUÉNCAMÉ','DGSSA000150','RAMÓN CORONA'),(69,4,'CUÉNCAMÉ','DGSSA000162','LA ROCA'),(70,4,'CUÉNCAMÉ','DGSSA000174','LA VIRGEN'),(71,4,'CUÉNCAMÉ','DGSSA000116','HOSPITAL REGIONAL DE CUÉNCAMÉ 2° NIVEL'),(72,4,'PEÑÓN BLANCO','DGSSA001545','H.I PEÑÓN BLANCO'),(73,4,'SANTA CLARA','DGSSA001883','SANTA CLARA'),(74,4,'SIMÓN BOLÍVAR','DGSSA000640','H.I SIMÓN BOLÍVAR'),(75,4,'SIMÓN BOLÍVAR','DGSSA017732','UNIDAD MÓVIL SIMÓN BOLÍVAR, LA ESPERANZA'),(76,5,'SAN JUAN DE GPE','DGSSA001801','SAN JUAN DE GUADALUPE (JEF. ÁREA 5)'),(77,5,'SAN JUAN DE GPE','DGSSA001813','BENITO JUÁREZ'),(78,5,'SAN JUAN DE GPE','DGSSA017720','UNIDAD MÓVIL SAN JUAN DE GPE');



-- Datos de: adscripciones

INSERT INTO `adscripciones` VALUES (34,'2026-06-01','2026-11-01',48,8,1,'Principal'),(36,'2026-06-01','2026-11-01',50,8,1,'Principal'),(73,'2026-07-01','2026-12-01',89,8,1,'Principal');



-- Datos de: beneficiarios

INSERT INTO `beneficiarios` VALUES (34,'Araceli Flores',49,'Madre',47),(35,'Araceli Flores',49,'Madre',48),(37,'Araceli Flores',49,'Madre',50),(76,'Araceli Flores',49,'Madre',89);



-- Datos de: contactos_emergencia

INSERT INTO `contactos_emergencia` VALUES (22,'Araceli Flores','Madre','8714296971',47),(23,'Araceli Flores','Madre','8714296971',48),(25,'Araceli Flores','Madre','8714296971',50),(53,'Araceli Flores','Madre','8714296971',89);

-- Datos de: datos_escolares

INSERT INTO `datos_escolares` VALUES (22,9.50,1,'53220450695',8,47,4),(23,9.50,1,'53220450695',122,48,4),(25,9.50,1,'53220450695',122,50,4),(53,9.50,1,'53220450695',122,89,4);



-- Datos de: usuarios

INSERT INTO `usuarios` VALUES (1,'Isaac','Castro','Gomez','222310291@itslerdo.edu.mx','$2b$10$Z0AO8IXG6LxLXaxld0EyteO62y/PEeBmMzzaRYqNPRaMnUAESC1Bq','2026-07-08 12:18:20',1,1),(2,'Ileana Sarai','Hurtado','Flores','222310202@itslerdo.edu.mx','$2b$10$Z0AO8IXG6LxLXaxld0EyteO62y/PEeBmMzzaRYqNPRaMnUAESC1Bq','2026-07-08 12:18:20',1,2),(3,'Maria Monserrath','Rodriguez','Rivera','222310352@itslerdo.edu.mx','$2b$10$Z0AO8IXG6LxLXaxld0EyteO62y/PEeBmMzzaRYqNPRaMnUAESC1Bq','2026-07-08 12:18:20',1,1),(4,'Victoria Fernanda','Torres','Hernandez','222310166@itslerdo.edu.mx','$2b$10$Z0AO8IXG6LxLXaxld0EyteO62y/PEeBmMzzaRYqNPRaMnUAESC1Bq','2026-07-08 12:18:20',1,2);

-- Datos de: documentos

INSERT INTO `documentos` VALUES (9,'Ficha_Identificacion_Hurtado_Flores.pdf','1wrk29I1prSUCosKanZi3U2mdJXFUfcH1','application/pdf',150261,'2026-09-03 18:25:53',2,60,3,'Ficha Identificacion'),(10,'Carta_Adscripcion_Hurtado_Flores.pdf','1vOZ5aQcMAN7Xa-Hzh3uxKQ1hikyQ3x7A','application/pdf',204032,'2026-09-03 19:03:55',2,60,3,'Carta Adscripcion');




CREATE OR REPLACE VIEW vw_expedientes AS
SELECT
    cd.Id_Carpeta,
    CONCAT(
        dp.Nombre, ' ',
        dp.Apellido_Paterno, ' ',
        dp.Apellido_Materno
    ) AS Nombre_Completo,
    dp.CURP,
    dp.Telefono,
    u.Nombre AS Adscripcion,
    c.Nombre AS Carrera,
    e.Nombre AS Escuela
FROM Carpetas_Drive cd
INNER JOIN Adscripciones a
    ON a.Id_Adscripcion = cd.Id_Adscripcion
INNER JOIN Datos_Personales dp
    ON dp.Id_Persona = a.Id_Persona_Adscripcion
INNER JOIN Unidades u
    ON u.Id_Unidad = a.Id_Unidad_Adscripcion
INNER JOIN Datos_Escolares de
    ON de.Id_Persona_D_Escolar = dp.Id_Persona
INNER JOIN Carreras c
    ON c.Id_Carrera = de.Id_Carrera_D_Escolar
INNER JOIN Escuelas e
    ON e.Id_Escuela = de.Id_Escuela_D_Escolar;

USE SIEES;

CREATE OR REPLACE VIEW vw_informacion_general_expediente AS
SELECT
    cd.Id_Carpeta,
    cd.Drive_Folder_Id,
    cd.Nombre_Carpeta,
    dp.Id_Persona,
    CONCAT(
        dp.Nombre, ' ',
        dp.Apellido_Paterno, ' ',
        dp.Apellido_Materno
    ) AS Nombre_Completo,
    dp.Nombre,
    dp.Apellido_Paterno,
    dp.Apellido_Materno,
    dp.CURP,
    dp.Telefono,
    dp.Correo,
    dp.Fecha_Nac,
    u.Nombre AS Adscripcion,
    tp.Nombre AS Tipo_Personal,
    uc.Nombre AS Comision,
    c.Nombre AS Carrera,
    e.Nombre AS Escuela,
    a.Fecha_Inicio,
    a.Fecha_Termino
FROM Carpetas_Drive cd
INNER JOIN Adscripciones a
    ON a.Id_Adscripcion = cd.Id_Adscripcion
    AND a.Tipo_Adscripcion = 'Principal'
INNER JOIN Tipos_Personal tp
    ON tp.Id_Tipo_Personal = a.Id_Tipo_Personal_Ad
INNER JOIN Datos_Personales dp
    ON dp.Id_Persona = a.Id_Persona_Adscripcion
INNER JOIN Unidades u
    ON u.Id_Unidad = a.Id_Unidad_Adscripcion
LEFT JOIN Adscripciones ac
    ON ac.Id_Persona_Adscripcion = dp.Id_Persona
    AND ac.Tipo_Adscripcion = 'Comision'
LEFT JOIN Unidades uc
    ON uc.Id_Unidad = ac.Id_Unidad_Adscripcion
INNER JOIN Datos_Escolares de
    ON de.Id_Persona_D_Escolar = dp.Id_Persona
INNER JOIN Carreras c
    ON c.Id_Carrera = de.Id_Carrera_D_Escolar
INNER JOIN Escuelas e
    ON e.Id_Escuela = de.Id_Escuela_D_Escolar;
    
ALTER TABLE Documentos
ADD COLUMN Tipo VARCHAR(100) NOT NULL;

-- TABLA: VACACIONES_BECARIOS --
CREATE TABLE vacaciones_becarios (
    Id_Vacaciones INT NOT NULL AUTO_INCREMENT,
    Id_Persona_Vacaciones INT NOT NULL,
    Fecha_Solicitud DATE NOT NULL DEFAULT (CURRENT_DATE),
    Fecha_Inicio DATE NOT NULL,
    Fecha_Termino DATE NOT NULL,
    Dias_Vacaciones INT NOT NULL,
    Observaciones VARCHAR(255) DEFAULT NULL,
    Estado ENUM('Pendiente', 'Autorizada', 'Rechazada') 
        NOT NULL DEFAULT 'Pendiente',
    Fecha_Autorizacion DATE DEFAULT NULL,
    PRIMARY KEY (Id_Vacaciones),
    KEY FK_Id_Persona_Vacaciones (Id_Persona_Vacaciones),
    CONSTRAINT FK_Id_Persona_Vacaciones
        FOREIGN KEY (Id_Persona_Vacaciones)
        REFERENCES datos_personales (Id_Persona)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);