---
epic: USUARIO 3RO CALENDARIO
status: Backlog
priority: Media
created: 2026-07-22
---

# 📋 Historia de Usuario: USUARIO 3RO CALENDARIO

### 👤 Definición de la Historia
- **Como** USUARIO 3RO DE CALENDARIO
- **Quiero** QUE EL USUARIO 3RO AGENDE EVENTOS, REAGENDE O CANCELE, CON UN DUEÑO DE CALENDARIO
- **Para** COORDINAR EVENTOS ENTRE DUEÑO DE CALENDARIO  USUAIO 3RO

---

### 📑 Criterios de Aceptación (Formato Gherkin)

#### Escenario 1: AGENDAR EVENTO
- **Dado** QUE EL USUARIO 3RO TIENE ACCESO AL CALENDARIO
- **Cuando** AGENDA UN EVENTO SIGUIENDO EL FLUJO
- **Entonces** SE REGISTRA EL EVENTO Y SE ENVIAN CORREOS DE CONFIRMACION AL 3RO Y AL DUEÑO DE CALENDARIO Y DE REORDACION ANTES DEL EVENTO A LOS MISMOS ACTORES.

#### Escenario 2: [Nombre del escenario alternativo, ej. Flujo de excepción]
- **Dado** QUE EXISTE UN EVENTO AGENDADO Y SE TIENE UN CORREO COMO  USUARIO 3RO
- **Cuando** DENTRO DEL CORREO SE SELECCIONAN LOS BOTONES DE REAGENDAR O DE CANCELAR
- **Entonces** SE ACCEDE A LAS PAGINAS PARA REAGENDAR O CONFIRMAR CANCELACION, SEGUN EL CASO

---

### 🛠️ Notas de Desarrollo / Datos Técnicos
- **Impacto técnico:** [BBDD, API externa, Frontend, Backend]
- **Estimación:** [Story Points / Horas]
- **Dependencias:** [Ninguna / US-XX]

---

### 🖥️ Fila para la Tabla General (Markdown)
---

# Backlog de Historias de Usuario

| Épica                           | Título de la Historia                                               | Descripción / Historia de Usuario                                                                                                                                                           | Criterios de Aceptación                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| :------------------------------ | :------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Épica 1: REGISTRO DE EVENTO** | US-01: SELECCION DE EVENTO, CARGA DE ELEMENTOS Y SELECCION DE FECHA | **Como** usuario 3RO<br>**quiero** SELECCIONAR EL TIPO DE EVENTO QUE SOLICITO Y LA FECHA E INDICAR TEMA Y CARGAR ADJUNTOS PARA EL EVENTO<br>**para** ELEGIR EL HORARIO DEL DIA SELECCIONADO | **Escenario 1:** SELECCION DE EVENTO Y FECHA<br>- **Dado** que el usuario 3RO está en la página DEL CALENDARIO <br>- **Cuando** SELECCIONA TIPO DE EVENTO Y FECHAS, PUEDE CAPTURAR EL TEMA QUE QUIERE TRATAR Y ADJUNTAR 1 ELEMENTO, Y AL DAR "INDICANOS HORA"<br>- **Entonces** es redirigido A LA PAGINA DE SELECCION DE HORA SOLICITADA PARA EL EVENTO                                                                                                                                                                                                                                                                                                                                                      |
| **Épica 1: REGISTRO DE EVENTO** | US-02: SELECCIONAR HORA DEL EVENTO                                  | **Como** usuario 3RO<br>**quiero** VER HORARIO DISPONIBLE EN LA FECHA SELECCIONADA<br>**para** ELEGIR LA HORA PARA MI EVENTO EN LA FECHA SELECCIONADA                                       | **Escenario 1:** SELECCION DE HORA Y VISUALIZACION DE EVENTO<br>- **Dado** QUE PUEDO VER EL EVENTO Y SUS DETALLES Y EL DIA QUE ELEGI Y LAS HORAS DISPONIBLES EN EL CALENDARIO<br>- **Cuando** SELECCIONO UN HORARIO DISPONIBLE Y DOY EN "INDICANOS TU CORREO"<br>- **Entonces** ES REDIRIGIDO A LA PAGINA DE DATOS PARA CONTACTO                                                                                                                                                                                                                                                                                                                                                                              |
| **Épica 1: REGISTRO DE EVENTO** | US-03: CAPTURAR INFORMACION DE CONTACTO                             | **Como** usuario 3RO<br>**quiero** CAPTURAR LA INFORMACION PARA SER CONTACTADO PARA CONFIRMACION Y RECORDACION DEL EVENTO AGENDADO<br>**para** INDICAR MIS DATOS DE CONTACTO                | **Escenario 1:** CAPTURA DE DATOS  DE CONTACTO PARA EL EVENTO<br>- **Dado** QUE PUEDO CAPTURAR LOS DATOS DE CONTACTO PARA EL EVENTO, SI EL TIPO DE EVENTO ES **VIDEOCONFERENCIA** O **CITA / REUNION**, Y SI EL DUEÑO DEL CALENDARIO  SELECCIONO EL CUADRO "PERMITIR QUE UN SOLICITANTE AÑADA OTROS INVITADOS AL EVENTO", PERMITE CAPTURAR MAS INVITADOS Y<br>- **Cuando** CAPTURO LOS DATOS Y DOY EN  "ENVIAR"<br>- **Entonces**  EL EVENTO ES AGENDADO, EL CORREO DE CONFIRMACION ES ENVIADO AL DUEÑO DEL CALENDARIO Y AL USUARIO 3RO, Y ES REDIRIGIDO A LA PAGINA DE CONFIRMACION                                                                                                                          |
| **Épica 1: REGISTRO DE EVENTO** | US-03: CONFIRMACION DE EVENTO                                       | **Como** usuario 3RO<br>**quiero** CONFIRMACION DEL EVENTO AGENDADO<br>**para** GARANTIZAR MI CITA                                                                                          | **Escenario 1:** CONFIRMACION DEL EVENTO<br>- **Dado** QUE ACABO DE TERMINAR EL REGISTRO DEL EVENTO SOLICITADO<br>- **Cuando** ABRE PAGINA DE CONFIRMACION DE EVENTO<br>- **Entonces**  VEO LA INFORMACION DEL EVENTO Y ESTA ME LLEGARA POR CORREO TAMBIEN                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| **Épica 2: REAGENDAR EVENTO**   | US-03: REAGENDAR EVENTO                                             | **Como** usuario 3RO<br>**quiero** CREAGENDAR  EVENTO AGENDADO<br>**para** CAMBIAR FECHA Y HORA                                                                                             | **Escenario 1:** REAGENDAR EVENTO<br>- **Dado** QUE NECESITO CAMBIAR FECHA Y HORA DE UN EVENTO AGENDADO<br>- **Cuando** ABRO CORREO DE CONFIRMACION O RECORDACION Y DOY EN BOTON "REAGENDAR"<br>- **Entonces**  ENTRO EN LA PAGINA DE REAGENDAR Y **ES: DUEÑO DE CALENDARIO O USUARIO 3RO QUE AGENDO EL EVENTO** PERMITE SEGUIR EL FLUJO DE LAS PAGINAS HASTA CONFIRMAR EL NUEVO EVENTO;  SI QUIEN DA EN BOTON "REAGENDAR" **NO ES DUEÑO DE CALENDARIO O USUARIO 3RO QUE AGENDO EL EVENTO** ENTONCES INDICA EN PAMTALLA QUE **"NO TIENE AUTORIDAD PARA REAGENDAR ESTE EVENTO"**                                                                                                                               |
| **Épica 1: CANCELAR EVENTO**    | US-03: CANCELACION DE EVENTO                                        | **Como** usuario 3RO<br>**quiero** CANCELACION DEL EVENTO AGENDADO<br>**para** LIBERAR ESPACIO DE AGENDA DEL DUEÑO DE CALENDARIO                                                            | **Escenario 1:** CANCELACION DEL EVENTO<br>- **Dado**QUE NECESITO CANCELAR UN EVENTO SOLICITADO<br>- **Cuando** ABRO EL CORREO DE CONFIRMACION O RECORDACION  DEL EVENTO Y DOY EN BOTON "CANCELAR". <br>- **Entonces**  ENTRO EN LA PAGINA DE CONFIRMACION DE CANCELACION Y  SI EL USUARIO QUE CANCELA **ES: DUEÑO DE CALENDARIO O USUARIO 3RO QUE AGENDO EL EVENTO** PERMITE QUE AL DAR "CONFIRMAR" EL EVENTO ES CANCELARO Y GENERA CORREOS DE AVISO DE CANCELACION AL USUARIO 3RO Y AL DUEÑO DE CALENDARIO. SI QUIEN CONFIRMA **NO ES DUEÑO DE CALENDARIO O USUARIO 3RO QUE AGENDO EL EVENTO** ENTONCES INDICA EN PAMTALLA QUE **"NO TIENE AUTORIDAD PARA CANCELAR ESTE EVENTO PORQUE USTED NO LO AGENDO"** |




### 📘 Instructivo de Uso Rápido (4 Pasos)

* **Paso 1 (Configuración):** Ve a los Ajustes de Obsidian > *Core Plugins* y activa **Templates** (Plantillas). En sus ajustes, selecciona la carpeta donde guardas tus plantillas (ej: `00_Templates`).
* **Paso 2 (Guardar Plantilla):** Crea la nota `Plantilla Historia Usuario.md` en esa carpeta y pega el código anterior.
* **Paso 3 (Uso Diario):** Cuando vayas a documentar una nueva historia, crea una nota en blanco con el nombre de la épica o la historia (ej: `Login de Usuarios`), presiona `Alt + T` (o abre la paleta de comandos `Ctrl + P` y escribe *Insert Template*) y selecciona esta plantilla. Verás cómo automáticamente se completan el título y la fecha actual en los metadatos.
* **Paso 4 (Consolidación de Datos):** Al final de la nota, la sección **"Fila para la Tabla General"** está configurada para que copies y pegues directamente esa línea de código Markdown en tu tabla macro del proyecto. Así mantienes un backlog global unificado al mismo tiempo que tienes notas detalladas por cada requerimiento.