/* eslint-disable @typescript-eslint/naming-convention */
import { Contacto } from './contacto.models';
import { Usuario } from './usuario.models';
import { Direccion } from './direccion.models';
import { Disponibilidad } from './disponibilidad.models';

export class Cliente {
    idCliente: number;
    nombre: string;
    observaciones: string;
    cuit: string;
    promedio_espera: number;
    activo: boolean;
    propietario: Usuario;
    direccion: Direccion;
    disponibilidades: Disponibilidad[];
    contactos: Contacto[];
    urlImagenPerfil: string;
}
