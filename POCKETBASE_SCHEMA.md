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
