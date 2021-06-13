import { cliente } from './cliente.models';
import { Producto } from './producto.models';
import { Estado } from './estado.models';
import { ComprobanteEntrega } from './comprobanteEntrega.models';

export interface Remito {
    id_remito: number;
    fechaDeCreacion: string;
    total: number;
    motivo: string;
    tiempo_espera: number;
    cliente: cliente;
    estado: Estado;
    productos: Producto[];
    comprobante: ComprobanteEntrega;
    cantidadDeItems: number;
    /* hojaDeRuta: HojaDeRuta; */
}
