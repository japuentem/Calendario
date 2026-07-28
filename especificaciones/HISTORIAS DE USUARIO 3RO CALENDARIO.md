# HISTORIAS DE USUARIO 3RO CALENDARIO 

# Historia de Usuario: USUARIO 3RO CALENDARIO 📋 

## Definición de la Historia 👤 

- Como USUARIO 3RO DE CALENDARIO 

- Quiero QUE EL USUARIO 3RO AGENDE EVENTOS, REAGENDE O CANCELE, CON UN DUEÑO DE CALENDARIO 

- Para COORDINAR EVENTOS ENTRE DUEÑO DE CALENDARIO USUAIO 3RO 

## 📑 Criterios de Aceptación (Formato Gherkin) 

Escenario 1: AGENDAR EVENTO 

   - Dado QUE EL USUARIO 3RO TIENE ACCESO AL CALENDARIO 

   - Cuando AGENDA UN EVENTO SIGUIENDO EL FLUJO 

   - Entonces SE REGISTRA EL EVENTO Y SE ENVIAN CORREOS DE CONFIRMACION AL 

   - 3RO Y AL DUEÑO DE CALENDARIO Y DE REORDACION ANTES DEL EVENTO A LOS MISMOS ACTORES. 

- Escenario 2: [Nombre del escenario alternativo, ej. Flujo de excepción] 

   - Dado QUE EXISTE UN EVENTO AGENDADO Y SE TIENE UN CORREO COMO USUARIO 3RO 

   - Cuando DENTRO DEL CORREO SE SELECCIONAN LOS BOTONES DE REAGENDAR O DE CANCELAR 

   - Entonces SE ACCEDE A LAS PAGINAS PARA REAGENDAR O CONFIRMAR 

   - CANCELACION, SEGUN EL CASO 

## 🛠 Notas de Desarrollo / Datos Técnicos 

- Impacto técnico: BBDD, API externa, Frontend, Backend] 

- Estimación: Story Points / Horas] 

- 

- Dependencias: Ninguna / US XX 

🖥 Fila para la Tabla General (Markdown) 

# Backlog de Historias de Usuario 

|Épica|Título de la<br>Historia|Descripción /<br>Historia de Usuario|Criterios de Aceptación|
|---|---|---|---|
|Épica 1<br>REGISTRO DE<br>EVENTO|US01 SELECCION<br>DE EVENTO,<br>CARGA DE<br>ELEMENTOS Y<br>SELECCION DE<br>FECHA|Como usuario 3RO<br>quiero SELECCIONAR<br>EL TIPO DE EVENTO<br>QUE SOLICITO Y LA<br>FECHA E INDICAR<br>TEMA Y CARGAR<br>ADJUNTOS PARA EL<br>EVENTO<br>para ELEGIR EL<br>HORARIO DEL DIA<br>SELECCIONADO|Escenario 1 SELECCION<br>DE EVENTO Y FECHA<br>- Dado que el usuario 3RO<br>está en la página DEL<br>CALENDARIO<br>- Cuando SELECCIONA<br>TIPO DE EVENTO Y<br>FECHAS, PUEDE<br>CAPTURAR EL TEMA QUE<br>QUIERE TRATAR Y<br>ADJUNTAR 1 ELEMENTO, Y<br>AL DAR "INDICANOS<br>HORA"<br>- Entonces es redirigido A<br>LA PAGINA DE SELECCION<br>DE HORA SOLICITADA<br>PARA EL EVENTO|
|Épica 1<br>REGISTRO DE<br>EVENTO|US02<br>SELECCIONAR<br>HORA DEL EVENTO|Como usuario 3RO<br>quiero VER HORARIO<br>DISPONIBLE EN LA<br>FECHA<br>SELECCIONADA<br>para ELEGIR LA HORA<br>PARA MI EVENTO EN<br>LA FECHA<br>SELECCIONADA|Escenario 1 SELECCION<br>DE HORA Y<br>VISUALIZACION DE<br>EVENTO<br>- Dado QUE PUEDO VER EL<br>EVENTO Y SUS DETALLES<br>Y EL DIA QUE ELEGI Y LAS<br>HORAS DISPONIBLES EN<br>EL CALENDARIO<br>- Cuando SELECCIONO UN<br>HORARIO DISPONIBLE Y<br>DOY EN "INDICANOS TU<br>CORREO"<br>- Entonces ES REDIRIGIDO<br>A LA PAGINA DE DATOS<br>PARA CONTACTO|
|Épica 1<br>REGISTRO DE<br>EVENTO|US03 CAPTURAR<br>INFORMACION DE<br>CONTACTO|Como usuario 3RO<br>quiero CAPTURAR LA<br>INFORMACION PARA<br>SER CONTACTADO<br>PARA|Escenario 1 CAPTURA DE<br>DATOS DE CONTACTO<br>PARA EL EVENTO<br>- Dado QUE PUEDO<br>CAPTURAR LOS DATOS DE|



|Épica|Título de la<br>Historia|Descripción /<br>Historia de Usuario|Criterios de Aceptación|
|---|---|---|---|
|||CONFIRMACION Y<br>RECORDACION DEL<br>EVENTO AGENDADO<br>para INDICAR MIS<br>DATOS DE<br>CONTACTO|CONTACTO PARA EL<br>EVENTO<br>- Cuando CAPTURO LOS<br>DATOS Y DOY EN<br>"ENVIAR"<br>- Entonces EL EVENTO ES<br>AGENDADO, EL CORREO<br>DE CONFIRMACION ES<br>ENVIADO AL DUEÑO DEL<br>CALENDARIO Y AL<br>USUARIO 3RO, Y ES<br>REDIRIGIDO A LA PAGINA<br>DE CONFIRMACION|
|Épica 1<br>REGISTRO DE<br>EVENTO|US03<br>CONFIRMACION DE<br>EVENTO|Como usuario 3RO<br>quiero<br>CONFIRMACION DEL<br>EVENTO AGENDADO<br>para GARANTIZAR MI<br>CITA|Escenario 1<br>CONFIRMACION DEL<br>EVENTO<br>- Dado QUE ACABO DE<br>TERMINAR EL REGISTRO<br>DEL EVENTO SOLICITADO<br>- Cuando ABRE PAGINA DE<br>CONFIRMACION DE<br>EVENTO<br>- Entonces VEO LA<br>INFORMACION DEL<br>EVENTO Y ESTA ME<br>LLEGARA POR CORREO<br>TAMBIEN|
|Épica 2<br>REAGENDAR<br>EVENTO|US03<br>REAGENDAR<br>EVENTO|Como usuario 3RO<br>quiero CREAGENDAR<br>EVENTO AGENDADO<br>para CAMBIAR FECHA<br>Y HORA|Escenario 1 REAGENDAR<br>EVENTO<br>- Dado QUE NECESITO<br>CAMBIAR FECHA Y HORA<br>DE UN EVENTO<br>AGENDADO<br>- Cuando ABRO CORREO<br>DE CONFIRMACION O<br>RECORDACION Y DOY EN<br>BOTON "REAGENDAR"<br>- Entonces ENTRO EN LA<br>PAGINA DE REAGENDAR Y<br>SIGO EL FLUJO DE LAS<br>PAGINAS HASTA<br>CONFIRMAR EL NUEVO<br>EVENTO|
|Épica 1<br>CANCELAR<br>EVENTO|US03<br>CANCELACION DE<br>EVENTO|Como usuario 3RO<br>quiero CANCELACION<br>DEL EVENTO|Escenario 1<br>CANCELACION DEL<br>EVENTO|



|Épica|Título de la<br>Historia|Descripción /<br>Historia de Usuario|Criterios de Aceptación|
|---|---|---|---|
|||AGENDADO<br>para LIBERAR<br>ESPACIO DE AGENDA<br>DEL DUEÑO DE<br>CALENDARIO|- DadoQUE NECESITO<br>CANCELAR UN EVENTO<br>SOLICITADO<br>- Cuando ABRO EL<br>CORREO DE<br>CONFIRMACION O|
||||RECORDACION DEL<br>EVENTO Y DOY EN BOTON<br>"CANCELAR"<br>- Entonces ENTRO EN LA<br>PAGINA DE<br>CONFIRMACION DE<br>CANCELACION Y AL DAR<br>"CONFIRMAR" EL EVENTO<br>ES CANCELARO Y GENERA<br>CORREOS DE AVISO DE<br>CANCELACION AL<br>USUARIO 3RO Y AL DUEÑO<br>DE CALENDARIO|



## 📘 Instructivo de Uso Rápido (4 Pasos) 

- Paso 1 Configuración): Ve a los Ajustes de Obsidian > Core Plugins y activa 

- Templates Plantillas). En sus ajustes, selecciona la carpeta donde guardas tus 

- plantillas (ej: **`00_Templates`** ). 

- Paso 2 Guardar Plantilla): Crea la nota **`Plantilla Historia Usuario.md`** en esa carpeta y pega el código anterior. 

- Paso 3 Uso Diario): Cuando vayas a documentar una nueva historia, crea una nota en blanco con el nombre de la épica o la historia (ej: **`Login de Usuarios`** ), presiona **`Alt + T`** (o abre la paleta de comandos **`Ctrl + P`** y escribe Insert Template) y selecciona esta plantilla. Verás cómo automáticamente se completan el título y la fecha actual en los metadatos. 

- Paso 4 Consolidación de Datos): Al final de la nota, la sección "Fila para la Tabla General" está configurada para que copies y pegues directamente esa línea de código Markdown en tu tabla macro del proyecto. Así mantienes un backlog global unificado al mismo tiempo que tienes notas detalladas por cada requerimiento. 

