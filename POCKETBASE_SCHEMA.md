# MUYU Contratistas — Esquema de Base de Datos PocketBase

## Instrucciones de configuración

### Paso 1: Instalar y ejecutar PocketBase

```bash
# Descargar PocketBase desde https://pocketbase.io/docs/
./pocketbase serve
# Panel admin disponible en: http://127.0.0.1:8090/_/
```

### Paso 2: Crear el administrador

Acceder a `http://127.0.0.1:8090/_/` y crear tu cuenta de administrador.

### Paso 3: Crear las colecciones

Crear las siguientes colecciones en el panel de PocketBase:

---

## Colección: `sections`

| Campo        | Tipo     | Opciones                          |
|-------------|----------|-----------------------------------|
| title       | text     | required, min:1                   |
| slug        | text     | unique                            |
| content     | editor   |                                   |
| image       | file     | types: jpg, png, webp, gif, svg   |
| order       | number   | default: 0                        |
| visible     | bool     | default: true                     |

**Registros iniciales requeridos:**
- `title: "logotipo"` con el SVG del logo MUYU en el campo `image`
  - El SVG debe tener `viewBox="0 0 50.031101 46.320014"` (correcto)

---

## Colección: `subsections`

| Campo        | Tipo     | Opciones                          |
|-------------|----------|-----------------------------------|
| section     | relation | → sections, required              |
| title       | text     | required                          |
| content     | editor   |                                   |
| image       | file     | types: jpg, png, webp, gif        |
| order       | number   | default: 0                        |
| visible     | bool     | default: true                     |

---

## Colección: `services`

| Campo        | Tipo     | Opciones                          |
|-------------|----------|-----------------------------------|
| title       | text     | required                          |
| description | editor   |                                   |
| icon        | text     | (nombre de icono Lucide)          |
| image       | file     | types: jpg, png, webp             |
| order       | number   | default: 0                        |
| visible     | bool     | default: true                     |

---

## Colección: `projects`

| Campo        | Tipo     | Opciones                          |
|-------------|----------|-----------------------------------|
| title       | text     | required                          |
| description | editor   |                                   |
| client      | text     |                                   |
| location    | text     |                                   |
| year        | number   |                                   |
| category    | text     | (residencial, comercial, etc.)    |
| image       | file     | types: jpg, png, webp             |
| gallery     | file     | multiple, types: jpg, png, webp   |
| featured    | bool     | default: false                    |
| visible     | bool     | default: true                     |
| order       | number   | default: 0                        |

---

## Colección: `testimonials`

| Campo        | Tipo     | Opciones                          |
|-------------|----------|-----------------------------------|
| author      | text     | required                          |
| role        | text     |                                   |
| content     | editor   | required                          |
| avatar      | file     | types: jpg, png, webp             |
| rating      | number   | min: 1, max: 5, default: 5        |
| visible     | bool     | default: true                     |
| order       | number   | default: 0                        |

---

## Colección: `team_members`

| Campo    | Tipo   | Opciones                        |
|---------|--------|---------------------------------|
| name    | text   | required                        |
| role    | text   |                                 |
| bio     | editor |                                 |
| photo   | file   | types: jpg, png, webp, max: 5MB |
| email   | email  |                                 |
| linkedin | url   |                                 |
| order   | number | default: 0                      |
| visible | bool   | default: true                   |

**Permisos:** List/View: todos | Create/Update/Delete: solo admin

**Integración con `mefistofeles.jpg`:**
- Crear un registro inicial con `name = "Aldair"` (o el nombre del arquitecto).
- En el campo `photo`, subir el archivo `mefistofeles.jpg` (disponible en `apps/web/public/images/mefistofeles.jpg`).
- Una vez subido a PocketBase, el campo `photo` sustituye automáticamente a la imagen estática.
- La imagen estática `/images/mefistofeles.jpg` sirve como respaldo visual durante la configuración.

---

## Colección: `contact_info`

| Campo            | Tipo  | Opciones |
|-----------------|-------|----------|
| phone           | text  |          |
| whatsapp        | text  |          |
| email           | email |          |
| address         | text  |          |
| city            | text  |          |
| google_maps_url | url   |          |
| facebook        | url   |          |
| instagram       | url   |          |
| linkedin        | url   |          |
| schedule        | text  |          |

**Crear un solo registro** con la información de contacto de la empresa.

---

## Colección: `contact_messages`

| Campo    | Tipo   | Opciones           |
|---------|--------|--------------------|
| name    | text   | required           |
| email   | email  | required           |
| phone   | text   |                   |
| subject | text   |                   |
| message | editor | required           |
| read    | bool   | default: false     |

**Permisos:** Create: todos | List/View: solo admin | Delete: solo admin

---

## Paso 4: Configurar permisos de las colecciones

Para las colecciones de contenido (sections, subsections, services, projects, testimonials, contact_info):
- **List/View:** Todos (públicas)
- **Create/Update/Delete:** Solo admins

Para `contact_messages`:
- **Create:** Todos (para el formulario de contacto)
- **List/View/Delete:** Solo admins

---

## Paso 5: Reparar el logo MUYU

1. En PocketBase admin, ir a `sections`
2. Buscar el registro con `title = "logotipo"`
3. Si no existe, crearlo
4. Subir el archivo SVG del logo con `viewBox="0 0 50.031101 46.320014"`
5. El campo `title` debe ser exactamente `"logotipo"` (en minúsculas)

---

## Paso 6: Configurar variables de entorno

```bash
# En apps/web/
cp .env.example .env
# Editar .env con la URL correcta de PocketBase
```

---

## Paso 7: Integrar la imagen del arquitecto (mefistofeles.jpg)

La imagen `mefistofeles.jpg` es la fotografía de perfil del arquitecto principal.
Se encuentra en `apps/web/public/images/mefistofeles.jpg` y se sirve como recurso estático.

### Formato y ubicación
- **Ruta estática:** `apps/web/public/images/mefistofeles.jpg`
- **URL pública:** `/images/mefistofeles.jpg`
- **Formato recomendado:** JPEG, máximo 5 MB, dimensiones mínimas 400×400 px
- **Uso ideal:** imagen de avatar circular en la sección "Nuestro Equipo" de la página Nosotros

### Compatibilidad
| Uso              | Compatible | Notas                                     |
|-----------------|:----------:|-------------------------------------------|
| Avatar / perfil | ✅         | Formato cuadrado ideal para `border-radius: 50%` |
| Hero (banner)   | ⚠️         | Requiere imagen > 1200px de ancho         |
| Decorativo      | ✅         | Funciona como foto de equipo o subsección |

### Migrar a PocketBase (panel admin)

1. En el panel admin ir a `/admin/equipo`
2. Crear un nuevo integrante con los datos del arquitecto
3. En el campo "Foto de perfil", subir `mefistofeles.jpg`
4. PocketBase almacena la imagen y genera una URL dinámica
5. La página "Nosotros" mostrará automáticamente la foto desde PocketBase

### Riesgos y consideraciones
- **Tamaño:** Si la imagen supera 5 MB, el upload será rechazado por la validación (`imageUpload.js`)
- **Formato:** Solo se aceptan `jpg`, `png`, `webp` en la colección `team_members`
- **Compresión:** Comprimir a ≤ 200 KB con calidad 80 % antes de subir para mejor rendimiento
- **Alt text:** Siempre proporcionar texto alternativo descriptivo para accesibilidad
