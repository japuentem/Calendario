---
tipo: Especificación Funcional
codigo:
modulo:
version_funcional: 1
estado: Borrador
autor:
fecha_creacion: 2026-07-17T14:11:00
ultima_actualizacion:
---

# Especificación Funcional del Módulo

> Documento que describe el comportamiento funcional estándar del módulo CALENDARIO. Sirve como referencia para analistas, diseñadores, desarrolladores y personal de pruebas. Las historias de usuario deberán alinearse con esta especificación.

ES EL CALENDARIO VISIBLE EN PAGINAS WEB PARA QUE USUARIOS TERCEROS AGENDEN EVENTOS CON UN DUEÑO DE CALENDARIO

---

# 1. Identificación del Módulo

| Campo             | Valor               |
| ----------------- | ------------------- |
| Código            | CAL-3ROS            |
| Nombre            | CALENDARIO-TERCEROS |
| Tipo              | Reutilizable        |
| Dominio           |                     |
| Versión Funcional |                     |
| Responsable       |                     |

### Sistemas donde puede utilizarse

- CUALQUIERA DONDE UN RESPONSABLE DE DAR SERVICIO REQUIERA INTERACIONES PROGRAMADAS CON TERCEROS
- CUALQUIERA DONDE EXISTAN PROCESOS DEFINIDOS DONDE SE REQUIERAN INTERACCIONES EN ALGUNO DE LOS PASOS
- 

### Roles involucrados

- 
- USUARIO TERCERO

---

# 2. Objetivo

ES UN COMPONENTE QUE PUEDE INTEGRARSE EN FLUJOS DE TRABAJO Y EN APLICACIONES QUE REQUIERAN COORDINACION DE UN RESPONSABLE DE DAR ASISTENCIA O SERVICIOS A TERCEROS (USUARIOS TERCEROS)

---

# 3. Alcance

## Incluye

- COMPONENTE PARA USUARIO TERCERO
-  CANCELACION O REAGENDAR  EVENTO POR PARTE DEL USUARIO TERCERO

## No incluye

- 
- COMPONENTES DE AUTENTICACION PARA USUARIOS TERCEROS, YA QUE EL COMPONENTE CALENDARIO PUEDE ESTAR ABIERTO EN SU USO AL PUBLICO O RECIBIR E UN USUARIO TERCERO QUE YA HAYA SIDO AUTENTICADO Y LLEGUE AL COMPONENTE POR TRANSFERENCIA DE CONTROL
- 

---

# 4. Flujo Operativo Estándar

Describa el comportamiento normal del módulo independientemente del rol del usuario.

```text
Inicio (FLUJO NORMAL - DESDE PAGINA WEB)
   │
   ▼
Pantalla 1 / Paso SELECCION DE DIA, EVENTO, TEMA Y ADICIONALES
   │
   ▼
Pantalla 2 / Paso SELECCION DE HORA
   │
   ▼
Pantalla 3 / Paso 3 CAPTURA DE DATOS PARA EVENTO
   │
   ▼
Pantalla 4 / Paso 3 AGRADECIMIENTO Y CONFIRMACION DE DATOS
   │
   ▼
Fin


Inicio (FLUJO REPROGRAMACION - DESDE BOTON DE CORREO -> PAGINA WEB)
   │
   ▼
Pantalla 5 / Paso SELECCION DE DIA (EVENTO, TEMA Y ADICIONALES PRECARGADOS)
   │
   ▼
Pantalla 2 / Paso SELECCION DE HORA (IGUAL A FLUJO NORMAL)
   │
   ▼
Pantalla 3 / Paso 3 CAPTURA DE DATOS PARA EVENTO (IGUAL A FLUJO NORMAL)
   │
   ▼
Pantalla 4 / Paso 3 AGRADECIMIENTO Y CONFIRMACION DE DATOS (IGUAL FLUJO NORMAL)
   │
   ▼
Fin


Inicio (FLUJO CANCELACION - DESDE BOTON DE CORREO -> PAGINA WEB)
   │
   ▼
Pantalla 6 / Paso CONFIRMACION DE CANCELACION
   │
   ▼
Fin

```

### PANTALLA 1 (PROPUESTA)

![[Pasted image 20260718192851.png]]

### PANTALLA 2 (PROPUESTA)

![[Pasted image 20260718193744.png]]

### PANTALLA 3 (PROPUESTA)

![[PANTALLAS CALENDARIO USUARIO AJ P3.jpg]]

### PANTALLA 4 (PROPUESTA)

![[Pasted image 20260718194818.png]]

### PANTALLA 5 (PROPUESTA)

![[Pasted image 20260721214507.png]]

### PANTALLA 6 (PROPUESTA)

![[Pasted image 20260721214848.png]]


### PANTALLA 7 (PROPUESTA) para cuando ya no es posible cancelar la reserva o reagendar *este evento no puede [reagendarse / cancelarse] debido a que los tiempos establecidos no lo permiten*

### Descripción del flujo

| Paso | Descripción                                                                                                                                                                                                    |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | SELECCIONA EL DIA, EL TIPO DE EVENTO, CAPTURA EL TEMA A TRATAR Y SI TIENE ARCHIVO ADJUNTO LO CARGA Y DA EN BOTON "INDICANOS CORREO"                                                                            |
| 2    | VE LA INFORMACION PROPORCIONADA Y SELECCIONA UN HORARIO Y PRESIONA "INDICANOS CORREO"                                                                                                                          |
| 3    | CAPTURA LA INFORMACION REQUERIDA PARA EL CONTACTO DE ACUERDO AL EVENTO SELECCIONADO Y PRESIONA "ENVIAR"                                                                                                        |
| 4    | APARECE UNA PANTALLA DE AGRADECOMIENTO Y CONFIRMACION DE SU EVENYO Y DATOS PROPORCIONADOS                                                                                                                      |
| 5    | SE ENVIA AUTOMÁTICAMENTE (**EN ESE INSTANTE**) UN CORREO AL USUARIO TERCERO Y AL DUEÑO DE CALENDARIO CON INFORMACION DE LA REUNION                                                                             |
| 6    | SE ENVIA AUTOMÁTICAMENTE (**EL DIA DEL EVENTO A LAS 8:00 AM O UN DIA HABIL ANTES SI EL EVENTO ES ANTES DE LAS 10:00 AM** ) UN CORREO AL USUARIO TERCERO Y AL DUEÑO DE CALENDARIO CON INFORMACION DE LA REUNION |
| 7    | DESDE CADA CORREO (EL DEL DIA DE GENERACION DE EVENTO Y EL DEL DIA DEL EVENTO) DE CONFIRMACION DEL USUARIO TERCERO EXISTEN DOS BOTONES: **REAGENDAR Y CANCELAR**                                               |

---

# 5. Reglas Globales del Módulo

Estas reglas siempre aplican y no dependen del usuario.

| ID     | Regla                                                                                                                                                                                                                                         |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| RG-001 | LAS PANTALLAS Y PASOS SON SIEMPRE EN LA SECUENCIA INDICADA                                                                                                                                                                                    |
| RG-002 | EL CAMPO DE "TELEFONO" EN LA CAPTURA DE DATOS PARA EL EVENTO (PANTALLA 3) ES OPCIONAL PARA LOS TIPOS DE EVENTO: **REALIZAR LLAMADA, CITA / REUNION** Y **VIDEOCONFERENCIA** Y ES **OBLIGATORIO** PARA LOS TIPOS DE EVENTO **RECIBIR LLAMARA** |
| RG-003 | SOLO PUEDE AGREGAR A OTROS PARTICIPANTES O INVITADOS AL EVENTO (PANTALLA 3) SI EL TIPO DE EVENTO ES **VIDEOCONFERENCIA** O **CITA / REUNION**                                                                                                 |
| RG-003 | EL PRIMER CORREO DE CONFIRMACION SE GENERA AL TERMINAR EL REGISTRO Y SE ENVIA A DUEÑO DE CALENDARIO Y USUARIO TERCERO                                                                                                                         |
| RG-004 | EL SEGUNDO CORREO DE CONFIRMAACION SE ENVIA EL DIA DEL EVENTO A LAS 8:00 AM O UN DIA HABIL ANTES SI EL EVENTO ES ANTES DE LAS 10:00 AM                                                                                                        |

---

# 6. Estados del Módulo

| Estado | Descripción |
|----------|-------------|
| Inicial | |
| En captura | |
| Validado | |
| Confirmado | |
| Finalizado | |

---

# 7. Navegación

| Desde      | Hacia      | Condición                                                                                                                                                                                                                                                            |
| ---------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PANTALLA 1 | PANTALLA 2 | BOTON "INDICANOS CORREO" Y TOMA COMO DEFAULT EVENTO "CITA / REUNION"                                                                                                                                                                                                 |
| PANTALLA 2 | PANTALLA 3 | DEBE SELECCIONAR HORA DE EVENTO T USAR BOTON "INDICANOS CORREO"                                                                                                                                                                                                      |
| PANTALLA 3 | PANTALLA 4 | DEBE CAPTURAR NOMBRE Y APELLIDOS VALIDOS (*ALFABETICO Y OBLIGATORIOS*), CORREO ELECTRONICO (*ESTRUCTURA VALIDA Y OBLIGATORIO*) Y TELEFONO (*NUMERICO Y OBLIGATORIO SI EL EVENTO ES "REALIZAR LLAMADA" O "RECIBIR LLAMADA", SI NO ES OPCIONAL*) Y USAR BOTON "ENVIAR" |




---

# 8. Dependencias

Servicios, módulos o componentes requeridos para el funcionamiento.

| Dependencia | Tipo                                               | Obligatoria |
| ----------- | -------------------------------------------------- | ----------- |
| DIRECTA     | API / Servicio / Base de Datos / Módulo            | Sí / No     |
| DIRECTA     | CALENDARIO-ADMON                                   | SI          |
| DIRECTA     | CALENDARIO-DUEÑO                                   | SI          |
| DIRECTA     | DB (TABLAS PAIS Y ESTADO / REGION)                 | SI          |
| DIRECTA     | DB (TABLAS SERVICIO CALENDARIO)                    | SI          |
| INDIRECTA   | MODULO AUTENTICACION (PARA ADMINISTRADOR Y DUEÑOS) | SI          |

---

# 9. Restricciones Funcionales

Condiciones que nunca deben violarse.

| ID | Restricción |
|----|-------------|
| RF-001 | |
| RF-002 | |
| RF-003 | |

---

# 10. Historias de Usuario Relacionadas

Historias de usuario que implementan funcionalidades dentro de este módulo.

| ID     | Historia                                | Estado |
| ------ | --------------------------------------- | ------ |
| HU-001 | [[HISTORIAS DE USUARIO 3RO CALENDARIO V1.1]] |        |
| HU-002 |                                         |        |
| HU-003 |                                         |        |

---

# 11. Criterios Generales de Aceptación

Condiciones que deben cumplirse para considerar que el módulo está correctamente implementado.

- [ ] El flujo operativo se ejecuta conforme a esta especificación.
- [ ] Se cumplen todas las reglas globales.
- [ ] Se respetan las restricciones funcionales.
- [ ] La navegación corresponde al flujo definido.
- [ ] Todas las historias de usuario relacionadas han sido implementadas.
- [ ] El módulo puede integrarse con las dependencias definidas.

---

# 12. Control de Cambios

| Versión | Fecha | Autor | Descripción del cambio |
|----------|--------|--------|------------------------|
| 1.0 | | | Documento inicial |