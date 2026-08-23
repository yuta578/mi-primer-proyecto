export interface PQRSItem {
  id: string
  solicitante: string
  categoria: string
  descripcion: string
  estado: 'En trámite' | 'Resuelto'
  fechaRadicacion: string
  plazoLegal: string
  respuestaOficial: string
}
