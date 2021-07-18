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
  tipoReporteSeleccionado: any;
  reporteSeleccionado: any;
  tiposDeReportes: any;
  reportes: any;
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
    
    if(this.reporteSeleccionado == "" || this.reporteSeleccionado == undefined) {
      const defaultMessage = "Aun no hay reportes para el tipo de reporte " + this.tipoReporteSeleccionado.nombre;
      console.log(defaultMessage);
      this.toastService.presentToast(defaultMessage);
      return this.limpiarCampos();
    }
    
    this.loading.present('Cargando...');
    
    /** Reportes que están en reportesDisponibles.json */
    switch (this.reporteSeleccionado.nombre) {
      case 'Productos Disponibles': {
        this.limpiarFechas()
        this.columns = this.reporteSeleccionado.columnas;

        await this.productosService.getAll().then(
          (productos: Producto[]) => {
            console.log(productos);
            this.rows = productos
          }
        ).catch((err) => {
          this.limpiarCampos();
          console.error(err.error.message);
          return this.toastService.presentToast(err.error.message);
        });
        this.reporteSubmitted = true;
        
        break;
      }
      case 'Productos Vendidos': {
        this.columns = this.reporteSeleccionado.columnas;
        
        if (this.fechaDesde == null || this.fechaHasta == null ) {
          this.limpiarCampos();
          this.loading.dismiss();
          return this.toastService.presentToast("Fecha Desde o Fecha Hasta sin completar");
        }

        this.formatearFechas()
        
        await this.remitosService.getCantidadProductosVendidos(this.fechaDesde, this.fechaHasta).then(
          (productos: Producto[]) => {
            console.log(productos);
            this.rows = productos;
          }
        ).catch((err) => {
          this.limpiarCampos();
          console.error(err.error.message);
          this.toastService.presentToast(err.error.message);
        });

        this.reporteSubmitted = true;
        break;
      }
      default: {
        this.limpiarCampos();
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
    console.log(this.tipoReporteSeleccionado)
    console.log(this.tipoReporteSeleccionado.nombre)
    console.log(this.tipoReporteSeleccionado.reportes)
    if ( this.tipoReporteSeleccionado.reportes != undefined)
      return this.reportes = this.tipoReporteSeleccionado.reportes
    this.reportes = null
  }

  limpiarCampos() {
    this.limpiarFechas();
    this.tipoReporteSeleccionado = null;
    this.reporteSeleccionado = null;
    this.reporteSubmitted = false;
  }

  limpiarFechas() {
    this.fechaDesde = null;
    this.fechaHasta = null;
  }

  formatearFecha(fecha: string) {
    const date = new Date(fecha);
    return date.getFullYear() + '-' +
      ('00' + (date.getMonth() + 1)).slice(-2) + '-' +
      ('00' + date.getDate()).slice(-2);
  }

  formatearFechas() {
    this.fechaDesde = this.formatearFecha(this.fechaDesde);
    this.fechaHasta = this.formatearFecha(this.fechaHasta);
  }

}
