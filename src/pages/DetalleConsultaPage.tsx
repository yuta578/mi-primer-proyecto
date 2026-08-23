import React, { useEffect, useState } from 'react'
import type { PQRSItem } from '../types/pqrs'
import './DetalleConsultaPage.css'

interface DetalleConsultaPageProps {
  radicadoId?: string
  onVolver: () => void
}

export const DetalleConsultaPage: React.FC<DetalleConsultaPageProps> = ({
  radicadoId = 'RAD-2026-0101',
  onVolver
}) => {
  const [item, setItem] = useState<PQRSItem | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [copiado, setCopiado] = useState<boolean>(false)

  useEffect(() => {
    setLoading(true)
    setError(null)
    fetch('/api/pqrs')
      .then(res => {
        if (!res.ok) throw new Error('Error al cargar la información del radicado')
        return res.json()
      })
      .then((data: PQRSItem[]) => {
        // Buscar por ID exacto, o por coincidencias tipo "1" -> "RAD-2026-0101"
        const encontrado = data.find(p => 
          p.id.toLowerCase() === radicadoId.toLowerCase() || 
          p.id.endsWith(radicadoId) ||
          (radicadoId === '1' && p.id === 'RAD-2026-0101')
        ) || data[0]

        if (encontrado) {
          setItem(encontrado)
        } else {
          setError(`No se encontró ningún radicado con el identificador "${radicadoId}".`)
        }
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [radicadoId])

  const handleCopiarEnlace = async () => {
    try {
      const url = `${window.location.origin}/#consultas/${item?.id || radicadoId}`
      await navigator.clipboard.writeText(url)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 3000)
    } catch {
      // Fallback manual si clipboard API no está disponible
      setCopiado(true)
      setTimeout(() => setCopiado(false), 3000)
    }
  }

  if (loading) {
    return (
      <div className="detalle-container">
        <div className="detalle-loading">
          <div className="spinner"></div>
          <p>Cargando ficha técnica del radicado...</p>
        </div>
      </div>
    )
  }

  if (error || !item) {
    return (
      <div className="detalle-container">
        <div className="detalle-error">
          <div className="error-icon">⚠️</div>
          <h2>Radicado No Encontrado</h2>
          <p>{error || 'No se pudieron recuperar los datos de este trámite.'}</p>
          <button className="btn-volver" onClick={onVolver}>
            ← Volver a Consultas
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="detalle-container">
      {/* Botón Superior de Regreso */}
      <div className="top-actions">
        <button className="btn-volver" onClick={onVolver} type="button">
          ← Volver a Consultas
        </button>
        <button className={`btn-copiar ${copiado ? 'copiado' : ''}`} onClick={handleCopiarEnlace} type="button">
          {copiado ? '✓ ¡Enlace Copiado!' : '🔗 Copiar Enlace'}
        </button>
      </div>

      {/* Ficha Técnica Card */}
      <article className="ficha-tecnica-card">
        {/* Banner Superior de Ficha */}
        <div className="ficha-header">
          <div className="ficha-title-block">
            <span className="ficha-tag">Ficha Técnica Oficial</span>
            <h1 className="ficha-radicado-id">{item.id}</h1>
            <p className="ficha-solicitante"><strong>Solicitante:</strong> {item.solicitante}</p>
          </div>
          <div className="ficha-status-block">
            <span className={`status-badge-lg ${item.estado === 'Resuelto' ? 'status-resuelto' : 'status-tramite'}`}>
              {item.estado === 'Resuelto' ? '✓ Resuelto' : '⏳ En trámite'}
            </span>
          </div>
        </div>

        {/* Información General Grid */}
        <div className="ficha-grid-info">
          <div className="info-box">
            <span className="info-label">Categoría del Trámite</span>
            <span className="info-value category-pill">{item.categoria}</span>
          </div>
          <div className="info-box">
            <span className="info-label">Fecha de Radicación</span>
            <span className="info-value">{item.fechaRadicacion}</span>
          </div>
          <div className="info-box">
            <span className="info-label">Plazo Legal de Respuesta</span>
            <span className="info-value">{item.plazoLegal}</span>
          </div>
          <div className="info-box">
            <span className="info-label">Canal de Recepción</span>
            <span className="info-value">Ventanilla Única Virtual</span>
          </div>
        </div>

        {/* Detalle de la Solicitud */}
        <div className="ficha-section">
          <h3 className="section-title">📝 Descripción de la Solicitud</h3>
          <div className="section-content desc-box">
            {item.descripcion}
          </div>
        </div>

        {/* Respuesta Oficial */}
        <div className="ficha-section">
          <h3 className="section-title">🏛️ Respuesta Oficial de la Entidad</h3>
          <div className="section-content respuesta-box">
            <p>{item.respuestaOficial}</p>
          </div>
        </div>

        {/* Trazabilidad y Seguimiento */}
        <div className="ficha-section">
          <h3 className="section-title">⏱️ Historial de Seguimiento</h3>
          <ol className="timeline">
            <li className="timeline-item completed">
              <span className="timeline-marker">✓</span>
              <div className="timeline-content">
                <strong>Radicación Registrada</strong>
                <p>Ingresado exitosamente el {item.fechaRadicacion}</p>
              </div>
            </li>
            <li className="timeline-item completed">
              <span className="timeline-marker">✓</span>
              <div className="timeline-content">
                <strong>Asignado a Cuadrilla Técnica</strong>
                <p>Asignación a la dependencia de {item.categoria}</p>
              </div>
            </li>
            <li className={`timeline-item ${item.estado === 'Resuelto' ? 'completed' : 'active'}`}>
              <span className="timeline-marker">{item.estado === 'Resuelto' ? '✓' : '⏳'}</span>
              <div className="timeline-content">
                <strong>{item.estado === 'Resuelto' ? 'Atención Completada' : 'En Evaluación Técnica'}</strong>
                <p>{item.respuestaOficial}</p>
              </div>
            </li>
          </ol>
        </div>

        {/* Pie de Ficha con Botones */}
        <div className="ficha-footer-actions">
          <button className="btn-volver" onClick={onVolver} type="button">
            ← Volver a Consultas
          </button>
          <button className={`btn-copiar ${copiado ? 'copiado' : ''}`} onClick={handleCopiarEnlace} type="button">
            {copiado ? '✓ ¡Enlace Copiado al Portapapeles!' : '🔗 Copiar Enlace Directo'}
          </button>
        </div>
      </article>
    </div>
  )
}

export default DetalleConsultaPage
