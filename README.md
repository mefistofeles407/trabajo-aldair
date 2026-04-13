# MUYU Contratistas — Plataforma Web + Panel Admin

Sitio web informativo de **MUYU Contratistas** con panel de administración para gestionar contenido dinámico.

## Tecnologías

| Área | Tecnología |
|------|-----------|
| Frontend | React 18 + Vite + TailwindCSS |
| Enrutamiento | React Router 6 |
| Animaciones | Framer Motion |
| Base de datos / Backend | PocketBase |
| Iconos | Lucide React |
| Estructura | Monorepo (`apps/web`) |

---

## Requisitos previos

- Node.js ≥ 18
- PocketBase ([descargar aquí](https://pocketbase.io/docs/))

---

## Instalación

```bash
# 1. Instalar dependencias
cd apps/web
npm install

# 2. Copiar variables de entorno
cp .env.example .env
# Editar .env con la URL de tu instancia de PocketBase

# 3. Ejecutar PocketBase
./pocketbase serve
# Panel admin en: http://127.0.0.1:8090/_/

# 4. Configurar la base de datos
# Ver instrucciones en POCKETBASE_SCHEMA.md

# 5. Iniciar el servidor de desarrollo
npm run dev
```

---

## Estructura del proyecto

```
apps/web/src/
├── lib/
│   ├── pocketbaseClient.js     # Cliente PocketBase
│   └── authClient.js           # Funciones de autenticación
├── hooks/
│   └── useAuth.js              # Hook de autenticación
├── api/
│   ├── sectionsApi.js          # CRUD Secciones
│   ├── subsectionsApi.js       # CRUD Subsecciones
│   ├── servicesApi.js          # CRUD Servicios
│   ├── projectsApi.js          # CRUD Proyectos
│   ├── testimonialsApi.js      # CRUD Testimonios
│   └── contactApi.js           # CRUD Contacto / Mensajes
├── components/
│   ├── MuyuLogoAnimated.jsx    # Logo desde PocketBase
│   ├── HeroBlock.jsx           # Sección hero
│   ├── Header.jsx              # Encabezado responsive
│   ├── Footer.jsx              # Pie de página dinámico
│   ├── ImageUpload.jsx         # Componente subida de imágenes
│   └── ProtectedRoute.jsx      # Protección de rutas admin
├── layouts/
│   ├── MainLayout.jsx          # Layout público
│   └── AdminLayout.jsx         # Layout del panel admin
├── pages/
│   ├── Home.jsx                # Página de inicio (dinámica)
│   ├── About.jsx               # Nosotros (dinámica)
│   ├── Services.jsx            # Servicios (dinámica)
│   ├── Projects.jsx            # Proyectos con filtros (dinámica)
│   ├── Contact.jsx             # Contacto + formulario funcional
│   └── admin/
│       ├── AdminLogin.jsx      # Inicio de sesión
│       ├── AdminDashboard.jsx  # Dashboard con estadísticas
│       ├── SectionsAdmin.jsx   # CRUD Secciones
│       ├── SubsectionsAdmin.jsx# CRUD Subsecciones
│       ├── ServicesAdmin.jsx   # CRUD Servicios
│       ├── ProjectsAdmin.jsx   # CRUD Proyectos
│       ├── TestimonialsAdmin.jsx # CRUD Testimonios
│       └── ContactAdmin.jsx    # Info contacto + mensajes
└── utils/
    └── imageUpload.js          # Utilidades de subida de imágenes
```

---

## Rutas

### Sitio público
| Ruta | Página |
|------|--------|
| `/` | Inicio |
| `/nosotros` | Nosotros |
| `/servicios` | Servicios |
| `/proyectos` | Proyectos |
| `/contacto` | Contacto |

### Panel admin (protegido)
| Ruta | Función |
|------|---------|
| `/admin/login` | Inicio de sesión |
| `/admin` | Dashboard |
| `/admin/secciones` | Gestión de secciones |
| `/admin/subsecciones` | Gestión de subsecciones |
| `/admin/servicios` | Gestión de servicios |
| `/admin/proyectos` | Gestión de proyectos |
| `/admin/testimonios` | Gestión de testimonios |
| `/admin/contacto` | Info de contacto y mensajes |

---

## Configuración de PocketBase

Ver el archivo [`POCKETBASE_SCHEMA.md`](./POCKETBASE_SCHEMA.md) para instrucciones completas de:

- Creación de colecciones
- Configuración de permisos
- Reparación del logo MUYU (Paso 1 crítico)
- Variables de entorno

---

## Scripts disponibles

```bash
# Desde apps/web/
npm run dev       # Servidor de desarrollo
npm run build     # Build de producción
npm run preview   # Previsualizar build
npm run lint      # Verificar código
```

---

## Plan de acción implementado

- ✅ **Paso 1:** Documentación para reparar logo MUYU en PocketBase
- ✅ **Paso 2:** Esquema de todas las colecciones (sections, subsections, services, projects, testimonials, contact_info, contact_messages)
- ✅ **Paso 3:** Autenticación básica (`authClient.js`, `useAuth.js`, `AdminLogin.jsx`, `ProtectedRoute.jsx`)
- ✅ **Paso 4:** Panel admin (`AdminLayout.jsx`, sidebar, header, rutas, `AdminDashboard.jsx`)
- ✅ **Paso 5:** Módulos de conexión a BD (`sectionsApi.js`, `subsectionsApi.js`, `servicesApi.js`, `projectsApi.js`, `testimonialsApi.js`, `contactApi.js`)
- ✅ **Paso 6:** Formularios CRUD completos + subida/eliminación de imágenes (`imageUpload.js`, `ImageUpload.jsx`)
- ✅ **Paso 7:** Frontend dinámico (`Home.jsx`, `Services.jsx`, `Projects.jsx`, `Footer.jsx`, `Contact.jsx`, `Header.jsx`, `HeroBlock.jsx`)
- ✅ **Paso 8:** Build exitoso, validación completada
