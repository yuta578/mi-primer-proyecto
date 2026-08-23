import React from 'react'
import { TarjetaTramite } from './components/TarjetaTramite'
import './App.css'

export interface TramiteData {
  id: string
  titulo: string
  descripcion: string
  categoria: string
  icon: string
}

const TRAMITES: TramiteData[] = [
  {
    id: 'agua-alcantarillado',
    titulo: 'Agua y Alcantarillado',
    descripcion: 'Reporte y atención rápida para fugas de agua potable, cortes de servicio y mantenimiento de la red de alcantarillado.',
    categoria: 'Servicios Básicos',
    icon: '💧'
  },
  {
    id: 'recoleccion-basura',
    titulo: 'Recolección de Basura',
    descripcion: 'Información de horarios de rutas, reporte de acumulación de residuos sólidos y limpieza en puntos críticos.',
    categoria: 'Limpia Pública',
    icon: '🗑️'
  },
  {
    id: 'alumbrado-publico',
    titulo: 'Alumbrado Público',
    descripcion: 'Atención a reportes de lámparas apagadas, postes caídos o con fallas eléctricas en la vía pública.',
    categoria: 'Mantenimiento Urbano',
    icon: '💡'
  }
]

export const App: React.FC = () => {
  return (
    <div className="app-container">
      {/* Header Institucional */}
      <header className="header-institucional">
        <div className="top-bar">
          <div className="nav-inner" style={{ paddingTop: 0, paddingBottom: 0 }}>
            <span>Gobierno Municipal | Portal Oficial de Atención Ciudadana</span>
            <span>Teléfono de Atención: 01-800-GOB-SERVICIOS</span>
          </div>
        </div>
        <div className="nav-inner">
          <div className="brand-institucional">
            <div className="escudo-icon" title="Escudo Institucional">🏛️</div>
            <div className="brand-text">
              <h1>Portal de Servicios Ciudadanos</h1>
              <p>Atención y Solución a Trámites Urbanos</p>
            </div>
          </div>
          <div className="badge-oficial">
            <span className="badge-dot"></span>
            Sistema en Línea Activo
          </div>
        </div>
      </header>

      {/* Portada Institucional */}
      <section className="portada-institucional">
        <div className="portada-content">
          <span className="portada-tag">Atención Directa al Ciudadano</span>
          <h2 className="portada-titulo">Ventanilla Única de Trámites y Reportes</h2>
          <p className="portada-subtitulo">
            Gestiona de forma eficiente las solicitudes de servicios públicos municipales. 
            Monitorea el estado de tus reportes en tiempo real.
          </p>
        </div>
      </section>

      {/* Sección Principal con Encabezado "Respuestas" y las 3 Tarjetas */}
      <main className="seccion-principal">
        <div className="encabezado-seccion">
          <div>
            <h2 className="titulo-respuestas">Respuestas</h2>
            <p className="subtitulo-respuestas">
              Selecciona una categoría de trámite para ver soluciones, reportes y estado del servicio
            </p>
          </div>
        </div>

        {/* Tarjetas en Columnas */}
        <div className="grid-tarjetas">
          {TRAMITES.map(item => (
            <TarjetaTramite
              key={item.id}
              titulo={item.titulo}
              descripcion={item.descripcion}
              categoria={item.categoria}
              icon={item.icon}
            />
          ))}
        </div>
      </main>

      {/* Pie de Página Institucional */}
      <footer className="footer-institucional">
        <div className="footer-content">
          <div className="footer-brand">
            <span>🏛️</span>
            <span>Gobierno Municipal — Ventanilla de Servicios</span>
          </div>
          <p>© 2026 Portal Institucional de Servicios. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
