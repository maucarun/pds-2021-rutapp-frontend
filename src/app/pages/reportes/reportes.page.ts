import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Producto } from 'src/app/models/producto.models';
import { LoadingService } from 'src/app/services/loading.service';
import { ProductoService } from 'src/app/services/producto.service';
import { RemitoService } from 'src/app/services/remito.service';
import { ToastService } from 'src/app/services/toast.service';
import reportesDisponiblesJson from 'src/app/pages/reportes/reportesDisponibles.json'
import { DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { Router } from '@angular/router';
import { Remito } from 'src/app/models/remito.models';
import { ClienteService } from 'src/app/services/cliente.service';
import { Cliente } from 'src/app/models/cliente.models';
import { HojaDeRutaService } from 'src/app/services/hojaDeRuta.service';
import { HojaDeRuta } from 'src/app/models/hojaDeRuta.models';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.page.html',
  styleUrls: ['./reportes.page.scss', './../../app.component.scss'],
  /** Permite stylizar con styles de ngx-datatables*/
  encapsulation: ViewEncapsulation.None
})
export class ReportesPage implements OnInit {

  columns: any;
  rows: any;
  filteredData = [];
  @ViewChild(DatatableComponent) table: DatatableComponent;

  tipoReporteSeleccionado: any;
  reporteSeleccionado: any;
  tiposDeReportes: any;
  reportes: any;

  reporteSubmitted: boolean = false;

  mesesCustomizados = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiempre', 'Octubre', 'Noviembre', 'Diciembre'];
  fechaDeHoy: string = new Date().toISOString();
  fechaDesde: string;
  fechaHasta: string;

  SelectionType = SelectionType;

  constructor(
    private clientesService: ClienteService,
    private hdrService: HojaDeRutaService,
    private loading: LoadingService,
    private productosService: ProductoService,
    private remitosService: RemitoService,
    private router: Router,
    private toastService: ToastService,
  ) { }

  ngOnInit() {
    this.tiposDeReportes = reportesDisponiblesJson;
    console.log(this.tiposDeReportes)
  }

  async ejecutarReporte() {

    if (this.tipoReporteSeleccionado == undefined)
      return this.toastService.presentToast("Seleccione un tipo de reporte");

    if (this.reporteSeleccionado == "" || this.reporteSeleccionado == undefined) {
      const defaultMessage = "Seleccione un reporte para el tipo de reporte " + this.tipoReporteSeleccionado.nombre;
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
            this.rows = productos;
            this.filteredData = productos;
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

        if (!this.validarFechas())
          return;

        this.formatearFechas()

        await this.remitosService.getCantidadProductosVendidos(this.fechaDesde, this.fechaHasta).then(
          (productos: Producto[]) => {
            console.log(productos);
            this.rows = productos;
            this.filteredData = productos;
          }
        ).catch((err) => {
          this.limpiarCampos();
          console.error(err.error.message);
          this.toastService.presentToast(err.error.message);
        });

        this.reporteSubmitted = true;
        break;
      }
      case 'Productos Entregados': {
        this.columns = this.reporteSeleccionado.columnas;

        if (!this.validarFechas())
          return;

        this.formatearFechas()

        await this.remitosService.getCantidadProductosEntregados(this.fechaDesde, this.fechaHasta).then(
          (productos: Producto[]) => {
            console.log(productos);
            this.rows = productos;
            this.filteredData = productos;
          }
        ).catch((err) => {
          this.limpiarCampos();
          console.error(err.error.message);
          this.toastService.presentToast(err.error.message);
        });

        this.reporteSubmitted = true;
        break;
      }
      case 'Remitos Disponibles': {
        this.limpiarFechas()
        this.columns = this.reporteSeleccionado.columnas;

        await this.remitosService.getAll().then(
          (remitos: Remito[]) => {
            console.log(remitos);
            remitos.forEach((r: any) => {
              r.cliente = r.cliente.nombre;
              r.estado = r.estado.nombre
            })
            this.rows = remitos
            this.filteredData = remitos;
          }
        ).catch((err) => {
          this.limpiarCampos();
          console.error(err.error.message);
          return this.toastService.presentToast(err.error.message);
        });
        this.reporteSubmitted = true;

        break;
      }
      case 'Tiempo de Espera': {
        this.limpiarFechas()
        this.columns = this.reporteSeleccionado.columnas;

        await this.clientesService.getAll().then(
          (clientes: Cliente[]) => {
            console.log(clientes);
            this.rows = clientes
            this.filteredData = clientes;
          }
        ).catch((err) => {
          this.limpiarCampos();
          console.error(err.error.message);
          return this.toastService.presentToast(err.error.message);
        });
        this.reporteSubmitted = true;

        break;
      }
      case 'Estatus General': {
        this.limpiarFechas()
        this.columns = this.reporteSeleccionado.columnas;

        await this.hdrService.getAllStatus().then(
          (hdrs: HojaDeRuta[]) => {
            console.log(hdrs);
            this.rows = hdrs
            this.filteredData = hdrs;
          }
        ).catch((err) => {
          this.limpiarCampos();
          console.error(err.error.message);
          return this.toastService.presentToast(err.error.message);
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

    if (this.tipoReporteSeleccionado.reportes == undefined) {
      this.reportes = null;
      this.reporteSeleccionado = null;
      return this.toastService.presentToast("No hay un tipo de reporte seleccionado");
    }

    this.limpiarFechas();
    this.reporteSubmitted = false;
    return this.reportes = this.tipoReporteSeleccionado.reportes
  }

  seleccionarTipoReporte($event) {
    this.reporteSeleccionado = null;
    this.seleccionarReporte($event);
  }

  validarFechas(): boolean {
    var fechasValidas = true;

    if (this.fechaDesde == null || this.fechaHasta == null) {
      fechasValidas = false
      this.limpiarCampos();
      this.loading.dismiss();
      this.toastService.presentToast("Fecha Desde o Fecha Hasta sin completar");
    }

    return fechasValidas;
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

  onSelect({ selected }) {
    console.log(selected);
    /** Como selected puede tener multiples seleccionados (NO USAMOS MULTIPLE)
     * usamos por defecto selected[0]
     */
    console.log(selected[0]);

    switch (this.tipoReporteSeleccionado.nombre) {
      case 'Productos': {
        /** 
         * Esto es para obtener el id del producto según como esté armado el objeto que viene del BE
         * Por ejemplo: si obtenes el idProducto de producto y no directamente del reporte, este ternario lo resuelve
        this.router.navigate(['productos/' + (selected[0].idProducto == undefined ? selected[0].producto.idProducto : selected[0].idProducto)]);
        */
        this.router.navigate(['productos/' + selected[0].idProducto]);
        break;
      }
      case 'Remitos': {
        this.router.navigate(['remitos/' + (selected[0].idRemito == undefined ? selected[0].remito.idRemito : selected[0].idRemito)]);
        break;
      }
      case 'Clientes': {
        this.router.navigate(['clientes/' + selected[0].idCliente]);
        break;
      }
      case 'Hojas de Ruta': {
        this.router.navigate(['hojasderuta/hoja/' + selected[0].idHojaDeRuta]);
        break;
      }
      default: {
        const defaultMessage = "Aun no está resuelta la opcion " + this.tipoReporteSeleccionado.nombre;
        console.log(defaultMessage);
        this.toastService.presentToast(defaultMessage);
        break;
      }
    }
  }

  getBusqueda(ev: any) {
    let val = ev.target.value.toLowerCase();
    console.log(val)
    // get the amount of columns in the table
    let colsAmt = this.columns.length;
    // get the key names of each column in the dataset
    let keys = Object.keys(this.rows[0]);
    console.log(this.rows[0])
    console.log(keys)
    // assign filtered matches to the active datatable
    this.rows = this.filteredData.filter(function (item) {
      // iterate through each row's column data
      for (let i = 0; i < colsAmt; i++) {
        // check for a match
        if (item[keys[i]].toString().toLowerCase().indexOf(val) !== -1 || !val) {
          // found match, return true to add to result set
          return true;
        }
      }
    });
    // whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }


}
