# trabajo-aldair — Contexto del Proyecto MUYU Contratistas

> **Nota para el agente / Note to agent:** Este archivo es el documento de contexto del proyecto. Contiene todo lo que se ha analizado y discutido en sesiones anteriores, para que nunca se pierda el hilo de la conversación.

---

## 1. Resumen del Proyecto

**Nombre:** MUYU Contratistas  
**Tipo:** Sitio web corporativo con panel de administración  
**Stack:** React 18.2.0 + Vite + TailwindCSS + PocketBase + React Router 6  
**Estructura:** Monorepo (`apps/web` = frontend, `apps/api` = backend Express.js)  
**Estado general:** En desarrollo — funcionalidades básicas parciales, sin panel admin, sin autenticación

---

## 2. Tecnologías Usadas

| Categoría | Tecnología |
|-----------|-----------|
| Frontend | React 18.2.0, JSX, TailwindCSS 3.3.2, Framer Motion |
| Enrutamiento | React Router 6.16.0 |
| UI Components | shadcn/ui, Lucide React |
| Backend | PocketBase (BD + API), Express.js |
| Build | Vite, npm, monorepo |
| Lenguajes | JavaScript ES6+, JSX, HTML5, CSS3 |

---

## 3. Estructura del Proyecto

```
/
├── apps/
│   ├── web/                        ← Frontend React
│   │   └── src/
│   │       ├── components/
│   │       │   ├── MuyuLogoAnimated.jsx   ← Logo animado (PROBLEMÁTICO)
│   │       │   ├── MuyuLogoAnimation.jsx  ← Duplicado, NO USADO
│   │       │   ├── HeroBlock.jsx
│   │       │   ├── Header.jsx
│   │       │   ├── Footer.jsx
│   │       │   └── Navigation.jsx
│   │       ├── pages/
│   │       │   ├── Home.jsx
│   │       │   ├── About.jsx        ← Incompleta
│   │       │   ├── Services.jsx     ← Incompleta
│   │       │   ├── Projects.jsx     ← Incompleta
│   │       │   └── Contact.jsx      ← Sin funcionalidad
│   │       ├── layouts/
│   │       │   └── MainLayout.jsx
│   │       ├── lib/
│   │       │   └── pocketbaseClient.js
│   │       ├── App.jsx
│   │       └── main.jsx
│   └── api/                         ← Backend Express.js
│       ├── routes/
│       ├── controllers/
│       ├── pb_hooks/
│       └── server.js
├── packages/                        ← Paquetes compartidos
├── package.json
├── vite.config.js
└── .env
```

---

## 4. Estado Actual — Qué Funciona y Qué Falta

### ✅ Completado
- Estructura base de React (monorepo, Vite)
- Enrutamiento con React Router
- Estilos con TailwindCSS
- Componentes básicos: Header, Footer, HeroBlock
- Conexión a PocketBase (`pocketbaseClient.js`)
- Página Home (parcialmente funcional)

### ⚠️ Incompleto
- Logo MUYU animado (SVG vacío desde PocketBase)
- Página About (estructura sin contenido)
- Página Services (estructura sin contenido)
- Página Projects (estructura sin contenido)
- Página Contact (formulario existe pero sin backend)

### ❌ No Existe
- Panel de administración (`/admin/*`)
- Sistema de autenticación/login
- Protección de rutas
- CRUD de contenido
- Gestión de imágenes
- Migración de datos hardcodeados a PocketBase

---

## 5. Problema Crítico: Logo MUYU

- **Componente:** `apps/web/src/components/MuyuLogoAnimated.jsx`
- **Método:** Fetch SVG desde PocketBase + `dangerouslySetInnerHTML`
- **Portal:** Usa `createPortal` hacia `#logo-portal-root` (debe existir en `index.html`)
- **Query PocketBase:** `getFirstListItem("title='logotipo'")`
- **Archivo en BD:** `muyu_logo_final_2024_m02wp8m0eb.svg`
- **Problema:** SVG tiene `viewBox="0 0 93.011101 46.320014"` (incorrecto); esperado: `viewBox="0 0 50.031101 46.320014"`
- **Solución:** Reemplazar el archivo SVG en PocketBase con la versión correcta
- **Nota:** `MuyuLogoAnimation.jsx` es un duplicado no usado — considerar eliminar

---

## 6. Base de Datos (PocketBase)

### Colecciones detectadas

| Colección | Campos | Uso |
|-----------|--------|-----|
| `sections` | `title`, `image`, `content` | Logo, secciones del sitio |

### Datos dinámicos vs hardcodeados

- **Dinámico (PocketBase):** Logo MUYU (SVG en `sections`)
- **Hardcodeado (código):** Textos de navegación, servicios, proyectos, testimonios, información de contacto, imágenes del hero

---

## 7. Comandos de Desarrollo

```bash
# Instalar dependencias
cd apps/web && npm install

# Servidor de desarrollo
cd apps/web && npm run dev

# Build de producción
cd apps/web && npm run build
```

> PocketBase debe estar corriendo en `VITE_PB_URL` (default: `http://127.0.0.1:8090`)

---

## 8. Plan de Implementación Pendiente

### FASE 1 — Crítico (inmediato)
- [ ] Corregir archivo SVG del logo en PocketBase (`viewBox` incorrecto)
- [ ] Verificar que `#logo-portal-root` existe en `index.html`
- [ ] Eliminar componente duplicado `MuyuLogoAnimation.jsx`

### FASE 2 — Corto plazo
- [ ] Completar páginas: `About.jsx`, `Services.jsx`, `Projects.jsx`, `Contact.jsx`
- [ ] Implementar formulario de contacto con envío a PocketBase
- [ ] Migrar datos hardcodeados (servicios, proyectos, testimonios) a PocketBase

### FASE 3 — Panel de Administración

**Autenticación (a crear):**
- `apps/web/src/lib/authClient.js` — lógica de auth con PocketBase
- `apps/web/src/hooks/useAuth.js` — hook personalizado de autenticación
- `apps/web/src/components/admin/ProtectedRoute.jsx` — protección de rutas

**Páginas admin (a crear):**
- `apps/web/src/pages/admin/AdminLogin.jsx`
- `apps/web/src/pages/admin/AdminDashboard.jsx`
- `apps/web/src/pages/admin/AdminServices.jsx`
- `apps/web/src/pages/admin/AdminProjects.jsx`
- `apps/web/src/pages/admin/AdminTestimonials.jsx`
- `apps/web/src/pages/admin/AdminContact.jsx`
- `apps/web/src/pages/admin/AdminSections.jsx`
- `apps/web/src/pages/admin/AdminSubsections.jsx`

**Componentes admin (a crear):**
- `apps/web/src/components/admin/AdminLayout.jsx`
- `apps/web/src/components/admin/AdminHeader.jsx`
- `apps/web/src/components/admin/AdminSidebar.jsx`
- `apps/web/src/components/admin/AdminForm.jsx`
- `apps/web/src/components/admin/AdminTable.jsx`
- `apps/web/src/components/admin/ImageUpload.jsx`
- `apps/web/src/components/admin/FormField.jsx`

**APIs / lib (a crear):**
- `apps/web/src/lib/api/servicesApi.js`
- `apps/web/src/lib/api/projectsApi.js`
- `apps/web/src/lib/api/testimonialsApi.js`
- `apps/web/src/lib/api/contactApi.js`
- `apps/web/src/lib/api/sectionsApi.js`
- `apps/web/src/lib/imageUpload.js`

**Archivos existentes a editar:**
- `apps/web/src/App.jsx` — agregar rutas admin protegidas
- `apps/web/src/pages/Home.jsx` — reemplazar arrays por fetch de PocketBase
- `apps/web/src/components/HeroBlock.jsx` — hacer imagen dinámica
- `apps/web/src/components/Footer.jsx` — información de contacto desde BD

---

## 9. Archivos de Análisis de Sesiones Anteriores

| Archivo | Contenido |
|---------|-----------|
| `promt1.txt` | Análisis técnico completo (estructura, estado, problemas, conclusiones) |
| `promt2.txt` | Análisis de contenidos editables y panel admin |
| `promt3.txt` | Inventario técnico final: archivos a crear/editar para panel admin completo |

---

*Este documento fue generado como resumen de contexto para continuidad entre sesiones del agente.*
