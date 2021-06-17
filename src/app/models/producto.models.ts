/* eslint-disable @typescript-eslint/naming-convention */
export interface Producto {
    idProducto: number;
    nombre: string;
    precio_unitario: number;
    descripcion: string;
    url_imagen: string;
    esPrincipal: boolean;
    cantidad: number;
}
