import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Producto } from 'src/app/models/producto.models';
import { LoadingService } from 'src/app/services/loading.service';
import { ProductoService } from 'src/app/services/producto.service';
import { RemitoService } from 'src/app/services/remito.service';
import { ToastService } from 'src/app/services/toast.service';
import reportesDisponiblesJson from 'src/app/pages/reportes/reportesDisponibles.json'

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
  // tiposDeReportes = ['Productos', 'Clientes', 'Remitos', 'Hojas de Ruta'];
  reporteSeleccionado: any;
  tiposDeReportes: any;
  reporteSubmitted: boolean = false;
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

  ngOnInit() { 
    this.tiposDeReportes = reportesDisponiblesJson;
    console.log(this.tiposDeReportes)
  }


  async ejecutarReporte() {
    
    if(this.reporteSeleccionado == "")
      return;
    
    this.loading.present('Cargando...');
    switch (this.reporteSeleccionado.nombre) {
      case 'Productos': {
        this.fechaDesde = null;
        this.fechaHasta = null;
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
        
        if (this.fechaDesde == null || this.fechaHasta == null ) {
          this.reporteSeleccionado = null;
          this.loading.dismiss();
          return this.toastService.presentToast("Fecha Desde o Fecha Hasta sin completar");
        }

        this.fechaDesde = this.formatearFecha(this.fechaDesde);
        this.fechaHasta = this.formatearFecha(this.fechaHasta);
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

        this.reporteSubmitted = true;
        break;
      }
      default: {
        this.reporteSubmitted = false;
        const defaultMessage = "Aun no está resuelta la opcion " + this.reporteSeleccionado;
        console.log(defaultMessage);
        this.toastService.presentToast(defaultMessage);
        break;
      }
    }
    this.loading.dismiss();
  }

  seleccionarReporte($event) {
    console.log($event.target.value)
    console.log(this.reporteSeleccionado)
    console.log(this.reporteSeleccionado.nombre)
    console.log(this.reporteSeleccionado.necesitaFecha)
  }

  formatearFecha(fecha: string) {
    const date = new Date(fecha);
    return date.getFullYear() + '-' +
      ('00' + (date.getMonth() + 1)).slice(-2) + '-' +
      ('00' + date.getDate()).slice(-2);
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
