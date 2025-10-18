import React, { useState, useEffect } from 'react';
import './AccessibilityPanel.css';

const AccessibilityPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState({
    highContrast: false,
    fontSize: 100, // porcentaje
    textToSpeech: false,
    animations: true,
    focusVisible: true,
    reducedMotion: false
  });

  // Cargar configuración guardada
  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      const savedSettings = localStorage.getItem('accessibilitySettings');
      if (savedSettings) {
        try {
          const parsedSettings = JSON.parse(savedSettings);
          setSettings(parsedSettings);
          // Aplicar configuración excepto texto a voz
          const settingsWithoutTTS = { ...parsedSettings, textToSpeech: false };
          applySettings(settingsWithoutTTS);
        } catch (error) {
          console.error('Error parsing saved settings:', error);
        }
      }
    }
  }, []);

  // Aplicar configuración
  const applySettings = (newSettings) => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      
      // Alto contraste
      if (newSettings.highContrast) {
        root.classList.add('high-contrast');
      } else {
        root.classList.remove('high-contrast');
      }

      // Tamaño de fuente
      root.style.fontSize = `${newSettings.fontSize}%`;

      // Reducir movimiento
      if (newSettings.reducedMotion) {
        root.classList.add('reduced-motion');
      } else {
        root.classList.remove('reduced-motion');
      }
    }

    // Text-to-speech
    if (newSettings.textToSpeech) {
      enableTextToSpeech();
    } else {
      disableTextToSpeech();
    }

    // Guardar en localStorage
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('accessibilitySettings', JSON.stringify(newSettings));
    }
  };

  // Text-to-speech
  const enableTextToSpeech = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      // Agregar event listener para clics en toda la página
      if (typeof document !== 'undefined') {
        document.addEventListener('click', handleTextToSpeech);
        console.log('Texto a voz habilitado - Hacer clic en cualquier texto para escucharlo');
      }
    } else {
      console.error('Síntesis de voz no soportada en este navegador');
    }
  };

  const disableTextToSpeech = () => {
    if (typeof document !== 'undefined') {
      document.removeEventListener('click', handleTextToSpeech);
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    console.log('Texto a voz deshabilitado');
  };

  const handleTextToSpeech = (event) => {
    // Solo activar si el texto a voz está habilitado
    if (!settings.textToSpeech) {
      return;
    }
    
    // Evitar activación en elementos del panel de accesibilidad
    if (event.target.closest('.accessibility-panel')) {
      return;
    }
    
    // Evitar activación en botones y elementos interactivos
    if (event.target.tagName === 'BUTTON' || event.target.tagName === 'A' || event.target.tagName === 'INPUT') {
      return;
    }
    
    // Evitar activación en elementos con clases específicas
    if (event.target.closest('.btn') || event.target.closest('.nav-link') || event.target.closest('.dropdown')) {
      return;
    }
    
    // Obtener el texto del elemento clickeado
    const text = event.target.textContent?.trim();
    
    // Solo leer si hay texto y no es muy largo
    if (text && text.length > 0 && text.length < 200) {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        // Cancelar cualquier síntesis anterior
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Buscar una voz en español
        const voices = window.speechSynthesis.getVoices();
        const spanishVoice = voices.find(voice => 
          voice.lang.includes('es') || voice.lang.includes('ES')
        );
        
        if (spanishVoice) {
          utterance.voice = spanishVoice;
        }
        
        utterance.lang = 'es-ES';
        utterance.rate = 0.9;
        utterance.volume = 1.0;
        utterance.pitch = 1.0;
        
        // Manejar errores
        utterance.onerror = (event) => {
          console.error('Error en síntesis de voz:', event);
        };
        
        utterance.onstart = () => {
          console.log('Leyendo:', text.substring(0, 50));
        };
        
        utterance.onend = () => {
          console.log('Lectura completada');
        };
        
        try {
          window.speechSynthesis.speak(utterance);
        } catch (error) {
          console.error('Error al iniciar síntesis de voz:', error);
        }
      }
    }
  };

  // Función de prueba para texto a voz
  const testTextToSpeech = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const testText = 'Prueba de texto a voz funcionando correctamente.';
      const utterance = new SpeechSynthesisUtterance(testText);
      
      // Buscar una voz en español
      const voices = window.speechSynthesis.getVoices();
      const spanishVoice = voices.find(voice => 
        voice.lang.includes('es') || voice.lang.includes('ES')
      );
      
      if (spanishVoice) {
        utterance.voice = spanishVoice;
      }
      
      utterance.lang = 'es-ES';
      utterance.rate = 0.9;
      utterance.volume = 1.0;
      utterance.pitch = 1.0;
      
      utterance.onstart = () => {
        console.log('Prueba iniciada');
      };
      
      utterance.onend = () => {
        console.log('Prueba completada');
      };
      
      utterance.onerror = (event) => {
        console.error('Error en prueba:', event);
      };
      
      try {
        window.speechSynthesis.speak(utterance);
      } catch (error) {
        console.error('Error al iniciar prueba:', error);
      }
    }
  };

  // Manejar cambios de configuración
  const handleSettingChange = (setting, value) => {
    const newSettings = { ...settings, [setting]: value };
    setSettings(newSettings);
    applySettings(newSettings);
  };

  // Aumentar/disminuir tamaño de fuente
  const changeFontSize = (increment) => {
    const newSize = Math.max(80, Math.min(200, settings.fontSize + increment));
    handleSettingChange('fontSize', newSize);
  };

  // Navegación por teclado
  const handleKeyDown = (event) => {
    if (event.key === 'Escape' && isOpen) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <>
      {/* Botón flotante de accesibilidad */}
      <button
        className="accessibility-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Abrir panel de accesibilidad"
        aria-expanded={isOpen}
        aria-controls="accessibility-panel"
      >
        <span role="img" aria-label="Accesibilidad">♿</span>
      </button>

      {/* Panel de accesibilidad */}
      {isOpen && (
        <div 
          id="accessibility-panel"
          className="accessibility-panel"
          role="dialog"
          aria-labelledby="accessibility-title"
          aria-describedby="accessibility-description"
        >
                     <div className="accessibility-header">
             <h2 id="accessibility-title">Accesibilidad (WCAG 2.1 AA)</h2>
             <button
               className="close-button"
               onClick={() => setIsOpen(false)}
               aria-label="Cerrar panel de accesibilidad"
             >
               ×
             </button>
           </div>

          <div id="accessibility-description" className="accessibility-content">
                         <div className="accessibility-section">
               <h3>Contraste y Colores</h3>
               <div className="setting-item">
                 <label className="toggle-label">
                   <input
                     type="checkbox"
                     checked={settings.highContrast}
                     onChange={(e) => handleSettingChange('highContrast', e.target.checked)}
                     aria-describedby="high-contrast-desc"
                   />
                   <span className="toggle-slider"></span>
                   Alto Contraste
                 </label>
                 <p id="high-contrast-desc" className="setting-description">
                   Activa el modo de alto contraste para mejor visibilidad
                 </p>
               </div>
             </div>

            <div className="accessibility-section">
              <h3>Tamaño de Texto</h3>
              <div className="setting-item">
                <div className="font-size-controls">
                  <button
                    onClick={() => changeFontSize(-10)}
                    aria-label="Reducir tamaño de texto"
                    className="font-size-btn"
                  >
                    A-
                  </button>
                  <span className="font-size-display">{settings.fontSize}%</span>
                  <button
                    onClick={() => changeFontSize(10)}
                    aria-label="Aumentar tamaño de texto"
                    className="font-size-btn"
                  >
                    A+
                  </button>
                </div>
                <p className="setting-description">
                  Ajusta el tamaño del texto para mejor legibilidad
                </p>
              </div>
            </div>

            <div className="accessibility-section">
              <h3>Lector de Pantalla</h3>
              <div className="setting-item">
                <label className="toggle-label">
                  <input
                    type="checkbox"
                    checked={settings.textToSpeech}
                    onChange={(e) => handleSettingChange('textToSpeech', e.target.checked)}
                    aria-describedby="text-to-speech-desc"
                  />
                  <span className="toggle-slider"></span>
                  Texto a Voz
                </label>
                <p id="text-to-speech-desc" className="setting-description">
                  Lee en voz alta el contenido al hacer clic en texto. Solo se activa cuando usted lo habilita explícitamente.
                </p>
                {settings.textToSpeech && (
                  <div className="mt-2">
                    <button
                      onClick={testTextToSpeech}
                      className="btn btn-sm btn-outline-primary"
                      type="button"
                    >
                      🎤 Probar
                    </button>
                  </div>
                )}
              </div>
            </div>

            

             <div className="accessibility-section">
               <h3>Animaciones</h3>
               <div className="setting-item">
                 <label className="toggle-label">
                   <input
                     type="checkbox"
                     checked={settings.reducedMotion}
                     onChange={(e) => handleSettingChange('reducedMotion', e.target.checked)}
                     aria-describedby="reduced-motion-desc"
                   />
                   <span className="toggle-slider"></span>
                   Reducir Movimiento
                 </label>
                 <p id="reduced-motion-desc" className="setting-description">
                   Reduce las animaciones para usuarios sensibles al movimiento
                 </p>
               </div>
             </div>

            <div className="accessibility-section">
              <h3>Navegación</h3>
              <div className="keyboard-shortcuts">
                <h4>Atajos de Teclado</h4>
                <ul>
                  <li><kbd>Tab</kbd> - Navegar entre elementos</li>
                  <li><kbd>Enter</kbd> o <kbd>Espacio</kbd> - Activar elementos</li>
                  <li><kbd>Escape</kbd> - Cerrar este panel</li>
                  <li><kbd>Alt + 1</kbd> - Ir al contenido principal</li>
                  <li><kbd>Alt + 2</kbd> - Ir al menú de navegación</li>
                </ul>
              </div>
            </div>

            <div className="accessibility-section">
              <h3>Información de Accesibilidad</h3>
              <p>
                Este sitio web cumple con los estándares WCAG 2.1 AA para accesibilidad web.
                Incluye navegación por teclado, lectores de pantalla, alto contraste y más.
              </p>
              <p>
                Si encuentras algún problema de accesibilidad, por favor contáctanos.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Overlay para cerrar el panel */}
      {isOpen && (
        <div 
          className="accessibility-overlay"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default AccessibilityPanel;
