---
tipo: Especificación Funcional
codigo:
modulo:
version_funcional: 1
estado: Borrador
autor:
fecha_creacion: 2026-07-23T08:30:00
ultima_actualizacion:
---

# Especificación Funcional del Módulo

> Documento que describe el comportamiento funcional estándar del módulo de DUEÑO DE CALENDARIO. Sirve como referencia para analistas, diseñadores, desarrolladores y personal de pruebas. Las historias de usuario deberán alinearse con esta especificación.

---

# 1. Identificación del Módulo

| Campo             | Valor                     |
| ----------------- | ------------------------- |
| Código            | CAL-DUEÑO                 |
| Nombre            | DUEÑO DE CALENDARIO       |
| Tipo              | Reutilizable / Específico |
| Dominio           |                           |
| Versión Funcional |                           |
| Responsable       |                           |

### Sistemas donde puede utilizarse

- - CUALQUIERA DONDE UN RESPONSABLE DE DAR SERVICIO REQUIERA INTERACIONES PROGRAMADAS CON TERCEROS
- CUALQUIERA DONDE EXISTAN PROCESOS DEFINIDOS DONDE SE REQUIERAN INTERACCIONES EN ALGUNO DE LOS PASOS
- 

### Roles involucrados

- DUEÑO DE CALENDARIO
- 
- 

---

# 2. Objetivo

FUNCIONALIDAD REQUERIDA POR UN DUEÑO DE CALENDARIO QUE QUIERE CONFIGURAR SU PRESENTACION EN EL CALENDAARIO VISIBLE PARA USUARIOS  3ROS Y QUE EL MISMO USARA PARA LOS EVENTOS QUE QUIERA PODER ATENDER, EN LOS TIEMPOS QUE EL ASIGNE PARA LOS MISMOS Y EN LOS HORARIOS Y DIAS QUE EL DISPONGA PARA ELLO.

---

# 3. Alcance

## Incluye

- FUNCIONALIDAD PARA CONFIGURAR PRESENTACION DE EL MISMO EN EL CALENDARIO 3ROS, ASI COMO EL CIERRE DE EVENTO AGENDADO
- FUNCIONALIDAD DE GESTION DE DISPONIBILIDAD DE FEHAS, HORARIOS Y TIPOS DE EVENTOS
- FUNCIONALIDAD ESPECIFICA DENTRO DE LA GESTION DE FECHAS Y HORARIOS
- FUNCIONALIDAD DE GESTION DE EVENTOS
- FUNCIONALIDAD ESPECIFICA DENTRO DE LA GESTION DE UN EVENTO EN PARTICULAR

## No incluye

- 
- MODULO DE AUTENTICACION 
- 

---

# 4. Flujo Operativo Estándar
Describa el comportamiento normal del módulo independientemente del rol del usuario.

```text
Inicio (FLUJO PRESENTACION - AJUSTE CALENDARIO 3ROS)
   │
   ▼
Pantalla 1 / Paso AJUSTE DE PRESENTACION EN CALENDARIO Y MENSAJE DE CIERRE
   │
   ▼
Fin


Inicio (FLUJO DISPONIBILIDAD - GESTION DE DISPONIBILIDAD Y TIEMPOS POR TIPO DE EVENTO)
   │
   ▼
Pantalla 2 / Paso SELECCION DE DIAS, RENGOS DE HORARIOS TIEPOS DE EVENTOS Y FECHAS ESPECIALES
   │
   ▼
Fin


Inicio (FLUJO GESTION - GESTIONA ENEVNTOS DEL CALENDARIO)
   │
   ▼
Pantalla 3 / Paso ACCIONES DE GESTION DE EVENTOS
   │
   ▼
Fin

```


### PANTALLA 0 (ESTRUCTURA Y MAIN)
![[Diapositiva2 1.jpg]]
![[Diapositiva4 1.jpg]]

### PANTALLA 1 (PROPUESTA)

![[PANTALLAS CALENDARIO DUEÑO AJ P1.jpg]]


### PANTALLA 2 (PROPUESTA, USAR SCROL PARA IR BAJANDO)

![[Diapositiva6 1.jpg]]

![[Diapositiva7 1.jpg]]

![[Diapositiva8 1.jpg]]

### PANTALLA 2 (DETALLE FUNCIONALIDAD DISPONIBILIDAD SEMANAL)

![[Diapositiva9 1.jpg]]

### PANTALLA 3 (PROPUESTA)

![[Diapositiva10 1.jpg]]

### PANTALLA 3 (DETALLE  FUNCIONLIDAD TRES PUNTOS)

![[PANTALLAS CALENDARIO DUEÑO AJ P3.jpg]]

### PANTALLA EMERGENTE (DETALLE CONTENIDO)

![[PANTALLAS CALENDARIO DUEÑO AJ P3a.jpg]]

### Descripción del flujo

| Paso | Descripción                                                                                            |
| ---- | ------------------------------------------------------------------------------------------------------ |
| 1    | SE AJUSTA IMAGEN A PRESENTAR EN CALENDARIO DE USUARIO 3RO (PANTALLA 1)                                 |
| 2    | SE AJUSTA DISPONIBILIDAD Y TIPOS DE EVENTOS Y TIEMPOS, ASI COMO DIAS CON HORARIO ESPECIAL (PANTALLA 2) |
| 3    | SE GESTIONAN LOS EVENTOS DEL CALENDARIO (PANTALLA 3)                                                   |
| 4    |                                                                                                        |

---

# 5. Reglas Globales del Módulo

Estas reglas siempre aplican y no dependen del usuario.

| ID     | Regla                                                                                                                                                                                                                                             |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| RG-001 | EN PRESENTACION Y CIERRE MUESTRA COMO ACTUAL LO QUE SE ENCUENTRE EN BASE DE DAT                                                                                                                                                                   |
| RG-002 | EN GESTION DE DISPONIBILIDAD, CUANDO SE SELECCIONA UN DIA, ESTE SE ACTIVA Y ABRE UN PRIMER RANGO DE HORAS DE ATENC                                                                                                                                |
| RG-003 | EN GESTION DE DISPONIBILIDAD, CUANDO YA EXISTE UN PRIMER RANGO DE ATENCION SE PUEDEN AGREGAR LOS QUE SE REQUIERAN PARA ESE DIA DE LA SEMANA (INDICAR EN AGREGAR UN HORA                                                                           |
| RG-004 | EN GESTION DE DISPONIBILIDAD, CADA RANGO ABIERTO EN UN DIA SE PUEDE ELIMINAR DE FORMA INDIVIDUAL Y SI SE QUITA EL DIA COMO SELECCIONADO SE ELIMINAN TODOS LOS RANGOS DE ES                                                                        |
| RG-005 | EN GESTION DE DISPONIBILIDAD, SE PUEDE ELEGIR UNA FECHA ESPECIAL, Y EN ESA FECHA SE PUEDE ESTABLECER UNO O VARIOS RANGOS DE HORARIO SIGUIENDO LAS REGLAS DE RG-003 Y                                                                              |
| RG-006 | EN GESTION DE EVETOS LOS TIPOS DE EVENTOS POSIBLES SON LOS QUE EL DUEÑO HAYA ESTABLECIDO EN LA DISPONIBILIDAD (HISTORIA DE USUARIO DC-02, PAN                                                                                                     |
| RG-07  | SOLO HAY DOS ESTADOS DE UN EVENTO: PENDIENTE O EJECUTADO                                                                                                                                                                                          |
| RG-08  | SI EL TIPO DE EVENTO ES "**HACER LLAMADA"** O "**RECIBIR LLAMADA"** SOLO ACEPTA UN PARTICIPANTE QUE ES QUIEN SOLICITA                                                                                                                             |
| RG-09  | SI EL TIPO DE EVENTO ES **"VIDEOCONFERENCIA** O **"CITA / REUNION"** PERMITE MAS DE UN PARTICIPANTE, QUE PUEDE SER SOLICITADO POR EL USUARIO 3RO" EN LA HISTORIA DE USUARIO **US-03** Y PANTALLA 3  DE ESPECIFICACIONES DE USUARIO DE USUARIO 3RO |
| RG-10  | PUEDE AGREGAR PARTICIPANTES POR PARTE DE LA ORGANIZACION CON "NUEVO PARTICIPANTE" EN MENU DE TRES PUNTOS (**...**), QUE LO ENVIA A PANTALLA 3 DE ESPECIFICACIONES DE CALENDARIO 3ROS E HISTORIAS DE USUARIO US-03                                 |
| RG-11  | SI EL EVENTO SOLO TIENE UN PARTICIPNTE (UAUSRIO 3RO QUE SOLICITA EVENTO), SU NOMBRE APARECE EN LA COLUMNA INVITADO, PANTALLA 3 HITORIA DE USUARIO DC-02, PERO SI HAY MAS DE UN INVITADO APARECE **"MULTIPLE"** EN ESTA COLUMNA                    |
 

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

Describe las transiciones permitidas entre pantallas o vistas.

| Desde                                                    | Hacia                                                                                                                                                     | Condición                                   |
| -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| MAIN (PANTALLA 0)                                        | PANTALLA 1, 2, 3                                                                                                                                          | SELECCION EN MENU                           |
| PANTALLA 3 (TRES PUTOS -> OPCION REPROGRAMAR RESERVA)    | ESPECIFICACIONES CALENDARIO 3ROS - PANTALLA 5 (ISTORIA DE USUARIO US-003)                                                                                 |                                             |
| PANTALLA 3 (TRES PUTOS -> OPCION DETALLES DE LA RESERVA) | VENTANA EMERGENTE QUE CONTIENE:  **TIPO DE EVENTO, FECHA, HORA DE INICIO, DURACION, TEMA, CORREO, TELEFONO, NOMBRE DE USUARIO 3RO Y ADJUNTO (DESCARGAR)** |                                             |
| PANTALLA 3 (TRES PUTOS -> OPCION ELIMINAR)               | VENTANA EMERGENTE DE CONFIRMACION DE ELIMINACION SI LA FECHA DE INICIO ES MENOR AL DIA (HOY)                                                              | SI LA FECHA DE INICIO ES MENOR AL DIA (HOY) |

---

# 8. Dependencias

Servicios, módulos o componentes requeridos para el funcionamiento.

| Dependencia | Tipo                                               | Obligatoria |
| ----------- | -------------------------------------------------- | ----------- |
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

| ID | Historia | Estado |
|----|----------|--------|
| HU-001 | | |
| HU-002 | | |
| HU-003 | | |

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
| ------- | ----- | ----- | ---------------------- |
| 1.0     |       |       | Documento inicial      |