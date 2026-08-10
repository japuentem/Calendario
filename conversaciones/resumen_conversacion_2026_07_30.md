# Resumen de Conversación - 30 de Julio de 2026

## Pedidos del Usuario
1. **Punto 1 (Arquitectura General):** Agregar el Módulo de Comunicaciones (marcado como en proceso de detalle).
2. **Punto 2-A (Configuración):** Incluir la opción de selección de eventos elegibles para un calendario.
3. **Punto 2-B (Gestión de Eventos):** Incluir las opciones de *"Nuevo participante"* (ya implementado) y *"Carga de Liga de videoconferencia"* (en proceso de detalle).
4. **Punto 2-C (Reserva Terceros):** Incluir la opción de campos de domicilio condicionales según el tipo de evento (en proceso de detalle).
5. **Punto 3 (Módulo de Administración):** Separar y clarificar la regla de bajas en cascada (las bajas de calendarios eliminan eventos y adjuntos asociados; las bajas de organizaciones eliminan en cascada dueños, calendarios, eventos y adjuntos asociados).
6. **Punto 3 (Módulo de Validación de Contacto):** Actualizar la regla del campo "Teléfono" para indicar que es estrictamente obligatorio tanto para *"Recibir llamada"* como para *"Hacer llamada"*.
7. **Punto 3 (Módulo de Notificaciones):** Actualizar la regla de notificaciones para indicar que el correo recordatorio se envía 24 horas antes de la hora del evento.

## Respuestas e Implementaciones Realizadas

### 1. Documentación de Especificaciones Funcionales
* Se creó el documento formal `especificaciones/DIAGRAMA_FUNCIONALIDAD_CALENDARIOS.md` en formato Markdown que consolida y documenta los 7 puntos de ajuste requeridos.

### 2. Validación de Teléfono Obligatorio en Interfaz de Reservas
* Se actualizó la lógica y validación condicional del formulario en `src/app/book/page.tsx` para exigir la captura obligatoria del número telefónico cuando el evento es de tipo `RECIBIR_LLAMADA`, `REALIZAR_LLAMADA` o `HACER_LLAMADA`.

### 3. Guía de Instalación para Servidor Linux
* Se modificó el documento [docs/GUIA_INSTALACION.md](file:///d:/proyectos_personales/html/Calendario/docs/GUIA_INSTALACION.md) con las instrucciones completas paso a paso para una instalación limpia en servidor Linux:
  * Inclusión explícita del **Usuario del SO** y la **Ruta de Trabajo exacta** (`cd /var/www/calendario`) al inicio de cada paso y comando.
  * Creación del usuario dedicado de sistema `calendario` (sin privilegios root).
  * Creación y asignación de permisos de la carpeta `/var/www/calendario`.
  * Flujo de ejecución sin `sudo`, variables `.env`, sincronización con Prisma ORM y servicio de producción con PM2.

### 4. Registro de Conversación
* Se actualizó este archivo de resumen dentro de la carpeta `conversaciones/` con el nombre `resumen_conversacion_2026_07_30.md` conforme a las reglas del proyecto.
