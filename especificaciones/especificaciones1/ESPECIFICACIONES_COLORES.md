# Especificación de Colores y Guía de Estilos Visuales

Este documento detalla la paleta de colores y el sistema de diseño visual utilizado para crear la interfaz oscura premium (*Dark Theme*) del proyecto Calendario Multi-Rol.

---

## 1. Colores de Fondo y Contenedores (Canvas & Surfaces)

Establecen la jerarquía visual de profundidad (los elementos más importantes son más claros y flotan sobre el fondo):

*   **Fondo Base (Terciario):** Slate-900 (`#0f172a`). Es el lienzo oscuro de toda la aplicación.
*   **Gradientes de Profundidad:** Usamos gradientes radiales sutiles en las esquinas superiores con tonos Indigo (`rgba(99, 102, 241, 0.15)`) y Púrpura (`rgba(168, 85, 247, 0.15)`) para simular iluminación tridimensional de fondo.
*   **Tarjetas y Modales (Secundario):** Slate-800 (`#1e293b` con opacidad del 40% al 60%). Utiliza un efecto de cristal (*glassmorphism*) con desenfoque de fondo (`backdrop-filter: blur(12px)`).
*   **Bordes de Contenedores:** Líneas extra finas semitransparentes (`rgba(255, 255, 255, 0.05)`) que definen las tarjetas sin saturar la pantalla.

---

## 2. Colores Primarios (Acción Principal / Brand Colors)

Se asocian a las acciones interactivas primarias, botones y estados seleccionados. Para dar identidad a cada rol, definimos un acento único:

*   **Acento Profesional (Dueño/Admin):** Gradiente lineal de **Índigo a Púrpura** (`linear-gradient(135deg, #6366f1 0%, #a855f7 100%)`). Representa seriedad y elegancia.
*   **Acento Público (Tercero - Agendar):** Gradiente lineal de **Teal a Teal Brillante** (`linear-gradient(135deg, #0d9488 0%, #2dd4bf 100%)`). Representa frescura, accesibilidad y dinamismo.
*   **Acento de Autogestión (Tercero - Cancelar/Reagendar):** Gradiente de **Sky Blue** (`linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)`). Representa soporte y asistencia.

---

## 3. Colores Secundarios y Terciarios (Textos y Bordes)

Regulan el contraste de la información para guiar la lectura:

*   **Texto Primario (Títulos y Fechas):** Blanco puro o Slate-50 (`#f8fafc`). Contraste máximo.
*   **Texto Secundario (Descripciones, Puestos):** Slate-300 (`#cbd5e1`). Un tono gris claro y suave que evita la fatiga visual.
*   **Texto Terciario (Etiquetas de formularios, subtítulos):** Slate-400 (`#94a3b8`).
*   **Texto Deshabilitado (Días inactivos del calendario):** Slate-600 (`#334155`) o Slate-700.

---

## 4. Colores de Estado (Feedback / Semáforo)

Utilizados para badges de estado de citas o alertas de seguridad:

*   **Éxito / Activo / Completado:** Verde Esmeralda (`#34d399` de texto con fondo `rgba(16, 185, 129, 0.1)`).
*   **Advertencia / Ausencia Temporal / Pendiente:** Ámbar (`#fcd34d` de texto con fondo `rgba(245, 158, 11, 0.1)`).
*   **Peligro / Baja de Miembros / Cancelado:** Rojo (`#fca5a5` de texto con fondo `rgba(239, 68, 68, 0.1)`).

---

## 5. Propuesta de Variables Globales (CSS Variables)

Para unificar y reutilizar estos estilos centralizadamente, se pueden mapear en el archivo centralizado `:root` de estilos globales:

```css
:root {
  --background-base: #0f172a;
  --surface-card: rgba(30, 41, 59, 0.4);
  --border-glow: rgba(255, 255, 255, 0.05);
  
  /* Brand gradients & accents */
  --primary-gradient-brand: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  --primary-gradient-public: linear-gradient(135deg, #0d9488 0%, #2dd4bf 100%);
  --primary-gradient-action: linear-gradient(135deg, #38bdf8 0%, #0284c7 100%);
  
  /* Typography */
  --text-primary: #f8fafc;
  --text-secondary: #cbd5e1;
  --text-muted: #94a3b8;
  --text-disabled: #334155;
  
  /* Status Semaphores */
  --status-success: #34d399;
  --status-success-bg: rgba(16, 185, 129, 0.1);
  --status-warning: #fcd34d;
  --status-warning-bg: rgba(245, 158, 11, 0.1);
  --status-danger: #fca5a5;
  --status-danger-bg: rgba(239, 68, 68, 0.1);
}
```
