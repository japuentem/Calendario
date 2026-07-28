# ESPECIFICACIONES CALENDARIO ADMON 

# Especificación Funcional del Módulo 

Documento que describe el comportamiento funcional estándar del módulo CALENDARIO ADMINISTRACION. Sirve como referencia para analistas, diseñadores, desarrolladores y personal de pruebas. Las historias de usuario deberán alinearse con esta especificación. 

# 1. Identificación del Módulo 

|Campo|Valor|
|---|---|
|Código|CALENDARIO ADMON|
|Nombre|CALENDARIO ADMINISTRACION|
|Tipo|Reutilizable / Específico|
|Dominio||
|Versión Funcional||
|Responsable||



### Sistemas donde puede utilizarse 

- CUALQUIERA DONDE UN RESPONSABLE DE DAR SERVICIO REQUIERA 

- INTERACIONES PROGRAMADAS CON TERCEROS 

- CUALQUIERA DONDE EXISTAN PROCESOS DEFINIDOS DONDE SE REQUIERAN 

- INTERACCIONES EN ALGUNO DE LOS PASOS 

### Roles involucrados 

###### ADMINISTRADOR 

# 2. O tivo bje 

ES LA FUNCIONALIDAD PARA GESTIONAR ORGANIZACIONES, DUEÑOS DE CALENDARIOS Y CALENDARIOS PARA DUEÑOS, ASI COMO DE AISTENTES DE 

TRANSICION PARA EL CASO QUE UN DUEÑO DE CALENDARIO DEJE DE OPERAR 

# 3. Alcance 

## Incluye 

- COMPONENTE PARA ADMINISTRADOR DE CALENDARIOS 

## No incluye 

- COMPONENTES DE AUTENTICACION PARA ADMINISTRADOR, YA QUE SE CUENTA 

- CON UN COMPONETE DESDARROLLADO PARA ESTE EFECTO 

# 4. Flujo Operativo Estándar 

Describa el comportamiento normal del módulo independientemente del rol del usuario. 

```
Inicio (MAIN - FLUJO DE ALTA DE CALENDARIO)
   │
   ▼
Pantalla 1 / ALTA ORGANIZACION
   │
   ▼
Pantalla 2 / ALTA DUEÑO DE CALENDARIO
   │
   ▼
Pantalla 3 / ALTA DE CALENDARIO
   │
   ▼
Fin
Inicio (MAIN - FLUJO DE CAMBIO DE DUEÑO DE CALENDRIO)
   │
   ▼
Pantalla 4 / ALTA DE ASISTENTE DE TRANSICION
   │
   ▼
Pantalla 5 / CAMBIO DE ESTADO DE DUEÑO
   │
   ▼
Pantalla 6 / CAMBIO DE DUEÑO POR ASISTENTE DE TRANSICION
   │
   ▼
Fin
Inicio (MAIN - FLUJO DE BAJA DE CALENDARIO)
   │
   ▼
Pantalla 7 / BAJA DE CALENDARIO
    │
   ▼
Fin
Inicio (MAIN - FLUJO DE BAJA DE DUEÑO)
   │
   ▼
Pantalla 8 / BAJA DE DUEÑO
    │
   ▼
Fin
```



##### ADMINISTRACION DE CALENDARIOS 



<!-- Start of picture text -->
ADMINISTRADOR<br>oe<br><!-- End of picture text -->



<!-- Start of picture text -->
GUARDARY<br><!-- End of picture text -->



<!-- Start of picture text -->
ORGANIZACIONES DUENOS CALENDARIOS<br>- ALTA - ALTA - ALTA<br>- BAJA |- BAA OS - BAJA<br>- CAMBIO - CAMBIO<br>ESTADO DE DUENO<br><!-- End of picture text -->



<!-- Start of picture text -->
ACCESAR<br><!-- End of picture text -->

ADMINISTRADOR a 

### ADMINISTRACION DE CALENDARIOS 



<!-- Start of picture text -->
SALIR<br><!-- End of picture text -->



<!-- Start of picture text -->
ORGANIZACION - DATOS<br>IMAGEN ACTUAL MOSTRAR<br>NOMBRE NOMBRE<br>evenpa(SS) LEVENDA [sitwoneasustawos<br><!-- End of picture text -->

### ADMINISTRACION DE CALENDARIOS 



<!-- Start of picture text -->
ADMINISTRADOR<br>ae<br>SALIR<br><!-- End of picture text -->

ADMINISTRADOR ae 

### ADMINISTRACION DE CALENDARIOS 



<!-- Start of picture text -->
DUENO<br>APELLIDO NOME<br><!-- End of picture text -->

### ADMINISTRACION DE CALENDARIOS 



<!-- Start of picture text -->
ADMINISTRADOR<br>ea<br>SALIR<br><!-- End of picture text -->

#### ADMINISTRACION DE CALENDARIOS 



<!-- Start of picture text -->
ADMINISTRADOR<br>aDUENOS<br><!-- End of picture text -->



<!-- Start of picture text -->
SALIR<br><!-- End of picture text -->



<!-- Start of picture text -->
DUENO<br>APELLIDO NoMBRE<br><!-- End of picture text -->

### ADMINISTRACION DE CALENDARIOS 



<!-- Start of picture text -->
DUENO ACTUAL<br>APELLIDO NOMBRE<br>NUEVO DUENO (AGENTE DE TRANSICION)<br>APELLIDO NOMBRE<br><!-- End of picture text -->

ADMINISTRADOR pawsCALENDARIOScai GUARDARY SALE 

ADMINISTRADOR oe 

### ADMINISTRACION DE CALENDARIOS 



<!-- Start of picture text -->
SALIR<br><!-- End of picture text -->



<!-- Start of picture text -->
DUENO<br>APELLIDO NOMBRE<br><!-- End of picture text -->

### ADMINISTRACION DE CALENDARIOS 



<!-- Start of picture text -->
ADMINISTRADOR<br>preriera<br><!-- End of picture text -->



<!-- Start of picture text -->
SALIR<br><!-- End of picture text -->



<!-- Start of picture text -->
DUENO<br><!-- End of picture text -->

### ADMINISTRACION DE CALENDARIOS 

ADMINISTRADOR a ala 



<!-- Start of picture text -->
SALIR<br><!-- End of picture text -->



|ID|Regla|
|---|---|
|RG<br>001|SOLO DE PUEDEN DAR DE ALTA DUEÑOS O ASISTENTES EN UNA<br>ORGANIZACION EXISTENTE|
|RG|SOLO SE PUEDE DAR DE ALTA UN CALENDARIO POR DUEÑO|
|002||
|RG|SOLO SE PUEDE HACER CAMBIO DE DUEÑO CUANDO SE TIENE EL CAMBIO DE<br>|
|003|ESTADO DEL DUEÑO, Y EL ASISTENTE DADO DE ALTA|
|RG|LAS BAJAS DE CALENDARIO ELIMINAN LOS EVENTOS REGISTRADOS Y SUS|
|004|ELEMENTOS ADJUNTOS CARGADOS, EN CASCADA Y DEBEN PEDIR<br>CONFIRMACION|
|RG|LAS BAJAS DE DUEÑO ELIMINAN SU CALENDARIO Y SYS ENEVTOS Y SUS|
|005|ADJUNTOS, EN CASCADA Y DEBEN PEDIR CONFIRMACION|
|RG|LAS BAJAS DE ORGANIZCION ELIMINAN LOS DUEÑOS Y ASISTENTES Y SUS|
|006|EVENTOS Y ADJUNTOS, EN CASCADA Y DEBEN PEDIR CONFIRMACION|



# 6. Estados del Módulo 

|Estado|Descripción|
|---|---|
|Inicial||
|En captura||
|Validado||
|Confirmado||
|Finalizado||



# 7. Nav ación eg 

###### Describe las transiciones permitidas entre pantallas o vistas. 

|Desde|Hacia|Condición|
|---|---|---|
|PANTALLA 0|CUALQUIER PANTALLA|USAR OPCION DE MENU|



# 8. Dependencias 

Servicios, módulos o componentes requeridos para el funcionamiento. 

|Dependencia|Tipo|Obligatoria|
|---|---|---|
|DIRECTA|DB TABLAS PAIS Y ESTADO / REGION|SI|
|DIRECTA|DB TABLAS SERVICIO CALENDARIO|SI|
|INDIRECTA|MODULO AUTENTICACION PARA ADMINISTRADOR Y<br>DUEÑOS|SI|



# 9. Restricciones Funcionales 

Condiciones que nunca deben violarse. 

|ID|Restricción|
|---|---|
|RF001||
|RF002||
|RF003||



# 10. Historias de Usuario Relacionadas 

Historias de usuario que implementan funcionalidades dentro de este módulo. 

|ID|Historia|Estado|
|---|---|---|
|HU001|HISTORIAS DE USUARIO ADMINISTRADOR DE CALENDARIOS|TERMINADO|
|HU002|||
|HU003|||



# 11. Criterios Generales de Aceptación 

Condiciones que deben cumplirse para considerar que el módulo está correctamente implementado. 













- El flujo operativo se ejecuta conforme a esta especificación. 

- Se cumplen todas las reglas globales. 

- Se respetan las restricciones funcionales. 

- La navegación corresponde al flujo definido. 

- Todas las historias de usuario relacionadas han sido implementadas. 

- El módulo puede integrarse con las dependencias definidas. 

# 12. Control de Cambios 

Versión Fecha Autor Descripción del cambio 1.0 22/7/26 GIL Documento inicial 

