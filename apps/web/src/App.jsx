import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// Layouts
import MainLayout from './layouts/MainLayout.jsx'
import AdminLayout from './layouts/AdminLayout.jsx'

// Componente de ruta protegida
import ProtectedRoute from './components/ProtectedRoute.jsx'

// Páginas públicas
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Services from './pages/Services.jsx'
import Projects from './pages/Projects.jsx'
import Contact from './pages/Contact.jsx'

// Páginas admin
import AdminLogin from './pages/admin/AdminLogin.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import SectionsAdmin from './pages/admin/SectionsAdmin.jsx'
import SubsectionsAdmin from './pages/admin/SubsectionsAdmin.jsx'
import ServicesAdmin from './pages/admin/ServicesAdmin.jsx'
import ProjectsAdmin from './pages/admin/ProjectsAdmin.jsx'
import TestimonialsAdmin from './pages/admin/TestimonialsAdmin.jsx'
import ContactAdmin from './pages/admin/ContactAdmin.jsx'

/**
 * App.jsx
 * Componente raíz de la aplicación MUYU Contratistas.
 * Define todas las rutas públicas y del panel de administración.
 *
 * Rutas públicas:
 *   /             → Inicio
 *   /nosotros     → Nosotros
 *   /servicios    → Servicios
 *   /proyectos    → Proyectos
 *   /contacto     → Contacto
 *
 * Rutas admin (protegidas):
 *   /admin/login       → Inicio de sesión
 *   /admin             → Dashboard
 *   /admin/secciones   → CRUD Secciones
 *   /admin/subsecciones → CRUD Subsecciones
 *   /admin/servicios   → CRUD Servicios
 *   /admin/proyectos   → CRUD Proyectos
 *   /admin/testimonios → CRUD Testimonios
 *   /admin/contacto    → Info de contacto y mensajes
 */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ======================== */}
        {/* Rutas públicas           */}
        {/* ======================== */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/nosotros" element={<About />} />
          <Route path="/servicios" element={<Services />} />
          <Route path="/proyectos" element={<Projects />} />
          <Route path="/contacto" element={<Contact />} />
        </Route>

        {/* ======================== */}
        {/* Login admin (no protegida) */}
        {/* ======================== */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* ======================== */}
        {/* Rutas admin protegidas   */}
        {/* ======================== */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="secciones" element={<SectionsAdmin />} />
          <Route path="subsecciones" element={<SubsectionsAdmin />} />
          <Route path="servicios" element={<ServicesAdmin />} />
          <Route path="proyectos" element={<ProjectsAdmin />} />
          <Route path="testimonios" element={<TestimonialsAdmin />} />
          <Route path="contacto" element={<ContactAdmin />} />
        </Route>

        {/* Ruta 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
