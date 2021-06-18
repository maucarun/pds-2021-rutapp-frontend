import { IdProductoRemito } from './idproductoremito.models';
import { Producto } from './producto.models';
import { Remito } from './remito.models';

export interface ProductoRemito {
    idProductoRemito: IdProductoRemito;
    remito: Remito;
    producto: Producto;
    cantidad: number;
    precio_unitario: number;
    descuento: number;
}