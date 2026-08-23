import fs from 'node:fs'
import path from 'node:path'
import type { IncomingMessage, ServerResponse } from 'node:http'

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

export function getPQRSData(): PQRSItem[] {
  const filePath = path.resolve(process.cwd(), 'data', 'pqrs.json')
  const fileContent = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(fileContent) as PQRSItem[]
}

export function handlePQRS(_req: IncomingMessage, res: ServerResponse): void {
  try {
    const data = getPQRSData()
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.end(JSON.stringify(data, null, 2))
  } catch (error) {
    res.statusCode = 500
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.end(JSON.stringify({ error: 'Error al leer el archivo pqrs.json', details: String(error) }))
  }
}

export default handlePQRS
