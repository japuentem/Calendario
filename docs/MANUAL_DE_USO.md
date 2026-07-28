# Manual de Uso - Sistema de Calendarios Multi-Rol

Esta guía describe el funcionamiento detallado de la plataforma y explica cómo interactuar con cada uno de los paneles y flujos de trabajo correspondientes a los tres roles del sistema: **Administrador**, **Dueño de Calendario** y **Usuario Tercero (Público)**.

---

## 🏛️ 1. Panel de Administración Central (`/admin`)

El Administrador del sistema tiene control global sobre la configuración de las entidades de la plataforma. Su objetivo principal es dar de alta a las organizaciones y a los profesionales que tendrán calendarios activos.

### Características Principales:
1.  **Gestión de Organizaciones:**
    *   **Alta y Modificación:** Permite crear una nueva organización definiendo su Nombre, País, Región, Logotipo (URL) y un Eslogan corporativo.
    *   **Edición:** Permite actualizar la información visual y leyenda de organizaciones existentes.
2.  **Gestión de Profesionales (Dueños de Calendario):**
    *   **Registro de Profesionales:** Permite registrar profesionales ingresando su Nombre, Apellido, Puesto, Correo Electrónico y vinculándolos a una Organización.
    *   **Tipificación de Rol:** Se define si es un **Dueño de Calendario** o un **Asistente de Transición** (co-gestor).
    *   **Gestión de Ausencias y Reasignación:**
        *   Permite activar un periodo de ausencia del profesional definiendo la Causa, Fecha de Inicio y Fecha de Fin de la baja.
        *   **Asistente de Transición:** Permite asignar un asistente que tomará la responsabilidad de las citas del profesional ausente durante su periodo de baja, garantizando la continuidad de las citas del negocio.

---

## 📅 2. Panel del Profesional / Dueño de Calendario (`/owner`)

Cada profesional dispone de un panel privado para personalizar las reglas de su agenda, gestionar sus horarios semanales, definir excepciones y revisar sus citas agendadas.

### Características Principales:
1.  **Selector de Profesional:**
    *   Permite alternar entre los profesionales registrados para simular la sesión de trabajo correspondiente (marca blanca dinámica).
2.  **Configuración de Agenda:**
    *   **Límites de Tiempo (Políticas de Cita):**
        *   *Límite para Reservar:* Antelación mínima (en horas) requerida para que un usuario reserve.
        *   *Límite para Cancelar:* Antelación mínima requerida para que un usuario cancele.
        *   *Límite para Reagendar:* Antelación mínima requerida para que un usuario cambie la hora de su cita.
    *   **Presentación:** Configuración del mensaje de bienvenida y la imagen de presentación de su calendario de reservas.
3.  **Gestión de Disponibilidad Semanal:**
    *   Permite definir los días de la semana (Lunes a Domingo) y los rangos de horas de atención por defecto (ej. *Lunes de 09:00 a 14:00 y de 16:00 a 19:00*).
4.  **Fechas Especiales (Excepciones):**
    *   Permite bloquear días específicos o establecer horarios de atención extraordinarios para fechas concretas del calendario (ej. *24 de Diciembre de 09:00 a 12:00 únicamente*).
5.  **Tipos de Eventos (Servicios):**
    *   Permite definir los diferentes formatos de citas que acepta el profesional (ej. *Videoconferencia, Llamada Telefónica, Reunión Presencial*), asignándoles una Duración (en minutos) y un Margen de Seguridad (tiempo de descanso entre citas para evitar solapamientos).
6.  **Listado de Citas:**
    *   Permite visualizar cronológicamente todas las reuniones agendadas con sus respectivos detalles y asistentes.

---

## 🔗 3. Flujo de Reservas Públicas (`/book`)

El flujo de reservas es público y no requiere autenticación. Está diseñado para ser accedido directamente por clientes o incrustarse (embed) dentro de otras páginas web. El proceso se realiza en 3 sencillos pasos estructurados en la cabecera:

### Paso 1: Selección de Profesional y Cita
1.  El usuario selecciona la **Organización** a la que desea agendar.
2.  El sistema carga dinámicamente la marca, el slogan y la lista de **Profesionales** de esa organización.
3.  El usuario selecciona al profesional deseado y el **Tipo de Evento** que quiere agendar.

### Paso 2: Selección de Fecha y Hora
1.  El sistema despliega un calendario interactivo que evalúa las disponibilidades semanales y las fechas especiales del profesional.
2.  Se restan los horarios ya reservados, los márgenes de seguridad y las políticas de antelación para mostrar únicamente las **Horas Disponibles** reales en la fecha elegida.
3.  El usuario selecciona un slot libre.

### Paso 3: Confirmación de Cita
1.  El usuario completa sus datos de contacto: **Nombre, Apellido, Correo Electrónico y Teléfono**.
2.  Al confirmar, la cita se registra en la base de datos y se le asigna un estado **PENDIENTE**.

---

## 🛠️ 4. Gestión de Citas Agendadas (`/manage-booking/[id]`)

Cuando una reserva se confirma con éxito, el sistema genera una URL única de gestión para esa cita (ej. `http://localhost:3000/manage-booking/id-unico-cita`). 

Desde esta pantalla, el invitado o cliente tercero puede realizar acciones de autoservicio:

1.  **Visualizar Detalles:** Ver el profesional que lo atenderá, el tema de la reunión, fecha, hora de inicio y duración.
2.  **Reagendar Cita:**
    *   El usuario puede seleccionar un nuevo día y hora de entre la disponibilidad en tiempo real del profesional.
    *   Esta acción está sujeta al límite de horas de antelación configurado por el profesional en sus políticas.
3.  **Cancelar Cita:**
    *   El usuario puede cancelar su cita definitivamente.
    *   Esta acción libera automáticamente el slot de tiempo para que otros usuarios puedan agendarlo.
    *   Al igual que reagendar, la cancelación respeta el límite mínimo de antelación configurado por el profesional.
