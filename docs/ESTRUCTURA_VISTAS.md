# Estructura Visual y Diseño de las Pantallas (Layout)

Este documento detalla la estructura base y el diseño visual (*Layout*) unificado que cumplen las pantallas del **Sistema de Calendarios Multi-Rol**.

---

## 📐 Estructura General del Layout (Pantalla 0)

Todas las vistas principales de la aplicación se organizan bajo un esquema jerárquico común para garantizar coherencia en la experiencia de usuario (UX):

```
+--------------------------------------------------------------------------------------------------+
|  [Logo] SOMOS ALEBRIJES               DUEÑO DE CALENDARIO                    Juan Perez          |
|         Siempre Asustamos                                                    MAIN                |
|                                                                              [ GUARDAR Y SALIR ] |
+--------------------------------------------------------------------------------------------------+
|                                                                                                  |
|   +------------------------------------------------------------------------------------------+   |
|   |                                                                                          |   |
|   |                                     FUNCIONALIDAD                                        |   |
|   |                                                                                          |   |
|   |                                                                                          |   |
|   +------------------------------------------------------------------------------------------+   |
|                                                                                                  |
+--------------------------------------------------------------------------------------------------+
```

### 1. Encabezado Superior (Header)
El encabezado está dividido en tres zonas funcionales:

*   **Extremo Izquierdo (Identidad Corporativa de la Organización):**
    *   **Imagen o Logo de la Organización:** Elemento gráfico representativo de la empresa o entidad activa (ejemplo: logo de *Somos Alebrijes*).
    *   **Nombre de la Organización:** Nombre comercial o institucional.
    *   **Frase / Slogan:** Leyenda característica debajo del nombre (ejemplo: *Siempre asustamos*).
*   **Zona Central (Contexto del Rol):**
    *   **Actor / Rol:** Etiqueta en tipografía destacada que define el rol actual en la sesión (ej. `DUEÑO DE CALENDARIO`, `ADMINISTRADOR`, `USUARIO TERCERO`).
*   **Extremo Derecho (Sesión y Control de Navegación):**
    *   **Nombre del Actor:** Identificación del usuario activo en la sesión (ej. `Juan Perez`).
    *   **Ubicación / Página:** Indicador del módulo o sección en la que se encuentra dentro del flujo (ej. `MAIN`).
    *   **Botón de Guardar y Salir:** Acción principal para salvar el estado de la sesión y retornar de forma segura al panel general o landing page.

---

### 2. Área de Contenido Principal (Frame de Funcionalidad)
*   Ubicada en la parte inferior del encabezado.
*   Diseñada como un lienzo contenedor delimitado con bordes redondeados y un fondo sutilmente contrastado.
*   En esta sección se renderizan dinámicamente las herramientas interactivas, tablas, formularios de configuración, calendarios y flujos de reserva según el rol y la página seleccionada.
