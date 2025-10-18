import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Menu as MenuIcon, X as CloseIcon, ChevronDown, ChevronRight } from 'lucide-react';
import './PublicNavbar.css';

const menuItems = [
  { label: 'Inicio', to: '/inicio', icon: <ChevronRight size={16} /> },
  {
    label: 'Sobre Nosotros',
    icon: <ChevronDown size={16} />,
    submenu: [
      { label: 'Misión y Visión', to: '/seccion/mision-vision' },
      { label: 'Historia', to: '/seccion/historia' },
      { label: 'Estructura Organizativa (Organigrama)', to: '/seccion/organigrama' },
      { label: 'Autoridades o Responsables', to: '/seccion/autoridades' },
    ],
  },
  {
    label: 'Servicios',
    icon: <ChevronDown size={16} />,
    submenu: [
      { label: 'Trámites en Línea', to: '/seccion/tramites' },
      { label: 'Entrega de Gas a Domicilio', to: '/seccion/entrega-gas' },
      { label: 'Puntos de Venta', to: '/seccion/puntos-venta' },
      { label: 'Tipos de Cilindros / Productos', to: '/seccion/tipos-cilindros' },
      { label: 'Horarios de Atención', to: '/seccion/horarios' },
    ],
  },
  {
    label: 'Tarifas',
    icon: <ChevronDown size={16} />,
    submenu: [
      { label: 'Precios de Gas Actualizados', to: '/seccion/precios-gas' },
      { label: 'Promociones o Subsidios', to: '/seccion/promociones-subsidios' },
    ],
  },
  {
    label: 'Transparencia',
    icon: <ChevronDown size={16} />,
    submenu: [
      { label: 'Presupuesto', to: '/seccion/presupuesto' },
      { label: 'Convenios o Contratos Públicos', to: '/seccion/convenios-contratos' },
      { label: 'Informes de Gestión', to: '/seccion/informes-gestion' },
      { label: 'Reglamentos Internos / Normativa', to: '/seccion/reglamentos' },
      { label: 'Rendición de Cuentas', to: '/seccion/rendicion-cuentas' },
      { label: 'Transparencia LOTAIP', to: '/seccion/transparencia' },
    ],
  },
  {
    label: 'Participación Ciudadana',
    icon: <ChevronDown size={16} />,
    submenu: [
      { label: 'Buzón de Quejas y Sugerencias', to: '/seccion/buzon' },
      { label: 'Encuestas o Opiniones del Usuario', to: '/seccion/encuestas' },
      { label: 'Canales de Atención', to: '/seccion/canales-atencion' },
    ],
  },
  {
    label: 'Noticias y Comunicados',
    icon: <ChevronDown size={16} />,
    submenu: [
      { label: 'Noticias y Comunicados', to: '/seccion/noticias-comunicados' },
      { label: 'Comunicados Oficiales', to: '/seccion/comunicados' },
      { label: 'Actividades en la Comunidad', to: '/seccion/actividades' },
      { label: 'Campañas Informativas', to: '/seccion/campanas' },
    ],
  },
  {
    label: 'Contacto',
    icon: <ChevronDown size={16} />,
    submenu: [
      { label: 'Dirección y Mapa', to: '/seccion/direccion-mapa' },
      { label: 'Teléfonos y Correos', to: '/seccion/telefonos-correos' },
      { label: 'Redes Sociales', to: '/seccion/redes-sociales' },
    ],
  },
];

const isTouchDevice = () => {
  if (typeof window === 'undefined') return false;
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
};

const PublicNavbar = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [openedByClick, setOpenedByClick] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const navigate = useNavigate();
  const navRef = useRef();

  // Navegación por teclado
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Alt + 1: Ir al contenido principal
      if (event.altKey && event.key === '1') {
        event.preventDefault();
        const mainContent = document.querySelector('main') || document.querySelector('.home-page');
        if (mainContent) {
          mainContent.focus();
          mainContent.scrollIntoView({ behavior: 'smooth' });
        }
      }
      
      // Alt + 2: Ir al menú de navegación
      if (event.altKey && event.key === '2') {
        event.preventDefault();
        const navMenu = document.querySelector('.navbar-nav');
        if (navMenu) {
          navMenu.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Cerrar submenú al hacer clic fuera
  useEffect(() => {
    const handleDocumentClick = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenIndex(null);
        setOpenedByClick(false);
      }
    };
    document.addEventListener('mousedown', handleDocumentClick);
    return () => document.removeEventListener('mousedown', handleDocumentClick);
  }, []);

  // Hover para desktop, clic para móvil
  const handleMouseEnter = idx => {
    if (!mobileMenu && !isTouchDevice() && !openedByClick) setOpenIndex(idx);
  };
  const handleMouseLeave = () => {
    if (!mobileMenu && !isTouchDevice() && !openedByClick) setOpenIndex(null);
  };
  const handleClick = idx => {
    // Si ya está abierto, ciérralo. Si no, abre solo este y cierra los demás
    if (openIndex === idx && openedByClick) {
      setOpenIndex(null);
      setOpenedByClick(false);
    } else {
      setOpenIndex(idx);
      setOpenedByClick(true);
    }
  };

  // Cerrar menú al hacer clic en un submenú
  const handleSubmenuClick = () => {
    setOpenIndex(null);
    setOpenedByClick(false);
    setMobileMenu(false);
  };

  // Cerrar menú móvil al navegar
  const handleNavClick = (to) => {
    setMobileMenu(false);
    setOpenIndex(null);
    setOpenedByClick(false);
    navigate(to);
  };

  return (
    <header className="navbar-header" role="banner">
      {/* Skip links para navegación rápida */}
      <a href="#main-content" className="skip-link">
        Saltar al contenido principal
      </a>
      <a href="#main-navigation" className="skip-link">
        Saltar al menú de navegación
      </a>
      
      <div className="navbar-top-row">
        <div className="navbar-brand" onClick={() => handleNavClick('/')}> 
                                <img src="/imagen/logo.png" alt="Logo" height="40" className="me-2" />
          <span className="navbar-title">GAD Paján</span>
        </div>
        <Link to="/login" className="navbar-login-btn navbar-login-desktop" onClick={() => setMobileMenu(false)}>
          <LogIn className="me-1" size={18} /> Iniciar Sesión
        </Link>
      </div>
      <nav className="custom-navbar" ref={navRef} id="main-navigation" role="navigation" aria-label="Navegación principal">
        <button
          className={`navbar-hamburger${mobileMenu ? ' open' : ''}`}
          onClick={() => setMobileMenu(!mobileMenu)}
          aria-label="Menú"
        >
          {mobileMenu ? <CloseIcon size={28} /> : <MenuIcon size={28} />}
        </button>
        <ul className={`navbar-menu${mobileMenu ? ' mobile-open' : ''}`}>
          {menuItems.map((item, idx) => (
            <li
              key={item.label}
              className={`navbar-item${item.submenu ? ' has-submenu' : ''}${openIndex === idx ? ' open' : ''}`}
              onMouseEnter={() => handleMouseEnter(idx)}
              onMouseLeave={handleMouseLeave}
            >
              {item.submenu ? (
                <>
                  <span
                    className="navbar-link"
                    onClick={e => {
                      e.preventDefault();
                      handleClick(idx);
                    }}
                    tabIndex={0}
                    role="button"
                  >
                    {item.label} {item.icon}
                  </span>
                  <ul className="submenu animated-dropdown">
                    {item.submenu.map(sub => (
                      <li key={sub.label} className="submenu-item">
                        <Link
                          to={sub.to}
                          className="submenu-link"
                          onClick={handleSubmenuClick}
                        >
                          {sub.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <span
                  className="navbar-link"
                  onClick={() => handleNavClick(item.to)}
                  tabIndex={0}
                  role="button"
                >
                  {item.label} {item.icon}
                </span>
              )}
            </li>
          ))}
          <li className="navbar-login-mobile">
            <Link to="/login" className="navbar-login-btn" onClick={() => setMobileMenu(false)}>
              <LogIn className="me-1" size={18} /> Iniciar Sesión
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default PublicNavbar;