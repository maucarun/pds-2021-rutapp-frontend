import { Remito } from './remito.models';

export interface ComprobanteEntrega {
    idComprobante: number;
    nombreCompleto: string;
    dni: string;
    fechaHoraEntrega: Date;
}
