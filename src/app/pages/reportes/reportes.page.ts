import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Producto } from 'src/app/models/producto.models';
import { LoadingService } from 'src/app/services/loading.service';
import { ProductoService } from 'src/app/services/producto.service';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.page.html',
  styleUrls: ['./reportes.page.scss'],
  /** Permite stylizar con styles de ngx-datatables*/
  encapsulation: ViewEncapsulation.None 
})
export class ReportesPage implements OnInit {

  public columns: any;
  public rows: any;

  constructor(
    private loading: LoadingService,
    private productosServices: ProductoService
  ) { }

  ngOnInit() {
    this.loading.present('Cargando...');
    this.columns = [
      { prop: 'idProducto', name: 'Id' },
      { prop: 'nombre', name: 'Nombre' },
      { prop: 'precio_unitario', name: 'Precio' }
    ];
    
    this.productosServices.getAll().then(
      (productos: Producto[]) => {
        console.log(productos);
        this.rows = productos
      }
    ).catch((e) => {
      console.error(e)
    });
    this.loading.dismiss();
  }

}
