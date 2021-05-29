import { Email } from "./email.models";
import { Telefono } from "./telefono.models";

export interface Contacto{
    id_contacto: number,
    nombre: string,
    apellido: string,
    emails: Email[],
    telefonos: Telefono[]
}