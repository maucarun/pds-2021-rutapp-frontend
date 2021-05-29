import { DiaSemana } from "./diasemana.models";
import { IdDisponibilidad } from "./iddisponibilidad.models";

export interface Disponibilidad{
    idDisponibilidad:IdDisponibilidad,
    diaSemana:DiaSemana,
    hora_apertura: string,
    hora_cierre: string
}