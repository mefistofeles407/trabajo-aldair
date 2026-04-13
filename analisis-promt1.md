# Análisis del Estado Actual del Proyecto — Síntesis y Dudas para Prompt 2

> **Instrucción de partida:** Este documento analiza la respuesta de Horizon al Prompt 1
> (archivo `promt1.txt`), sintetiza el estado real del proyecto y prepara las preguntas
> específicas que se usarán en el Prompt 2.
> **No se proponen soluciones ni se escribe código en esta etapa.**

---

## 1. Contexto general verificado

| Elemento | Valor confirmado |
|---|---|
| Tipo de proyecto | Sitio web informativo para arquitecto (cliente ficticio) |
| Entorno de trabajo | Hostinger Horizon (editor online, sin acceso local) |
| Restricción operativa | No se pueden crear/eliminar archivos libremente; los créditos son limitados |
| Usuario administrador | Uno solo (el arquitecto) |
| Estado del ciclo | Tarea en curso; el nivel aumenta cada entrega |
| Objetivo actual | Panel de administración para editar textos, imágenes, secciones y subsecciones |

---

## 2. Lo que el Prompt 1 debe revelar — áreas a verificar

Estas son las áreas que la respuesta de Horizon debería haber cubierto.
Se clasifican según su estado esperado antes de leer la respuesta completa:

### 2.1 Tecnologías

- **Esperado probable:** HTML, CSS, JavaScript para el frontend; PHP para lógica de servidor; MySQL para base de datos.
- **A confirmar:**
  - ¿Usa algún framework PHP (Laravel, CodeIgniter, otro) o es PHP puro?
  - ¿Usa algún framework CSS (Bootstrap, Tailwind, otro) o CSS propio?
  - ¿Hay alguna librería JS (jQuery, Alpine, Vue, React, otro)?
  - ¿El sitio es completamente estático (solo HTML/CSS/JS) o ya tiene partes dinámicas con PHP?

### 2.2 Estructura real de archivos

- **Esperado probable:** Archivos HTML o PHP separados por sección; una carpeta para imágenes; posiblemente una carpeta `admin/` o `panel/`.
- **A confirmar:**
  - ¿Cuántos archivos PHP o HTML existen exactamente?
  - ¿Existe una carpeta `admin/` o equivalente?
  - ¿Existe un archivo de conexión a base de datos (`db.php`, `conexion.php`, `config.php`)?
  - ¿Existe algún archivo `.htaccess`?
  - ¿Existe algún `index.php` o `index.html` como punto de entrada?

### 2.3 Base de datos

- **Esperado probable:** Base de datos MySQL existente; estado desconocido de tablas.
- **A confirmar:**
  - ¿Existe conexión activa a una base de datos?
  - ¿Qué tablas existen? ¿Con qué nombres y campos?
  - ¿El contenido del sitio (textos, imágenes) viene de la base de datos o está hardcodeado en el HTML/PHP?
  - ¿Existe alguna tabla de usuarios o de credenciales de admin?

### 2.4 Autenticación

- **Esperado probable:** Login básico o inexistente.
- **A confirmar:**
  - ¿Existe algún formulario de login?
  - ¿Existe manejo de sesiones (`session_start`, `$_SESSION`)?
  - ¿Las credenciales del admin están en código, en la base de datos, o no existen todavía?
  - ¿Hay protección de rutas del panel (redirige si no hay sesión)?

### 2.5 Panel de administración

- **Esperado probable:** Iniciado pero incompleto.
- **A confirmar:**
  - ¿Qué archivos del panel existen actualmente?
  - ¿Qué pantallas o vistas del panel están construidas?
  - ¿Hay formularios para editar textos o imágenes?
  - ¿Existe lógica de guardado (INSERT o UPDATE en base de datos)?
  - ¿El panel tiene estilos propios o usa los del sitio público?

### 2.6 Gestión de contenido

- **Esperado probable:** Contenido hardcodeado en archivos HTML/PHP.
- **A confirmar:**
  - ¿Los textos del sitio están en el HTML directamente o se leen desde base de datos?
  - ¿Las imágenes están referenciadas con rutas fijas o se gestionan dinámicamente?
  - ¿Existe alguna carpeta de imágenes con nombre específico (`/img`, `/images`, `/uploads`)?
  - ¿Existe algún mecanismo de subida de imágenes?

---

## 3. Debilidades y riesgos detectables sin la respuesta de Horizon

Incluso antes de leer la respuesta completa, el contexto descrito permite anticipar estos riesgos:

### Riesgo 1 — Contenido hardcodeado
Si los textos e imágenes están fijos en el HTML/PHP, convertirlos a editables desde panel requiere:
- crear tablas en base de datos para almacenar ese contenido,
- modificar el frontend para leer desde base de datos en lugar de HTML fijo,
- crear los formularios del panel para hacer esos cambios.
**Impacto:** alto. Es el cambio estructural más grande.

### Riesgo 2 — Base de datos sin estructura para secciones dinámicas
Un panel que permita crear y eliminar secciones y subsecciones necesita una estructura de base de datos específica. Si la base de datos actual no la tiene, habrá que diseñarla y migrarla.
**Impacto:** alto. Definir mal esta estructura ahora puede forzar refactoring después.

### Riesgo 3 — Autenticación débil o inexistente
Si el login no existe o las credenciales están en código, el panel no es seguro.
**Impacto:** medio-alto. El panel debe estar protegido antes de cualquier otra funcionalidad.

### Riesgo 4 — Restricción de Horizon para crear archivos
Cada archivo nuevo requiere un prompt con créditos. Si el panel necesita muchos archivos nuevos, el costo en créditos aumenta.
**Impacto:** operativo. Hay que minimizar el número de archivos nuevos y maximizar el uso de los existentes.

### Riesgo 5 — Acoplamiento del frontend con contenido fijo
Si el HTML del sitio público mezcla estructura y contenido sin separación, refactorizarlo para que sea dinámico puede romper el diseño existente.
**Impacto:** medio. Requiere cuidado en cada cambio.

---

## 4. Lo que probablemente sí está funcionando

Basado en la descripción del proyecto antes del Prompt 1:

- ✅ El sitio informativo estático funciona y está publicado.
- ✅ El dominio real está activo (ya no es dominio temporal).
- ✅ Los efectos de portada están implementados.
- ✅ Existe un carrito básico (aunque no automático).
- ✅ Hay algún avance de panel, aunque incompleto.

---

## 5. Preguntas para el Prompt 2

Estas son las preguntas específicas que deben responderse antes de proponer cualquier plan de acción.
Están organizadas por área. No asumen nada que no esté confirmado.

### Tecnologías
1. ¿El sitio usa PHP puro o algún framework PHP? ¿Qué versión de PHP está configurada en el servidor?
2. ¿Usa algún framework CSS (Bootstrap, Tailwind, Bulma) o CSS escrito a mano?
3. ¿Hay jQuery u otra librería JavaScript incluida globalmente?

### Estructura de archivos
4. ¿Cuál es la lista exacta de archivos PHP y HTML en la raíz del proyecto?
5. ¿Existen subcarpetas? ¿Con qué nombres y qué contienen?
6. ¿Hay un archivo de configuración o conexión a base de datos? ¿Cómo se llama y dónde está?

### Base de datos
7. ¿Qué tablas existen actualmente en la base de datos? Lista exacta con nombres y campos.
8. ¿Los textos del sitio público están en base de datos o hardcodeados en el HTML/PHP?
9. ¿Las imágenes del sitio están referenciadas desde base de datos o sus rutas están fijas en el código?
10. ¿Existe una tabla de usuarios o credenciales de administrador?

### Autenticación
11. ¿Existe algún archivo de login? ¿Cómo se llama?
12. ¿Se usan sesiones PHP (`$_SESSION`)? ¿En qué archivos?
13. ¿Las rutas del panel están protegidas? ¿Qué pasa si alguien accede directo sin loguearse?

### Panel de administración
14. ¿Qué archivos del panel existen actualmente? Lista exacta.
15. ¿Qué vistas o formularios están construidos en el panel?
16. ¿Existe lógica de guardado en base de datos desde el panel (INSERT, UPDATE)?
17. ¿El panel tiene su propio CSS o usa el del sitio público?

### Gestión de contenido e imágenes
18. ¿Existe una carpeta de uploads o de imágenes administrables? ¿Con qué nombre y ruta?
19. ¿Existe alguna lógica de subida de archivos (`$_FILES`, `move_uploaded_file`)? ¿En qué archivo?
20. ¿Las secciones del sitio (inicio, servicios, proyectos, contacto) están en archivos separados o en uno solo?

### Secciones y subsecciones dinámicas
21. ¿Actualmente las secciones del sitio son fijas en el HTML o existe alguna estructura en base de datos para manejarlas?
22. ¿Existen subsecciones dentro de las secciones (por ejemplo, proyectos individuales dentro de la sección proyectos)?
23. ¿Cuántas secciones y subsecciones tiene el sitio actualmente?

---

## 6. Resumen ejecutivo

| Área | Estado estimado | Confianza |
|---|---|---|
| Tecnologías | PHP + MySQL + HTML/CSS/JS, probablemente sin framework | Media |
| Estructura de archivos | Sitio estático con algún PHP iniciado | Media |
| Base de datos | Existe pero estructura incierta | Baja |
| Autenticación | Básica o inexistente | Baja |
| Panel admin | Iniciado, incompleto | Media |
| Gestión de contenido | Hardcodeado en su mayoría | Media |
| Secciones dinámicas | No implementadas todavía | Alta |

**Conclusión:** No es posible proponer un plan de acción sólido hasta confirmar el estado real de la base de datos, la autenticación y los archivos del panel. Las preguntas del Prompt 2 deben responderse primero. El Prompt 2 debe enfocarse especialmente en el inventario exacto de archivos, la estructura de la base de datos y el estado del login.
