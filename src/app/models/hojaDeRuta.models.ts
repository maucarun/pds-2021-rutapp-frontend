import { Estado } from './estado.models';
import { Remito } from './remito.models';

/* eslint-disable @typescript-eslint/naming-convention */
export interface HojaDeRuta {
    id_hoja_de_ruta: number;
    fecha_hora_inicio: Date;
    fecha_hora_fin: Date;
    kms_recorridos: number;
    justificacion: string;
    estado: Estado;
    remitos: Remito[];
}
