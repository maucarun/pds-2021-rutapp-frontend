import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { Usuario } from 'src/app/models/usuario.models';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoutificService } from 'src/app/services/routific.service';
import { HojaDeRutaService } from 'src/app/services/hojaDeRuta.service';
import { RutaDeNavegacion } from 'src/app/models/routific.models';
import { EntregaComponent } from 'src/app/component/entrega/entrega.component';
import { RemitoService } from 'src/app/services/remito.service';
import { HojaDeRuta } from 'src/app/models/hojaDeRuta.models';
import { ToastService } from 'src/app/services/toast.service';


declare var google: any

@Component({
  selector: 'app-hoja-de-ruta-view',
  templateUrl: './hoja-de-ruta-view.page.html',
  styleUrls: ['./hoja-de-ruta-view.page.scss'],
})
export class HojaDeRutaViewPage implements OnInit {
  map: any
  @ViewChild("map", { read: ElementRef, static: false }) mapRef: ElementRef
  @ViewChild("btnnav", { read: ElementRef, static: false }) btnnavRef: ElementRef
  infoWindows: any = []
  markers: any = []
  directionsService: any = {}
  directionsDisplay: any = {}

  hojaForm: FormGroup;
  hojaSubmit: HojaDeRuta;
  rutaNavigation: RutaDeNavegacion
  idHoja: string;
  hoja: HojaDeRuta;
  user: Usuario;
  proximaVisita: string = ''

  viewMode = false
  editMode = false;
  createMode = false;

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private hojaSev: HojaDeRutaService,
    private authService: AuthenticationService,
    private rtoService: RemitoService,
    private alertCtrl: AlertController,
    private servicioRuta: RoutificService,
    private modalCtrl: ModalController,
    private toastService: ToastService,
  ) { }

  async ngOnInit() {
    this.user = this.authService.getUsuario();
    this.directionsService = new google.maps.DirectionsService()
    this.directionsDisplay = new google.maps.DirectionsRenderer()

    this.hojaForm = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      calle: ['', [Validators.required]],
      altura: ['', [Validators.required]],
      localidad: ['', [Validators.required]]
    });

    /* Verificando si la página tiene id */

    this.activatedRoute.paramMap.subscribe(async paramMap => {
      this.idHoja = paramMap.get('idHojaDeRuta');
      this.editMode = this.router.url.includes('/hojasderuta/editar/');

      if (this.idHoja) {
        /* Como tiene id, completo el formulario con los datos del BE */
        try {
          this.hoja = await this.hojaSev.get(this.idHoja)
        } catch (error) {
          console.log("Ha ocurrido un error cargando la hoja de ruta, reintente.")
        }

        if (this.editMode) {

          //Habilito las propiedades para editar en el formulario
          console.log('Como está en modo edición, completo el formulario con los datos del BE ');
          await this.cambiarWebEstado(false, true, false);
          this.hojaForm.patchValue(this.hojaSubmit)
        } else {

          //Habilito las propiedades ver en el formulario
          console.log('Como está en modo vista, completo el formulario con los datos del BE ');
          await this.cambiarWebEstado(true, false, false);
          await this.inicializacion();
        }
      } else {

        //Habilito las propiedades para crear en el formulario
        console.log('Como está en modo creación, dejo el formulario vacío');
        await this.cambiarWebEstado(false, false, true);
      }
    });
  }

  async cambiarWebEstado(view: boolean, edit: boolean, create: boolean) {
    this.viewMode = view;
    this.editMode = edit;
    this.createMode = create;
  }

  async ionViewWillEnter() {
   await this.inicializacion();
  }

  async inicializacion() {
    if (!this.hoja || (this.hoja.estado.nombre.toLowerCase() !== 'en curso' && this.hoja.estado.nombre.toLowerCase() !== 'pendiente')) {
      this.alert('No hay una hoja de ruta o el estado no es en curso y no es pendiente', 'Error: Sin hoja de ruta');
    }

    await this.servicioRuta.get(this.hoja).then((data: RutaDeNavegacion) => {
      this.rutaNavigation = data
    }).catch((err) => { 
      console.log(err);
      this.toastService.presentToast(err.error.message);
    })

    if (!this.rutaNavigation) {
      this.toastService.presentToast("No hay visitas disponibles para hoy");
      return
    }

    this.proximaVisita = this.rutaNavigation.proximaVisita.nombre + ' (' + this.rutaNavigation.proximaVisita.direccion + ')'
    this.addMarkersToMap(this.rutaNavigation)
    this.showMap()
  }

  showMap() {
    const location = new google.maps.LatLng(this.rutaNavigation.posicionInicial.lat, this.rutaNavigation.posicionInicial.lng)
    const options = {
      center: location,
      zoom: 15,
      disableDefaultUI: true
    }
    if (this.mapRef === null)
      return
    else {
      this.map = new google.maps.Map(this.mapRef.nativeElement, options)
       this.directionsDisplay.setMap(this.map)
       const inicio = location
       const final = new google.maps.LatLng(this.rutaNavigation.proximaVisita.posicion.lat, this.rutaNavigation.proximaVisita.posicion.lng)
       this.addMarkersToMap(this.rutaNavigation)
       this.calculateAndDisplayRoute(inicio, final)
    }

  }

  addMarkersToMap(ruta: RutaDeNavegacion) {
    for (let marker of ruta.visitas) {
      let position = new google.maps.LatLng(marker.posicion.lat, marker.posicion.lng)
      let mapMarker = new google.maps.Marker({
        position: position,
        title: marker.nombre,
        latitude: marker.posicion.lat,
        longitude: marker.posicion.lng
      })
      mapMarker.setMap(this.map)
      this.addInfoWindowsToMarker(mapMarker);
    }
  }

  addInfoWindowsToMarker(marker) {
    let infoWindowContent = '<div id="content">' +
      '<h2 id="firstHeading" class="firstHeading">' +
      marker.title + '</h2>' +
      '<p>Latitud: ' + marker.latitude + '</p>' +
      '<p>Longitud: ' + marker.longitude + '</p>' +
      '</div>'
    let infoWindow = new google.maps.InfoWindow({
      content: infoWindowContent
    })

    marker.addListener('click', () => {
      this.closeAllInfoWindows()
      infoWindow.open(this.map, marker)
      this.infoWindows.push(infoWindow)
    })
  }

  closeAllInfoWindows() {
    for (let windows of this.infoWindows) {
      windows.close()
    }
  }

  calculateAndDisplayRoute(start, end) {
    this.directionsService.route({
      origin: start,
      destination: end,
      travelMode: google.maps.TravelMode.DRIVING
    }, (response, status) => {
      if (status === 'OK') {
        this.directionsDisplay.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }

  async navegarClick() {
    window.open('https://www.google.com/maps/dir/?api=1&destination=' +
      this.rutaNavigation.proximaVisita.posicion.lat + ',' +
      this.rutaNavigation.proximaVisita.posicion.lng)
    await this.enviarRemito();
    await this.mostrarModalEntrega()
  }

  async mostrarModalEntrega() {
    const modal = await this.modalCtrl.create({
      component: EntregaComponent,
      backdropDismiss: false,
      componentProps: {
        visita: this.rutaNavigation.proximaVisita
      }
    });

    await modal.present();
    await modal.onWillDismiss().then(async (respuestaModal: any) => {
      if (respuestaModal.role === 'cancelado') {
        console.log('modalentrega cancelado')
        console.log(respuestaModal.data)
        let rto = await this.rtoService.get(this.rutaNavigation.proximaVisita.remito.idRemito + "")
        rto.estado = { "tipo": "Remito", "id_estado": 5, "nombre": "Cancelado" }
        rto.motivo = respuestaModal.data.motivo
        delete rto.comprobante;
        await this.rtoService.actualizarRemito(rto)
      }
      if (respuestaModal.role === 'entregado') {
        console.log('modalentrega entregado')
        console.log(respuestaModal.data)
        const finEntrega = new Date()
        let rto = await this.rtoService.get(this.rutaNavigation.proximaVisita.remito.idRemito + "")
        rto.tiempo_espera = finEntrega.getTime() - (respuestaModal.data.horaInicio as Date).getTime()
        rto.comprobante = respuestaModal.data.comprobante
        rto.estado = { "tipo": "Remito", "id_estado": 7, "nombre": "Entregado" }
        await this.rtoService.actualizarRemito(rto)
      }
      this.hoja = await this.hojaSev.get(this.idHoja)
      await this.inicializacion()
    });

  }

  async alert(message: string, titulo: string) {
    const alert = await this.alertCtrl.create({
      header: titulo,
      message: message,
      buttons: [
        {
          text: 'Aceptar',
          role: 'cancel'
        }
      ]
    });
    await alert.present();
  }

  async enviarRemito() {
    const idRemito = this.rutaNavigation.proximaVisita.remito.idRemito;
    await this.rtoService.enviarRemito(idRemito);
  }
}

interface Marker {
  lat: number
  lng: number
}

interface Location {
  latitude: number
  longitude: number
  mapType: string
  zoom: number
  marker: Marker
}
