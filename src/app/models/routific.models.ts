import { Remito } from "./remito.models"

export interface RtaRoutific {
  total_travel_time: number
  total_idle_time: number
  total_visit_lateness: number
  total_vehicle_overtime: number
  vehicle_overtime: {
    vehiculo: Number
  }
  total_break_time: number
  num_unserved: number
  unserved: any
  solution: {
    vehiculo: SolutionItem[]
  },
  total_working_time: number
  status: string
  num_late_visits: number
}
interface SolutionItem {
  location_id: string
  location_name: string
}


export class RutaDeNavegacion {
  posicionInicial: Posicion
  tiempoEstimado: Number
  proximaVisita: Visita
  visitas: Visita[]
}
export class Posicion {
  lat: number
  lng: number
}

export class Visita {
  numero: number
  nombre: string
  calle: string
  altura: number
  localidad: string
  provincia: string
  posicion: Posicion
  remito:Remito

  get direccion(): string {
    return this.calle + " " + this.altura.toString() + ", " + this.localidad + ", " + this.provincia
  }
}