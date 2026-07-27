## ESPECIFICACIONES CALENDARIO 3ROS 

## Especificación Funcional del Módulo 

Documento que describe el comportamiento funcional estándar del módulo 

CALENDARIO. Sirve como referencia para analistas, diseñadores, desarrolladores y personal de pruebas. Las historias de usuario deberán alinearse con esta especificación. 

ES EL CALENDARIO VISIBLE EN PAGINAS WEB PARA QUE USUARIOS TERCEROS AGENDEN EVENTOS CON UN DUEÑO DE CALENDARIO 

## 1. Identificación del Módulo 

Campo Valor Código CAL3ROS  Nombre CALENDARIO TERCEROS Tipo Reutilizable Dominio Versión Funcional Responsable 

#### Sistemas donde puede utilizarse 

- CUALQUIERA DONDE UN RESPONSABLE DE DAR SERVICIO REQUIERA 

- INTERACIONES PROGRAMADAS CON TERCEROS 

- CUALQUIERA DONDE EXISTAN PROCESOS DEFINIDOS DONDE SE REQUIERAN 

- INTERACCIONES EN ALGUNO DE LOS PASOS 

#### Roles involucrados 

USUARIO TERCERO 

## 2. O tivo bje 

ES UN COMPONENTE QUE PUEDE INTEGRARSE EN FLUJOS DE TRABAJO Y EN APLICACIONES QUE REQUIERAN COORDINACION DE UN RESPONSABLE DE DAR ASISTENCIA O SERVICIOS A TERCEROS USUARIOS TERCEROS 

## 3. Alcance 

### Incluye 

- COMPONENTE PARA USUARIO TERCERO 

CANCELACION O REAGENDAR EVENTO POR PARTE DEL USUARIO TERCERO 

### No incluye 

- COMPONENTES DE AUTENTICACION PARA USUARIOS TERCEROS, YA QUE EL 

COMPONENTE CALENDARIO PUEDE ESTAR ABIERTO EN SU USO AL PUBLICO O RECIBIR E UN USUARIO TERCERO QUE YA HAYA SIDO AUTENTICADO Y LLEGUE AL COMPONENTE POR TRANSFERENCIA DE CONTROL 

## 4. Flujo Operativo Estándar 

Describa el comportamiento normal del módulo independientemente del rol del usuario. 

```
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
```

```
Inicio (FLUJO CANCELACION - DESDE BOTON DE CORREO -> PAGINA WEB)
   │
   ▼
Pantalla 6 / Paso CONFIRMACION DE CANCELACION
   │
   ▼
Fin
```



<!-- Start of picture text -->
SELECCIONA EL DIA DE TU SESION CORREO<br>PARA RECIBIR LIGA DE ZOOM<br>@ ALEJANDRO MARTINEZ Seleccionar fecha<br>PUESTO: ASESOR ESPECIALIZADO<br>Julio 2026 < ><br>EVENTO SOLICITADO<br>Dom Lun Mar Mier Jue Vie Sab<br>TEMAA TRATAR<br>| 5 6 7 §| 9| 10| 11|<br>ELEMENTOS A CONSIDERAR<br>12 13 14 15 16 17 18<br>19 20 21 22 23 24 25<br>26 27 28 29 30 31<br>@ = America’Mexico_City (2...<br><!-- End of picture text -->



<!-- Start of picture text -->
SELECCIONA EL DIA DE TU SESION<br>VIDEOCONFERENCIA<br><!-- End of picture text -->

CORREO PARA RECIBIR LIGA DE ZOOM 



<!-- Start of picture text -->
@p ALEJANDRO MARTINEZ _ Seleccionar fecha Mar, Julio 21<br>REUNION INFORMATIVAIA - 8 : a<br>Reunion informativa de 15 minutos wane 2028 < > a<br>para entregar informacion util al<br>Cabildo Dom Lun Mar Mier Jue Vie Sab batand<br>4 15 Min 1 -. ?. ~. 09:30<br>09:45<br>9) VIDEOCONFERENCIA 5 6 7 8 9 10 11<br>10:00<br>10:30<br>19 20 21 22 23 24 25<br>10:45<br>26 27 28 29 30 31 11:00<br>11:15<br>@ = America/Mexico_City (... 11:30 .<br><!-- End of picture text -->

SELECCIONA EL DIA DE TU SESION CORREO SOLO SON 15 MINUTOS PARA RECIBIR LIGA DE ZOOM 

Indicanos quien solicita y a donde enviar por favor 

JACINTO 

PEREZ 

. ~. @GMAIL.COM 



<!-- Start of picture text -->
TELEFONO<br><!-- End of picture text -->



<!-- Start of picture text -->
|<br><!-- End of picture text -->



<!-- Start of picture text -->
jReserva confirmada!<br><!-- End of picture text -->

##### REUNION INFORMATIVA IA 

S& ALEJANDRO MARTINEZ 10:15, Mar, Julio21, 2026 $4 Duracion de 15 minutos @ America/Mexico_City 9 VIDEOCONFERENCIA 

|a ALEJANDROMARTINEZ|Seleccionar|fecha||||||
|---|---|---|---|---|---|---|---|
|REUNION INFORMATIVA IA<br>Reunién informativade 15 minutos<br>paraentregarinformaciénutilal|.<br>Julio2026||||||<<br>>|
|<br>Cabildo|Dom|Lun|Mar|Mier|Jue|Vie|Sab|
|Hora previa||||1|2|3|4|
|10:00 - 10:15||||||||
|Mier, Julio 22|)|6|7|8|9|10|11|
||12|13|14|15|16|17|18|
|& 15 Min||||||||
||19|20|21|22|23|24|25|
|7Prosenciet|26|27|28|29|30|31||



@ America/Mexico_City (18:56) 

# Cancelar reserva 



<!-- Start of picture text -->
?<br><!-- End of picture text -->

~Deseas cancelar la reserva? 



|Paso|Descripción|
|---|---|
|5|SE ENVIA AUTOMÁTICAMENTE (EN ESE INSTANTE) UN CORREO AL USUARIO<br>TERCERO Y AL DUEÑO DE CALENDARIO CON INFORMACION DE LA REUNION|
|6|SE ENVIA AUTOMÁTICAMENTE (EL DIA DEL EVENTO A LAS 800 AM O UN DIA<br>HABIL ANTES SI EL EVENTO ES ANTES DE LAS 1000 AM ) UN CORREO AL<br>USUARIO TERCERO Y AL DUEÑO DE CALENDARIO CON INFORMACION DE LA<br>REUNION|
|7|DESDE CADA CORREO EL DEL DIA DE GENERACION DE EVENTO Y EL DEL DIA DEL<br>EVENTO DE CONFIRMACION DEL USUARIO TERCERO EXISTEN DOS BOTONES<br>REAGENDAR Y CANCELAR|



## 5. R as Globales del Módulo egl 

Estas reglas siempre aplican y no dependen del usuario. 

|ID|Regla|
|---|---|
|RG|LAS PANTALLAS Y PASOS SON SIEMPRE EN LA SECUENCIA INDICADA|
|001||
|RG|EL CAMPO DE "TELEFONO" EN LA CAPTURA DE DATOS PARA EL EVENTO|
|002|PANTALLA 3 ES OPCIONAL PARA LOS TIPOS DE EVENTO REALIZAR LLAMADA,<br>CITA / REUNION Y VIDEOCONFERENCIA Y ES OBLIGATORIO PARA LOS TIPOS DE<br>EVENTO RECIBIR LLAMARA|
|RG<br>003|EL PRIMER CORREO DE CONFIRMACION SE GENERA AL TERMINAR EL REGISTRO<br>Y SE ENVIA A DUEÑO DE CALENDARIO Y USUARIO TERCERO|
|RG|EL SEGUNDO CORREO DE CONFIRMAACION SE ENVIA EL DIA DEL EVENTO A LAS|
|004|800 AM O UN DIA HABIL ANTES SI EL EVENTO ES ANTES DE LAS 1000 AM|



## 6. Estados del Módulo 

|Estado|Descripción|
|---|---|
|Inicial||
|En captura||
|Validado||
|Confirmado||



Descripción 

Estado 

Finalizado 

## 7. Nav ación eg 

|Desde|Hacia|Condición|
|---|---|---|
|PANTALLA|PANTALLA|BOTON "INDICANOS CORREO" Y TOMA COMO DEFAULT|
|1|2|EVENTO "CITA / REUNION"|
|PANTALLA|PANTALLA|DEBE SELECCIONAR HORA DE EVENTO T USAR BOTON|
|2|3|"INDICANOS CORREO"|
|PANTALLA|PANTALLA|DEBE CAPTURAR NOMBRE Y APELLIDOS VALIDOS|
|3|4|(ALFABETICO Y OBLIGATORIOS), CORREO ELECTRONICO<br>(ESTRUCTURA VALIDA Y OBLIGATORIO) Y TELEFONO<br>(NUMERICO Y OBLIGATORIO SI EL EVENTO ES "REALIZAR<br>LLAMADA" O "RECIBIR LLAMADA", SI NO ES OPCIONAL) Y USAR<br>BOTON "ENVIAR"|



## 8. Dependencias 

Servicios, módulos o componentes requeridos para el funcionamiento. 

|Dependencia|Tipo|Obligatoria|
|---|---|---|
|DIRECTA|API / Servicio / Base de Datos / Módulo|Sí / No|
|DIRECTA|CALENDARIOADMON|SI|
|DIRECTA|CALENDARIODUEÑO|SI|
|DIRECTA|DB TABLAS PAIS Y ESTADO / REGION|SI|
|DIRECTA|DB TABLAS SERVICIO CALENDARIO|SI|
|INDIRECTA|MODULO AUTENTICACION PARA ADMINISTRADOR Y<br>DUEÑOS|SI|



## 9. Restricciones Funcionales 

Condiciones que nunca deben violarse. 

|ID|Restricción|
|---|---|
|RF001||
|RF002||
|RF003||



## 10. Historias de Usuario Relacionadas 

Historias de usuario que implementan funcionalidades dentro de este módulo. 

|ID|Historia|Estado|
|---|---|---|
|HU001|HISTORIAS DE USUARIO 3RO CALENDARIO||
|HU002|||
|HU003|||



## 11. Criterios Generales de Aceptación 

Condiciones que deben cumplirse para considerar que el módulo está correctamente implementado. 













- El flujo operativo se ejecuta conforme a esta especificación. 

- Se cumplen todas las reglas globales. 

- Se respetan las restricciones funcionales. 

- La navegación corresponde al flujo definido. 

- Todas las historias de usuario relacionadas han sido implementadas. 

- El módulo puede integrarse con las dependencias definidas. 

## 12. Control de Cambios 

Versión Fecha Autor Descripción del cambio 1.0 Documento inicial 

