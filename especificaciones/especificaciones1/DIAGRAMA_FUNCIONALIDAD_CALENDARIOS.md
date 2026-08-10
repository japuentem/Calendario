# DIAGRAMA DE FUNCIONALIDAD DE CALENDARIOS (V1.2)

Documento consolidado con la arquitectura funcional, flujos operativos y reglas de negocio actualizadas.

---

## 1. Arquitectura General del Sistema

El sistema se compone de los siguientes módulos funcionales:

1. **Módulo de Administración de Calendarios:** Permite a los administradores gestionar Organizaciones, Dueños de Calendarios, Calendarios por Dueño y Asistentes de Transición.
2. **Módulo de Dueños de Calendarios:** Permite a los dueños configurar disponibilidades semanales, fechas especiales, límites de agendamiento/cancelación/reprogramación y seleccionar los eventos elegibles.
3. **Módulo de Agendamiento por Terceros (Vista Pública):** Permite a usuarios externos reservar horarios disponibles en el calendario de un dueño.
4. **Módulo de Comunicaciones *(En proceso de detalle)*:** Encargado del envío de notificaciones por correo electrónico, recordatorios programados y gestión de plantillas de comunicación.

---

## 2. Flujo Operativo y Pantallas

### 2-A. Configuración de Calendarios y Selección de Eventos
* **Alta y Asignación:** Estructura jerárquica Organización ➔ Dueño de Calendario ➔ Calendario.
* **Selección de Eventos Elegibles:** Cada calendario debe permitir la selección e inclusión de los tipos de eventos específicos que estarán disponibles para agendamiento por parte de terceros (ej. Cita presencial, Reunión, Videoconferencia, Recibir llamada, Hacer llamada).

### 2-B. Gestión de Eventos (Pantalla de Dueño)
Dentro de la tabla de gestión de eventos agendados, el dueño cuenta con el menú contextual de acciones:
1. **Ver Detalles:** Consulta completa de la información de la cita.
2. **Reprogramar / Cancelar:** Flujo de actualización con validación de tiempos límites.
3. **Nuevo Participante:** Permite al dueño o asistente agregar nuevos participantes/invitados a una reunión existente recopilando Nombre, Apellido, Correo y Teléfono.
4. **Carga de Liga de Videoconferencia *(En proceso de detalle)*:** Permite ingresar o actualizar la URL/enlace de la videoconferencia asignada al evento.

### 2-C. Agendamiento por Terceros (Paso 3 - Captura de Datos)
* **Formulario Principal:** Captura obligatoria de Nombre, Apellido y Correo Electrónico.
* **Campos de Domicilio Condicionales *(En proceso de detalle)*:** Formulario dinámico para solicitar datos de dirección o localización física, activo únicamente según el tipo de evento seleccionado.

---

## 3. Reglas de Negocio y Módulos de Soporte

### Módulo de Administración (Estructura y Bajas en Cascada)
* **Asociación 1:1:** Solo se permite un calendario por cada Dueño de Calendario.
* **Baja de Calendarios:** Las bajas de calendarios eliminan en cascada todos los eventos y archivos adjuntos asociados previa confirmación del administrador.
* **Baja de Organizaciones:** Las bajas de organizaciones eliminan en cascada a todos los Dueños de Calendario de dicha organización, sus calendarios asociados, eventos y archivos adjuntos previa confirmación del administrador.

### Módulo de Validación de Contacto
* **Teléfono de Contacto:** El campo "Teléfono" es opcional para citas presenciales, reuniones y videoconferencias, pero es **estrictamente obligatorio** cuando el evento es de tipo **"Recibir llamada"** O de tipo **"Hacer llamada"**.

### Módulo de Notificaciones
* **Correo de Confirmación:** Se envía inmediatamente al completar el agendamiento por parte del tercero o dueño.
* **Correo Recordatorio:** Se genera y envía automáticamente **24 HORAS ANTES** de la hora exacta programada del evento.
