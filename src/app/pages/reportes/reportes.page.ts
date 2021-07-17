import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Producto } from 'src/app/models/producto.models';
import { LoadingService } from 'src/app/services/loading.service';
import { ProductoService } from 'src/app/services/producto.service';
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
    private productosServices: ProductoService,
    private toastService: ToastService,
  ) { }

  ngOnInit() { }

  async seleccionarReporte($event) {
    const opcionSeleccionada = $event.target.value;
    
    if(opcionSeleccionada == "")
    return;
    
    switch (opcionSeleccionada) {
      case 'Productos': {
        this.loading.present('Cargando...');

        this.columns = this.columnasProducto;

        await this.productosServices.getAll().then(
          (productos: Producto[]) => {
            console.log(productos);
            this.rows = productos
          }
        ).catch((err) => {
          console.error(err.error.message);
          this.toastService.presentToast(err.error.message);
        });
        
        this.reporteSeleccionado = opcionSeleccionada;
        this.loading.dismiss();
        break;
      }
      default: {
        console.log("Aun no está resuelta la opcion " + opcionSeleccionada);
        this.reporteSeleccionado = null;
        break;
      }
    }
  }

  columnasProducto = [
    { prop: 'idProducto', name: 'Id' },
    { prop: 'nombre', name: 'Nombre' },
    { prop: 'precio_unitario', name: 'Precio' }
  ];

}
