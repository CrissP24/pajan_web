import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import PublicNavbar from './components/PublicNavbar';
import AccessibilityPanel from './components/AccessibilityPanel';
import LanguageSelector from './components/LanguageSelector';
import Section from './pages/Section';
import Login from './pages/Login';
import { initTranslations } from './utils/translations';
import Home from './pages/Home';
import AdminDashboard from './components/dashboards/AdminDashboard';
import ParticipacionDashboard from './components/dashboards/ParticipacionDashboard';
import TicDashboard from './components/dashboards/TicDashboard';
import ComunicacionDashboard from './components/dashboards/ComunicacionDashboard';
import TransparenciaDashboard from './components/dashboards/TransparenciaDashboard';
import DocumentManagement from './pages/DocumentManagement';
import TestPage from './pages/TestPage';
import { useAuth } from './contexts/AuthContext';

// Importar las páginas existentes
import MisionVision from './pages/MisionVision';
import Historia from './pages/Historia';
import Organigrama from './pages/Organigrama';
import Presupuesto from './pages/Presupuesto';
import Buzon from './pages/Buzon';
import DireccionMapa from './pages/DireccionMapa';
import Autoridades from './pages/Autoridades';
import Servicios from './pages/Servicios';
import Tarifas from './pages/Tarifas';
import ParticipacionCiudadana from './pages/ParticipacionCiudadana';
import EntregaGas from './pages/EntregaGas';
import PuntosVenta from './pages/PuntosVenta';
import TiposCilindros from './pages/TiposCilindros';
import Horarios from './pages/Horarios';
import PreciosGas from './pages/PreciosGas';
import PromocionesSubsidios from './pages/PromocionesSubsidios';
import ConveniosContratos from './pages/ConveniosContratos';
import InformesGestion from './pages/InformesGestion';
import Reglamentos from './pages/Reglamentos';
import Encuestas from './pages/Encuestas';
import CanalesAtencion from './pages/CanalesAtencion';
import Comunicados from './pages/Comunicados';
import Actividades from './pages/Actividades';
import Campanas from './pages/Campanas';
import TelefonosCorreos from './pages/TelefonosCorreos';
import RedesSociales from './pages/RedesSociales';
import Tramites from './pages/Tramites';
import Noticias from './pages/Noticias';
import NoticiasComunicados from './pages/NoticiasComunicados';
import RendicionCuentas from './pages/RendicionCuentas';
import Transparencia from './pages/Transparencia';
import PresidentesBarriales from './components/PresidentesBarriales';

// Componente para ver documentos públicos
const DocumentViewer = () => {
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { slug } = useParams();

  useEffect(() => {
    const loadDocument = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/documents/public/slug/${slug}`);
        if (response.ok) {
          const data = await response.json();
          setDocument(data);
        } else {
          setError('Documento no encontrado');
        }
      } catch (err) {
        setError('Error al cargar el documento');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadDocument();
    }
  }, [slug]);

  if (loading) return <div className="text-center p-5">Cargando...</div>;
  if (error) return <div className="text-center p-5 text-danger">{error}</div>;
  if (!document) return <div className="text-center p-5">Documento no encontrado</div>;

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-8 mx-auto">
          <h1>{document.title}</h1>
          <div className="mb-3">
            <small className="text-muted">
              Publicado el {new Date(document.publishedAt || document.createdAt).toLocaleDateString()}
            </small>
          </div>
          <div dangerouslySetInnerHTML={{ __html: document.content }} />
          
          {document.attachments && document.attachments.length > 0 && (
            <div className="mt-4">
              <h5>Archivos adjuntos</h5>
              <ul className="list-unstyled">
                {document.attachments.map((attachment) => (
                  <li key={attachment.id} className="mb-2">
                    <a 
                      href={`http://localhost:8080${attachment.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-primary btn-sm"
                    >
                      {attachment.originalName}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Wrapper para usar useLocation en App
function AppWrapper() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard") || 
                     location.pathname.startsWith("/admin-dashboard") ||
                     location.pathname.startsWith("/document-management") ||
                     location.pathname.startsWith("/tic-dashboard") ||
                     location.pathname.startsWith("/comunicacion-dashboard") ||
                     location.pathname.startsWith("/transparencia-dashboard");

  useEffect(() => {
    // Inicializar sistema de traducciones
    initTranslations();
  }, []);

  if (loading) {
    return (
      <div className="container-fluid d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3">Cargando aplicación...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mostrar barra solo si no estás en el dashboard */}
      {!isDashboard && <PublicNavbar />}
      
      {/* Panel de accesibilidad - siempre visible */}
      <AccessibilityPanel />
      
      {/* Selector de idioma - siempre visible */}
      <LanguageSelector />

      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/inicio" element={<Home />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/seccion/:name" element={<Section />} />
        <Route path="/login" element={<Login />} />

        {/* Rutas específicas para las páginas existentes */}
        <Route path="/seccion/mision-vision" element={<MisionVision />} />
        <Route path="/seccion/historia" element={<Historia />} />
        <Route path="/seccion/organigrama" element={<Organigrama />} />
        <Route path="/seccion/presupuesto" element={<Presupuesto />} />
        <Route path="/seccion/buzon" element={<Buzon />} />
        <Route path="/seccion/direccion-mapa" element={<DireccionMapa />} />
        <Route path="/seccion/autoridades" element={<Autoridades />} />
        <Route path="/seccion/servicios" element={<Servicios />} />
        <Route path="/seccion/tarifas" element={<Tarifas />} />
        <Route path="/seccion/participacion-ciudadana" element={<ParticipacionCiudadana />} />
        <Route path="/seccion/entrega-gas" element={<EntregaGas />} />
        <Route path="/seccion/puntos-venta" element={<PuntosVenta />} />
        <Route path="/seccion/tipos-cilindros" element={<TiposCilindros />} />
        <Route path="/seccion/horarios" element={<Horarios />} />
        <Route path="/seccion/precios-gas" element={<PreciosGas />} />
        <Route path="/seccion/promociones-subsidios" element={<PromocionesSubsidios />} />
        <Route path="/seccion/convenios-contratos" element={<ConveniosContratos />} />
        <Route path="/seccion/informes-gestion" element={<InformesGestion />} />
        <Route path="/seccion/reglamentos" element={<Reglamentos />} />
        <Route path="/seccion/encuestas" element={<Encuestas />} />
        <Route path="/seccion/canales-atencion" element={<CanalesAtencion />} />
        <Route path="/seccion/comunicados" element={<Comunicados />} />
        <Route path="/seccion/actividades" element={<Actividades />} />
        <Route path="/seccion/campanas" element={<Campanas />} />
        <Route path="/seccion/telefonos-correos" element={<TelefonosCorreos />} />
        <Route path="/seccion/redes-sociales" element={<RedesSociales />} />
        <Route path="/seccion/tramites" element={<Tramites />} />
        <Route path="/seccion/noticias" element={<Noticias />} />
        <Route path="/seccion/noticias-comunicados" element={<NoticiasComunicados />} />
        <Route path="/seccion/rendicion-cuentas" element={<RendicionCuentas />} />
        <Route path="/seccion/transparencia" element={<Transparencia />} />

        {/* Rutas protegidas para dashboards */}
        <Route
          path="/admin-dashboard"
          element={
            user?.roles?.includes("Superadministrador") ? (
              <AdminDashboard user={user} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/document-management"
          element={
            user ? (
              <DocumentManagement user={user} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/tic-dashboard"
          element={
            user?.roles?.includes("TIC") || user?.roles?.includes("Superadministrador") ? (
              <TicDashboard user={user} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/comunicacion-dashboard"
          element={
            user?.roles?.includes("Comunicación") || user?.roles?.includes("Superadministrador") ? (
              <ComunicacionDashboard user={user} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/transparencia-dashboard"
          element={
            user?.roles?.includes("Transparencia") || user?.roles?.includes("Superadministrador") ? (
              <TransparenciaDashboard user={user} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/dashboard"
          element={
            (() => {
              if (!user) return <Navigate to="/login" replace />;

              // Determinar el dashboard basado en los roles del usuario
              if (user.roles && user.roles.includes("Superadministrador")) {
                return <AdminDashboard user={user} />;
              }
              if (user.roles && user.roles.includes("TIC")) {
                return <TicDashboard user={user} />;
              }
              if (user.roles && user.roles.includes("Participación Ciudadana")) {
                return <ParticipacionDashboard user={user} />;
              }
              if (user.roles && user.roles.includes("Comunicación")) {
                return <ComunicacionDashboard user={user} />;
              }
              if (user.roles && user.roles.includes("Transparencia")) {
                return <TransparenciaDashboard user={user} />;
              }
              
              // Si no tiene roles válidos, redirigir al login
              return <Navigate to="/login" replace />;
            })()
          }
        />

        {/* Ruta para presidentes barriales */}
        <Route
          path="/presidentes-barriales"
          element={
            user?.roles?.includes("Superadministrador") || user?.roles?.includes("TIC") ? (
              <PresidentesBarriales />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Ruta para ver documentos públicos */}
        <Route path="/document/:slug" element={<DocumentViewer />} />
      </Routes>
    </>
  );
}

// Main wrapper con router
function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
