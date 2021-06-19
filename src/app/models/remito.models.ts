/* eslint-disable @typescript-eslint/naming-convention */
import { Cliente } from './cliente.models';
import { Estado } from './estado.models';
import { ComprobanteEntrega } from './comprobanteEntrega.models';
import { ProductoRemito } from './productoRemito.models';

export interface Remito {
    idRemito: number;
    fechaDeCreacion: string;
    total: number;
    motivo: string;
    tiempo_espera: string;
    cliente: Cliente;
    estado: Estado;
    productosDelRemito: ProductoRemito[];
    comprobante: ComprobanteEntrega;
    cantidadDeItems: number;
    /* hojaDeRuta: HojaDeRuta; */
}
