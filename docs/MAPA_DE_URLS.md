# Mapa de Rutas y URLs del Proyecto

Este documento detalla todas las rutas del frontend (páginas de Next.js en servidor local) y los endpoints del backend (rutas API) que componen la aplicación, con su ubicación en el código y una descripción de su funcionalidad.

---

## 🌐 Rutas de Frontend (Vistas de Usuario)

Estas son las rutas accesibles por los usuarios a través del navegador. Por defecto, en desarrollo local se acceden mediante los siguientes enlaces:

| URL Local | Archivo en Código | Propósito | Componentes / Parámetros |
| :--- | :--- | :--- | :--- |
| [http://localhost:3000/](http://localhost:3000/) | [src/app/page.tsx](file:///d:/proyectos_personales/html/Calendario/src/app/page.tsx) | **Página de Inicio / Landing Page** | Panel de bienvenida con accesos directos a los tres roles principales (Admin, Dueño, Reserva). |
| [http://localhost:3000/admin](http://localhost:3000/admin) | [src/app/admin/page.tsx](file:///d:/proyectos_personales/html/Calendario/src/app/admin/page.tsx) | **Panel del Administrador** | Permite dar de alta organizaciones, registrar dueños, y reasignar calendarios por bajas/ausencias. |
| [http://localhost:3000/owner](http://localhost:3000/owner) | [src/app/owner/page.tsx](file:///d:/proyectos_personales/html/Calendario/src/app/owner/page.tsx) | **Panel de Dueño de Calendario** | Permite configurar disponibilidad horaria, definir fechas especiales, gestionar tipos de eventos y ver citas programadas. |
| [http://localhost:3000/book](http://localhost:3000/book) | [src/app/book/page.tsx](file:///d:/proyectos_personales/html/Calendario/src/app/book/page.tsx) | **Página de Reserva Pública** | Permite a terceros (invitados/clientes) seleccionar una organización, un profesional (dueño), un tipo de evento, una fecha y hora disponible, y agendar la cita. |
| [http://localhost:3000/manage-booking/[id]](http://localhost:3000/manage-booking/%5Bid%5D) | [src/app/manage-booking/[id]/page.tsx](file:///d:/proyectos_personales/html/Calendario/src/app/manage-booking/[id]/page.tsx) | **Gestión de Citas para Invitados** | Página dinámica pública donde el creador de la cita puede consultar detalles, cancelar o reagendar el evento dentro de los límites configurados. |

---

## ⚡ Rutas de API (Backend)

Todos los endpoints se acceden bajo el prefijo `http://localhost:3000/api` y devuelven respuestas en formato JSON.

### 🏢 Organizaciones

*   **Ruta:** `http://localhost:3000/api/organizations`
    *   **Archivo:** [src/app/api/organizations/route.ts](file:///d:/proyectos_personales/html/Calendario/src/app/api/organizations/route.ts)
    *   **Métodos:**
        *   `GET`: Obtiene la lista de todas las organizaciones en orden alfabético, incluyendo los dueños y la configuración de sus calendarios.
        *   `POST`: Registra una nueva organización en la base de datos.
            *   *Body esperado:* `{ nombre: string, pais?: string, region?: string, imagenUrl?: string, leyenda?: string }`
*   **Ruta:** `http://localhost:3000/api/organizations/[id]`
    *   **Archivo:** [src/app/api/organizations/[id]/route.ts](file:///d:/proyectos_personales/html/Calendario/src/app/api/organizations/%5Bid%5D/route.ts)
    *   **Métodos:**
        *   `PUT`: Actualiza la información de una organización existente.
            *   *Body esperado:* `{ nombre: string, pais?: string, region?: string, imagenUrl?: string, leyenda?: string }`
        *   `DELETE`: Elimina una organización. Por cascade constraints, elimina también sus dueños y calendarios asociados.

### 👤 Dueños de Calendario (Owners)

*   **Ruta:** `http://localhost:3000/api/owners`
    *   **Archivo:** [src/app/api/owners/route.ts](file:///d:/proyectos_personales/html/Calendario/src/app/api/owners/route.ts)
    *   **Métodos:**
        *   `GET`: Obtiene la lista de todos los dueños en la base de datos, con su información de organización y configuración de calendario.
        *   `POST`: Registra un nuevo dueño. Si el tipo es `DUEÑO_DE_CALENDARIO`, automáticamente genera su calendario por defecto, tipos de eventos iniciales y su disponibilidad horaria (Lunes a Viernes de 9:00 a 18:00).
            *   *Body esperado:* `{ nombre: string, apellido: string, puesto: string, correo: string, tipo: 'DUEÑO_DE_CALENDARIO' | 'ASISTENTE', estado?: string, organizacionId: string }`
*   **Ruta:** `http://localhost:3000/api/owners/[id]`
    *   **Archivo:** [src/app/api/owners/[id]/route.ts](file:///d:/proyectos_personales/html/Calendario/src/app/api/owners/%5Bid%5D/route.ts)
    *   **Métodos:**
        *   `PUT`: Actualiza el perfil de un dueño, incluyendo el estado de ausencia y sus fechas correspondientes.
            *   *Body esperado:* `{ nombre: string, apellido: string, puesto: string, correo: string, estado: string, fechaInicioAusencia?: string, fechaFinAusencia?: string, causaAusencia?: string }`
        *   `DELETE`: Elimina al dueño y su calendario de forma definitiva.

### 📅 Configuración de Calendarios

*   **Ruta:** `http://localhost:3000/api/calendars/[id]`
    *   **Archivo:** [src/app/api/calendars/[id]/route.ts](file:///d:/proyectos_personales/html/Calendario/src/app/api/calendars/%5Bid%5D/route.ts)
    *   **Métodos:**
        *   `PUT`: Actualiza de forma atómica (usando transacciones) toda la configuración de un calendario: sus datos generales (nombre, límites de horas, permitir invitados), tipos de eventos, disponibilidades semanales y fechas especiales.
            *   *Body esperado:*
                ```json
                {
                  "nombre": "string",
                  "permitirInvitados": boolean,
                  "mensajeCierre": "string",
                  "imagenPresentacion": "string",
                  "limitesAgendar": number,
                  "limitesCancelar": number,
                  "limitesReagendar": number,
                  "tiposEventos": [
                    { "nombre": "string", "duracion": number, "margenSeguridad": number }
                  ],
                  "disponibilidades": [
                    { "diaSemana": number, "horaInicio": "HH:MM", "horaFin": "HH:MM" }
                  ],
                  "fechasEspeciales": [
                    { "fecha": "YYYY-MM-DD", "horaInicio": "HH:MM", "horaFin": "HH:MM" }
                  ]
                }
                ```
*   **Ruta:** `http://localhost:3000/api/calendars/[id]/reassign`
    *   **Archivo:** [src/app/api/calendars/[id]/reassign/route.ts](file:///d:/proyectos_personales/html/Calendario/src/app/api/calendars/%5Bid%5D/reassign/route.ts)
    *   **Métodos:**
        *   `POST`: Reasigna un calendario existente a un nuevo dueño (por ejemplo, en caso de baja o transferencia de agenda). Al reasignar, también promueve al nuevo dueño al tipo `DUEÑO_DE_CALENDARIO`.
            *   *Body esperado:* `{ "newOwnerId": string }`

### 📝 Reservas (Bookings / Citas)

*   **Ruta:** `http://localhost:3000/api/bookings`
    *   **Archivo:** [src/app/api/bookings/route.ts](file:///d:/proyectos_personales/html/Calendario/src/app/api/bookings/route.ts)
    *   **Métodos:**
        *   `GET`: Obtiene todos los eventos de un calendario específico.
            *   *Query Parameters:* `?calendarId=UUID` (Obligatorio)
        *   `POST`: Crea una reserva de cita y agrega al participante principal y a cualquier participante invitado adicional.
            *   *Body esperado:*
                ```json
                {
                  "tema": "string",
                  "fecha": "YYYY-MM-DD",
                  "horaInicio": "HH:MM",
                  "duracion": number,
                  "calendarioId": "string",
                  "contactoNombre": "string",
                  "contactoApellido": "string",
                  "contactoCorreo": "string",
                  "contactoTelefono": "string",
                  "invitados": ["correo1@ejemplo.com", "correo2@ejemplo.com"]
                }
                ```
*   **Ruta:** `http://localhost:3000/api/bookings/[id]`
    *   **Archivo:** [src/app/api/bookings/[id]/route.ts](file:///d:/proyectos_personales/html/Calendario/src/app/api/bookings/%5Bid%5D/route.ts)
    *   **Métodos:**
        *   `GET`: Obtiene la información detallada de una cita específica por su ID, incluyendo datos del calendario, del dueño y los participantes.
        *   `PUT`: Actualiza el estado, tema, fecha o duración de una reserva existente (utilizado para reprogramaciones).
            *   *Body esperado:* `{ tema?: string, fecha?: string, horaInicio?: string, duracion?: number, estado?: string }`
        *   `DELETE`: Elimina una cita de la base de datos (utilizado al cancelar citas definitivamente).
