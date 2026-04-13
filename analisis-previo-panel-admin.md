# Análisis previo al plan de acción — Panel de Administrador

> **Propósito de este documento:**
> Recopilar y resumir los puntos críticos detectados en el informe del segundo prompt sobre el contenido editable, el estado real del panel de administración, el modelo de datos en PocketBase y las necesidades para dinamizar el sitio. También se registran todas las dudas pendientes y limitaciones del sistema que deben resolverse **antes** de ejecutar cualquier plan de acción.
> Este documento **no propone soluciones ni escribe código.**

---

## 1. Puntos críticos sobre el contenido editable

### 1.1 Contenidos que deberían ser editables

A partir del informe del segundo prompt se identificó que el sitio tiene, al menos, los siguientes bloques con contenido que debería poder modificarse desde el panel:

| Bloque / Sección | Tipo de contenido | Observación |
| --- | --- | --- |
| Portada / Hero | Título principal, subtítulo, imagen de fondo | Alta prioridad para el cliente |
| Sección Nosotros | Texto descriptivo del arquitecto, imagen de perfil | Texto e imagen |
| Sección Servicios | Tarjetas con título, descripción e ícono/imagen | Cantidad de tarjetas variable |
| Sección Proyectos | Galería con nombre, descripción e imagen de cada proyecto | Requiere creación y eliminación dinámica |
| Sección Contacto | Dirección, teléfono, correo, formulario o mapa | Solo textos, posiblemente hardcoded |
| Subsecciones internas | Bloques secundarios dentro de cada sección principal | Cantidad indeterminada |

### 1.2 Dónde está almacenado actualmente cada contenido

- **Contenido hardcodeado en archivos estáticos (HTML/JSX):** la mayor parte del texto e imágenes están escritos directamente en el código del frontend. Esto significa que cada cambio requiere editar el archivo fuente.
- **Imágenes:** referenciadas con rutas locales o URLs estáticas dentro del código. No existe aún una lógica de carga o reemplazo desde interfaz.
- **Base de datos (PocketBase):** se tiene confirmación de que PocketBase está presente en el proyecto, pero **no está claro si ya se usa para almacenar contenido del sitio o solo para autenticación.**

### 1.3 Estado de las imágenes

- Las imágenes del sitio están en carpetas del proyecto (rutas exactas no confirmadas aún).
- No se detectó lógica de subida (upload) de imágenes desde panel.
- No se sabe si PocketBase ya tiene configurado un campo de tipo `file` en alguna colección para manejar imágenes.
- Las imágenes del Hero, galería de proyectos y perfil del arquitecto son las de mayor prioridad para ser administrables.

---

## 2. Estado real del panel de administración

### 2.1 Lo que existe o podría existir

Según el informe del segundo prompt, existe un avance parcial del panel. Sin embargo, **el estado exacto de cada parte no está verificado al 100 %**:

| Componente | Estado estimado | Observación |
| --- | --- | --- |
| Formulario de login | Parcial o existe | No confirmado si conecta con PocketBase correctamente |
| Control de sesión | Incierto | No se sabe si usa el SDK de PocketBase o implementación propia |
| Dashboard / pantalla principal del panel | Parcial o incompleto | No se sabe qué opciones tiene |
| Formularios para editar texto | Incierto | Podrían no existir |
| Formularios para editar imágenes | Probablemente no existe | No hay lógica de upload confirmada |
| Crear secciones nuevas | No existe | Requiere modelo de datos dinámico |
| Eliminar secciones | No existe | Requiere modelo de datos dinámico |
| Crear subsecciones | No existe | Igual que secciones |
| Eliminar subsecciones | No existe | Igual que secciones |
| Guardar cambios en base de datos | Incierto | Depende de si el panel ya tiene integración con PocketBase |
| Reflejar cambios en el sitio público | No existe | El frontend aún lee contenido hardcodeado |

### 2.2 Problema estructural detectado

El frontend público actualmente **no lee contenido desde PocketBase**. Para que el panel de administración sea útil, habrá que modificar el frontend para que, en lugar de mostrar texto e imágenes fijos, consulte PocketBase y muestre lo que esté guardado en la base de datos. Esto implica intervenir en los archivos del sitio público, no solo en el panel.

---

## 3. Modelo de datos en PocketBase

### 3.1 Lo que se sabe con certeza

- PocketBase está presente en el proyecto (confirmado por el contexto del segundo prompt).
- Existe al menos un usuario administrador (admin único).

### 3.2 Lo que NO está confirmado y es crítico

- **¿Qué colecciones existen actualmente en PocketBase?**
  No se conoce el listado de colecciones (equivalente a tablas). Solo se puede inferir que probablemente existe una colección para usuarios.

- **¿Ya existe alguna colección para contenido del sitio?**
  No confirmado. Es posible que no exista ninguna colección de contenido todavía.

- **¿Los campos exactos de cada colección?**
  Sin confirmar. Por ejemplo, si existe una colección `servicios`, se desconoce si tiene campos como `titulo`, `descripcion`, `imagen`, `orden`, `activo`, etc.

- **¿PocketBase ya tiene configurados campos de tipo `file` para imágenes?**
  Sin confirmar.

- **¿Hay colecciones para secciones y subsecciones?**
  Probablemente no existen. Crear secciones y subsecciones dinámicas requiere un modelo relacional que permita estructuras jerárquicas.

- **¿Existe una colección genérica de contenido o colecciones específicas por sección?**
  No confirmado. Esto afecta directamente el diseño del panel.

### 3.3 Lo que el modelo de datos necesitará para dinamizar el sitio

Para que el sitio pueda ser administrado desde panel, el modelo de datos en PocketBase deberá soportar como mínimo:

- Gestión del usuario administrador único (autenticación).
- Textos editables por sección.
- Imágenes editables (con soporte de archivos en PocketBase).
- Secciones principales creables y eliminables dinámicamente.
- Subsecciones con relación a su sección padre.
- Posiblemente un campo de orden o posición para renderizar en el frontend.

---

## 4. Necesidades para dinamizar el sitio

El sitio actual es **estático o mayormente estático**. Para que el panel de administración tenga efecto real, se necesita:

1. **Migrar el contenido hardcodeado a PocketBase:** textos, títulos, descripciones e imágenes deben guardarse en colecciones de PocketBase.
2. **Modificar el frontend para leer desde PocketBase:** los archivos React/HTML del sitio público deben hacer consultas a PocketBase en lugar de mostrar valores fijos.
3. **Implementar el panel de administración:** formularios para editar contenido, subir imágenes, crear/eliminar secciones y subsecciones, y guardar cambios.
4. **Proteger el panel:** solo el admin debe acceder; la sesión debe gestionarse correctamente con PocketBase.

---

## 5. Dudas pendientes y limitaciones del sistema (lista concreta)

Las siguientes son las dudas y limitaciones que **deben resolverse antes de ejecutar cualquier plan de acción**:

### 5.1 Dudas sobre PocketBase

1. ¿Qué colecciones existen actualmente en PocketBase y cuáles son sus nombres exactos?
2. ¿Cuáles son los campos exactos de cada colección (nombre, tipo, obligatorio/opcional, valor por defecto)?
3. ¿Existe alguna colección relacionada con el contenido del sitio (no solo con usuarios)?
4. ¿Ya hay campos de tipo `file` configurados para imágenes?
5. ¿Se usa el SDK de JavaScript de PocketBase en el frontend o se hacen llamadas directas a la API REST?
6. ¿Existe alguna restricción de acceso (reglas de API en PocketBase) que limite quién puede leer o escribir en las colecciones?
7. ¿El PocketBase del proyecto está en el mismo servidor que el sitio (Hostinger) o en otro servicio?
8. ¿Hay algún límite de tamaño para los archivos subidos en PocketBase en este entorno de Hostinger?

### 5.2 Dudas sobre el panel de administración actual

9. ¿Qué archivos exactos conforman el panel de administración ya empezado?
10. ¿El login ya conecta con PocketBase o solo es un formulario sin lógica funcional?
11. ¿Existe manejo de tokens o cookies de sesión con PocketBase?
12. ¿El panel actual tiene alguna ruta protegida o cualquier usuario puede acceder a la URL del panel?
13. ¿Qué pantallas o vistas ya existen en el panel (dashboard, editores, etc.)?

### 5.3 Dudas sobre el frontend público

14. ¿El sitio usa React, HTML puro, o una combinación?
15. ¿Los archivos del frontend que muestran secciones ya tienen alguna estructura preparada para leer datos dinámicos, o todo está completamente hardcodeado?
16. ¿Hay lógica de renderizado condicional de secciones o siempre se muestran las mismas secciones fijas?
17. ¿Existen archivos duplicados con el mismo contenido en distintos lugares del proyecto?

### 5.4 Dudas sobre el entorno Hostinger Horizon

18. ¿Qué restricciones de edición impone Horizon sobre archivos React o de configuración?
19. ¿Horizon permite instalar o actualizar dependencias como el SDK de PocketBase si no está instalado?
20. ¿Cuáles son exactamente los archivos que se pueden editar y cuáles no (por restricciones de la plataforma)?
21. ¿Horizon tiene alguna limitación con rutas protegidas, variables de entorno o archivos `.env`?
22. ¿Existen requisitos adicionales de seguridad o acceso en Horizon que deban considerarse para el panel?

### 5.5 Dudas sobre la lógica de secciones y subsecciones

23. ¿Qué nivel de anidación tienen las subsecciones? ¿Solo un nivel (sección → subsección) o puede haber más niveles?
24. ¿Existe lógica para evitar la duplicación de secciones con el mismo nombre?
25. ¿Las secciones y subsecciones tienen un orden definido por el admin o es automático?
26. ¿Se pueden ocultar secciones sin eliminarlas, o la única opción es eliminar?
27. ¿Existen restricciones de edición: por ejemplo, la sección de contacto siempre debe existir y no puede eliminarse?

---

## 6. Obstáculos técnicos identificados

Los siguientes obstáculos técnicos son los más relevantes y deberán tenerse en cuenta en el plan de acción:

| # | Obstáculo | Impacto |
| --- | --- | --- |
| 1 | El frontend es estático y no lee datos de PocketBase | Alto — requiere reescribir o modificar todos los componentes de sección |
| 2 | No se conocen las colecciones reales de PocketBase | Alto — sin esto no se puede definir el modelo de datos |
| 3 | No hay lógica de subida de imágenes | Alto — la edición de imágenes es un requisito del cliente |
| 4 | Horizon limita la creación y eliminación de archivos | Medio — obliga a trabajar dentro de los archivos existentes |
| 5 | El panel de administración existe parcialmente sin completar | Medio — riesgo de conflictos o reescritura parcial |
| 6 | No está confirmada la protección de rutas del panel | Medio — riesgo de seguridad si cualquiera puede acceder |
| 7 | Lógica de secciones dinámicas requiere modelo relacional | Alto — es la parte más compleja del proyecto |
| 8 | Posible acoplamiento excesivo entre secciones y archivos del frontend | Medio — romper el hardcoding sin romper el sitio actual |
| 9 | Créditos limitados en Horizon para crear archivos nuevos | Bajo-Medio — requiere planificación cuidadosa antes de ejecutar |

---

## 7. Lo que se necesita del Prompt 3 para un inventario de intervención preciso

El tercer prompt debe responder con exactitud los siguientes puntos para poder armar un plan de acción sin suposiciones:

1. **Lista exacta de archivos existentes** separados por categoría: autenticación, panel admin, frontend público, imágenes, estilos, scripts, configuración.
2. **Lista de colecciones reales de PocketBase** con sus campos exactos (nombre, tipo, restricciones).
3. **Reglas de acceso configuradas en PocketBase** para cada colección.
4. **Estado de cada área del proyecto** clasificado como: ya existe / existe parcialmente / no existe.
5. **Lista de archivos nuevos que serían necesarios** si el sistema actual no los tiene, con justificación.
6. **Obstáculos concretos verificados** en el código real, no estimados.
7. **Confirmación del tipo de proyecto:** si es React puro, React + PocketBase, si hay archivos PHP mezclados, etc.
8. **Confirmación de qué restricciones impone Horizon** sobre la edición, creación y eliminación de archivos.

---

> **Conclusión:**
> Antes de ejecutar cualquier plan de acción es indispensable resolver las 27 dudas listadas en la sección 5 y superar los 9 obstáculos técnicos de la sección 6. El Prompt 3 es la fuente de información que permitirá transformar este análisis preliminar en un inventario de intervención preciso y accionable. Sin esa información verificada, cualquier plan de acción correría el riesgo de basarse en suposiciones incorrectas.
