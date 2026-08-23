import React from 'react'
import './TarjetaTramite.css'

export interface TarjetaTramiteProps {
  titulo: string
  descripcion: string
  categoria: string
  icon?: string
}

export const TarjetaTramite: React.FC<TarjetaTramiteProps> = ({
  titulo,
  descripcion,
  categoria,
  icon = '📋'
}) => {
  return (
    <article className="tarjeta-tramite">
      <div className="tarjeta-header">
        <span className="tarjeta-categoria">{categoria}</span>
        <div className="tarjeta-icon-wrapper" aria-hidden="true">
          {icon}
        </div>
      </div>
      <h3 className="tarjeta-titulo">{titulo}</h3>
      <p className="tarjeta-descripcion">{descripcion}</p>
      <div className="tarjeta-footer">
        <button className="tarjeta-btn" type="button">
          Ver detalles ➔
        </button>
      </div>
    </article>
  )
}

export default TarjetaTramite
