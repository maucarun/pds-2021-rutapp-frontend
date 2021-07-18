import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Producto } from 'src/app/models/producto.models';
import { LoadingService } from 'src/app/services/loading.service';
import { ProductoService } from 'src/app/services/producto.service';
import { RemitoService } from 'src/app/services/remito.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.page.html',
  styleUrls: ['./reportes.page.scss'],
  /** Permite stylizar con styles de ngx-datatables*/
  encapsulation: ViewEncapsulation.None
})
export class ReportesPage implements OnInit {

  columns: any;
  rows: any;
  tiposDeReportes = ['Productos', 'Clientes', 'Remitos', 'Hojas de Ruta'];
  reporteSeleccionado: any;

  constructor(
    private loading: LoadingService,
    private productosService: ProductoService,
    private remitosService: RemitoService,
    private toastService: ToastService,
  ) { }

  ngOnInit() { }

  async seleccionarReporte($event) {
    const opcionSeleccionada = $event.target.value;
    
    if(opcionSeleccionada == "")
    return;
    
    this.loading.present('Cargando...');
    switch (opcionSeleccionada) {
      case 'Productos': {

        this.columns = this.columnasProducto;

        await this.productosService.getAll().then(
          (productos: Producto[]) => {
            console.log(productos);
            this.rows = productos
          }
        ).catch((err) => {
          console.error(err.error.message);
          this.toastService.presentToast(err.error.message);
        });
        
        this.reporteSeleccionado = opcionSeleccionada;
        break;
      }
      case 'Remitos': {
        this.columns = this.columnasRemitos;
        const fechaDesde = '2021-07-01';
        const fechaHasta = '2021-07-17';
        await this.remitosService.getCantidadProductosVendidos(fechaDesde, fechaHasta).then(
          (productos: Producto[]) => {
            console.log(productos);
            this.rows = productos;
          }
        ).catch((err) => {
          console.error(err.error.message);
          this.toastService.presentToast(err.error.message);
        });
        
        this.reporteSeleccionado = opcionSeleccionada;
        break;

      }
      default: {
        const defaultMessage = "Aun no está resuelta la opcion " + opcionSeleccionada;
        console.log(defaultMessage);
        this.toastService.presentToast(defaultMessage);
        this.reporteSeleccionado = null;
        break;
      }
    }
    this.loading.dismiss();
  }

  columnasProducto = [
    { prop: 'idProducto', name: 'Id' },
    { prop: 'nombre', name: 'Nombre' },
    { prop: 'precio_unitario', name: 'Precio' }
  ];

  columnasRemitos = [
    { prop: 'producto.nombre', name: 'Nombre'},
    { prop: 'cantidad', name: 'Cantidad'}
  ]

}
