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
  reporteSubmitted: boolean = false;
  necesitaFecha: boolean = false;
  mesesCustomizados = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiempre', 'Octubre', 'Noviembre', 'Diciembre'];
  fechaDeHoy: string = new Date().toISOString();
  fechaDesde: string;
  fechaHasta: string;

  constructor(
    private loading: LoadingService,
    private productosService: ProductoService,
    private remitosService: RemitoService,
    private toastService: ToastService,
  ) { }

  ngOnInit() { }

  async ejecutarReporte() {
    
    if(this.reporteSeleccionado == "")
      return;
    
    this.loading.present('Cargando...');
    switch (this.reporteSeleccionado) {
      case 'Productos': {

        this.columns = this.columnasProducto;

        await this.productosService.getAll().then(
          (productos: Producto[]) => {
            console.log(productos);
            this.rows = productos
          }
        ).catch((err) => {
          console.error(err.error.message);
          return this.toastService.presentToast(err.error.message);
        });
        this.reporteSubmitted = true;
        
        break;
      }
      case 'Remitos': {
        this.columns = this.columnasRemitos;
        this.necesitaFecha = true;
        
        if (this.fechaDesde == null || this.fechaHasta == null ) {
          this.reporteSeleccionado = null;
          this.loading.dismiss();
          return this.toastService.presentToast("Fecha Desde o Fecha Hasta sin completar");
        }
        // const fechaDesde = '2021-07-01';
        // const fechaHasta = '2021-07-17';
        await this.remitosService.getCantidadProductosVendidos(this.fechaDesde, this.fechaHasta).then(
          (productos: Producto[]) => {
            console.log(productos);
            this.rows = productos;
          }
        ).catch((err) => {
          console.error(err.error.message);
          this.toastService.presentToast(err.error.message);
        });
        
        break;

      }
      default: {
        this.necesitaFecha = false;
        const defaultMessage = "Aun no está resuelta la opcion " + this.reporteSeleccionado;
        console.log(defaultMessage);
        this.toastService.presentToast(defaultMessage);
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
