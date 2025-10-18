import React, { useState, useEffect } from 'react';
import { changeLanguage, t } from '../utils/translations';
import './LanguageSelector.css';

const LanguageSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('es');

  useEffect(() => {
    // Cargar idioma guardado
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'es';
    setCurrentLanguage(savedLanguage);
  }, []);

  const handleLanguageChange = (language) => {
    setCurrentLanguage(language);
    changeLanguage(language);
    setIsOpen(false);
  };

  const languages = [
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'pt', name: 'Português', flag: '🇧🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' }
  ];

  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];

  return (
    <>
      {/* Botón flotante de idioma */}
      <button
        className="language-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Cambiar idioma"
        aria-expanded={isOpen}
        aria-controls="language-panel"
      >
        <span role="img" aria-label="Idioma">{currentLang.flag}</span>
        <span className="language-text">{currentLang.code.toUpperCase()}</span>
      </button>

      {/* Panel de selección de idioma */}
      {isOpen && (
        <div 
          id="language-panel"
          className="language-panel"
          role="dialog"
          aria-labelledby="language-title"
        >
          <div className="language-header">
            <h3 id="language-title">Seleccionar Idioma</h3>
            <button
              className="close-button"
              onClick={() => setIsOpen(false)}
              aria-label="Cerrar selector de idioma"
            >
              ×
            </button>
          </div>

          <div className="language-content">
            <p className="language-description">
              Selecciona el idioma para traducir toda la página web institucional
            </p>
            
            <div className="language-options">
              {languages.map((language) => (
                <button
                  key={language.code}
                  className={`language-option ${currentLanguage === language.code ? 'active' : ''}`}
                  onClick={() => handleLanguageChange(language.code)}
                  aria-label={`Cambiar a ${language.name}`}
                >
                  <span className="language-flag">{language.flag}</span>
                  <span className="language-name">{language.name}</span>
                  {currentLanguage === language.code && (
                    <span className="language-check">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Overlay para cerrar el panel */}
      {isOpen && (
        <div 
          className="language-overlay"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default LanguageSelector;
