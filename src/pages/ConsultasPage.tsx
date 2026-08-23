import React, { useEffect, useState, useCallback } from 'react'
import type { PQRSItem } from '../types/pqrs'
import './ConsultasPage.css'

interface ConsultasPageProps {
  onVerDetalle?: (id: string) => void
}

export const ConsultasPage: React.FC<ConsultasPageProps> = ({ onVerDetalle }) => {
  const [pqrsData, setPqrsData] = useState<PQRSItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [selectedCategoria, setSelectedCategoria] = useState<string>('Todas')

  // Función para obtener datos desde /api/pqrs
  const fetchPQRS = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/pqrs')
      if (!response.ok) {
        throw new Error(`Error en el servidor (${response.status}: ${response.statusText})`)
      }
      const data: PQRSItem[] = await response.json()
      setPqrsData(data)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'No se pudo establecer conexión con el servidor.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPQRS()
  }, [fetchPQRS])

  // Filtrado en tiempo real por búsqueda y categoría
  const filteredData = pqrsData.filter(item => {
    const matchesCategory = selectedCategoria === 'Todas' || item.categoria.toLowerCase() === selectedCategoria.toLowerCase()
    
    const query = searchTerm.toLowerCase().trim()
    const matchesSearch = !query || 
      item.id.toLowerCase().includes(query) ||
      item.solicitante.toLowerCase().includes(query) ||
      item.categoria.toLowerCase().includes(query) ||
      item.descripcion.toLowerCase().includes(query) ||
      item.estado.toLowerCase().includes(query)

    return matchesCategory && matchesSearch
  })

  return (
    <div className="consultas-container">
      <header className="consultas-header">
        <div className="consultas-header-content">
          <span className="consultas-badge">Ventanilla Virtual</span>
          <h1 className="consultas-title">Consulta de Trámites y Radicados</h1>
          <p className="consultas-subtitle">
            Buscador en tiempo real de peticiones, quejas y reclamos de servicios públicos municipales.
          </p>
        </div>
      </header>

      <main className="consultas-main">
        {/* Barra de Filtros y Buscador (siempre visible) */}
        <section className="search-bar-container">
          <div className="search-input-wrapper">
            <span className="search-icon" aria-hidden="true">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Buscar por N° Radicado, solicitante, trámite o descripción..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="clear-search-btn" onClick={() => setSearchTerm('')} title="Limpiar búsqueda">
                ✕
              </button>
            )}
          </div>

          <div className="category-tabs">
            {['Todas', 'Agua y Alcantarillado', 'Recolección de Basura', 'Alumbrado Público'].map(cat => (
              <button
                key={cat}
                className={`tab-btn ${selectedCategoria === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategoria(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* 1. Estado CARGANDO */}
        {loading && (
          <div className="state-card state-loading">
            <div className="spinner"></div>
            <h3>Cargando trámites y radicados...</h3>
            <p>Conectando con el servicio institucional `/api/pqrs`</p>
          </div>
        )}

        {/* 2. Estado ERROR */}
        {!loading && error && (
          <div className="state-card state-error">
            <div className="error-icon">⚠️</div>
            <h3>No se pudo cargar la información</h3>
            <p className="error-text">{error}</p>
            <button className="btn-retry" onClick={fetchPQRS}>
              🔄 Reintentar conexión
            </button>
          </div>
        )}

        {/* 3. Estado VACÍO (No se encontraron trámites) */}
        {!loading && !error && filteredData.length === 0 && (
          <div className="state-card state-empty">
            <div className="empty-icon">📂</div>
            <h3>No se encontraron trámites</h3>
            <p>
              {searchTerm 
                ? `No hay resultados que coincidan con "${searchTerm}". Intenta con otros términos de búsqueda.`
                : 'No existen trámites registrados para la categoría seleccionada.'}
            </p>
            {(searchTerm || selectedCategoria !== 'Todas') && (
              <button className="btn-reset-filters" onClick={() => { setSearchTerm(''); setSelectedCategoria('Todas') }}>
                Limpiar filtros
              </button>
            )}
          </div>
        )}

        {/* 4. Estado LISTA CON DATOS (Tarjetas con etiquetas de color) */}
        {!loading && !error && filteredData.length > 0 && (
          <div className="cards-result-section">
            <div className="result-counter">
              Mostrando <strong>{filteredData.length}</strong> de <strong>{pqrsData.length}</strong> radicados
            </div>

            <div className="pqrs-cards-grid">
              {filteredData.map(item => (
                <article 
                  key={item.id} 
                  className="pqrs-card clickable-card"
                  onClick={() => onVerDetalle && onVerDetalle(item.id)}
                  title="Haz clic para ver la ficha técnica completa"
                >
                  <div className="pqrs-card-header">
                    <span className="pqrs-card-id">{item.id}</span>
                    <span className={`status-tag ${item.estado === 'Resuelto' ? 'tag-resuelto' : 'tag-tramite'}`}>
                      {item.estado === 'Resuelto' ? '✓ Resuelto' : '⏳ En trámite'}
                    </span>
                  </div>

                  <div className="pqrs-card-body">
                    <span className="pqrs-card-category">{item.categoria}</span>
                    <h3 className="pqrs-card-title">{item.solicitante}</h3>
                    <p className="pqrs-card-desc">{item.descripcion}</p>
                  </div>

                  <div className="pqrs-card-meta">
                    <div>
                      <small className="meta-label">Fecha Radicación:</small>
                      <div className="meta-val">{item.fechaRadicacion}</div>
                    </div>
                    <div>
                      <small className="meta-label">Plazo Legal:</small>
                      <div className="meta-val">{item.plazoLegal}</div>
                    </div>
                  </div>

                  <div className="pqrs-card-response">
                    <strong>Respuesta Oficial:</strong>
                    <p>{item.respuestaOficial}</p>
                  </div>

                  <div className="card-action-hint">
                    Ver ficha técnica completa ➔
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default ConsultasPage
