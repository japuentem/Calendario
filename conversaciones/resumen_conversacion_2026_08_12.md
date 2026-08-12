# Resumen de Conversación - 2026-08-12

## 📋 Pedidos del Usuario
1. **Análisis de Agentes:** Analizar el documento `D:\proyectos_personales\Agency Agents v0.3.0 — Runbooks.txt` y determinar qué agentes son útiles para los proyectos en `D:\proyectos_personales`.
2. **Ubicación del repositorio:** Determinar dónde es mejor clonar `agency-agents` y cómo integrar los agentes al proyecto `Calendario`.
3. **Selección en la App Nativa:** Orientación sobre qué opción seleccionar en la app desktop de Agency Agents (`Configurar ~/.agency-agents` vs `Usar mi propio clon`).
4. **Optimización de Almacenamiento en Disco:** Configurar el almacenamiento de los agentes en el disco `D:` para evitar saturar la unidad `C:`.
5. **Instalación de Agentes en el Proyecto:** Copiar e integrar los 5 agentes más relevantes dentro de la carpeta `.agents/skills/` de `Calendario`.
6. **Comentarios de Requerimientos y Feedback del Calendario:**
   - **De Fondo (Pantalla 2 / DC-02):** Permitir al dueño seleccionar qué eventos están activos/disponibles y personalizar el nombre de los eventos (ej. eventos a domicilio).
   - **Cosméticos:** Corregir el contraste de color de letras en menús y solucionar el desbordamiento de tarjeta/pantalla.
   - **Omisión en Invitados:** Solicitar obligatoriamente `Nombre`, `Apellido` y `Correo` al agregar otros invitados en un evento.
7. **Script de Despliegue a Linux:** Generación del script y comandos para subir y aplicar los cambios en el servidor Linux.

## 🛠️ Respuestas e Implementaciones
1. **Identificación de Agentes por Proyecto:**
   - **Frontend & Web (`Calendario`, `Customer Support`, etc.):** `frontend-developer`, `ui-designer`, `whimsy-injector`, `backend-architect`.
   - **Móvil (`beaver_taximetro`, `MediAmigo`, etc.):** `mobile-app-builder`, `mobile-release-engineer`.
   - **Backend & Java (`MOTOR_ENCUESTAS`, SQL):** `senior-developer`, `database-optimizer`.
   - **Seguridad & QA:** `appsec-engineer`, `test-automation-engineer`, `api-tester`.
   - **Documentación:** `technical-writer`.

2. **Configuración de Enlace Simbólico (Junction) en Windows:**
   - Se eliminó la copia de catálogo almacenada en `C:\Users\japue\.agency-agents`.
   - Se creó un enlace simbólico de tipo *Directory Junction* desde `C:\Users\japue\.agency-agents` hacia `D:\proyectos_personales\agency-agents`.
   - **Resultado:** Liberación de espacio en la unidad `C:` conservando el 100% de la funcionalidad.

3. **Instalación de Agentes en `Calendario`:**
   Se crearon e integraron los 5 agentes seleccionados como habilidades (*skills*) con formato `SKILL.md` en `d:\proyectos_personales\html\Calendario\.agents\skills\`:
   - 🖥️ `frontend-developer` ([SKILL.md](file:///d:/proyectos_personales/html/Calendario/.agents/skills/frontend-developer/SKILL.md))
   - 🎨 `ui-designer` ([SKILL.md](file:///d:/proyectos_personales/html/Calendario/.agents/skills/ui-designer/SKILL.md))
   - ✨ `whimsy-injector` ([SKILL.md](file:///d:/proyectos_personales/html/Calendario/.agents/skills/whimsy-injector/SKILL.md))
   - 🗄️ `database-optimizer` ([SKILL.md](file:///d:/proyectos_personales/html/Calendario/.agents/skills/database-optimizer/SKILL.md))
   - 🛡️ `appsec-engineer` ([SKILL.md](file:///d:/proyectos_personales/html/Calendario/.agents/skills/appsec-engineer/SKILL.md))

4. **Implementación Completa de los Ajustes del Calendario:**
   - **Selección y Personalización de Eventos (Pantalla 2):** Se añadieron los campos `activo` y `nombrePersonalizado` a `TipoEvento` en Prisma schema, la API de calendarios, la interfaz del dueño y el selector público de reservas.
   - **Mejora Visual & Layout:** Se ajustó el contraste de fuentes de títulos de menú a blanco/colores de alto contraste y se resolvieron los desbordamientos de pantalla en tarjetas y menús desplegables.
   - **Captura Completa de Invitados:** Se modificó la interfaz de reserva y la API de `bookings` para requerir `Nombre`, `Apellido` y `Correo` por cada invitado adicional.

5. **Generación de Scripts de Despliegue a Linux:**
   - Se creó [scripts/update_remote.sh](file:///d:/proyectos_personales/html/Calendario/scripts/update_remote.sh) para ejecutar la actualización automática de Git, Prisma, Build y PM2 en el servidor Linux.
   - Se creó [scripts/deploy_to_linux.ps1](file:///d:/proyectos_personales/html/Calendario/scripts/deploy_to_linux.ps1) para automatizar el `git add`, `git commit` y `git push` desde PowerShell en Windows.
