# Reglas del Proyecto: Calendario Multi-Rol

Este archivo contiene lineamientos para asegurar la coherencia del código, diseño y decisiones de arquitectura en este repositorio.

## 🛠️ Pila Tecnológica
- **Framework:** Next.js (App Router, React, TypeScript).
- **Base de Datos:** SQLite para desarrollo local, utilizando Prisma ORM.
- **Estilos:** Vanilla CSS (CSS Modules), con diseño fluido, soporte para modo oscuro, gradientes sutiles y micro-animaciones premium.

## 📐 Estructura y Estilo de Código
1. **Componentes:** Deben ser lo más puros posibles y ubicarse en `src/components`. Usar CSS Modules para encapsular estilos.
2. **TypeScript:** Tipar rigurosamente todas las interfaces de datos (e.g., `Organizacion`, `Dueno`, `Evento`, `Invitado`).
3. **Internacionalización y Fechas:** Almacenar todas las fechas en la base de datos en UTC (ISO 8601). En el cliente, convertirlas a la hora local del usuario tercero o a la zona horaria del dueño según corresponda.
4. **Seguridad:** Los endpoints de cancelación y reprogramación deben requerir tokens firmados y validados.

## 🎨 Diseño Visual
- Usar una paleta de colores moderna y profesional (ej. HSL tailoreados, modo oscuro refinado, acentos vibrantes pero profesionales como azules índigo o violetas en lugar de colores primarios puros).
- Evitar placeholders; generar imágenes reales de prueba cuando sea necesario.
- Agregar micro-interacciones sutiles en botones y enlaces.

## 📁 Registro de Conversaciones
- Al finalizar cada sesión de trabajo, el Agente debe compilar los pedidos del usuario y un resumen de las respuestas implementadas en un archivo markdown.
- Este archivo debe guardarse dentro de la carpeta `conversaciones/` en la raíz del proyecto.
- El nombre del archivo debe incluir la fecha local del día con formato `resumen_conversacion_AAAA_MM_DD.md` (ej. `resumen_conversacion_2026_07_26.md`).
