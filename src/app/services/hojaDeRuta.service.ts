/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { Producto } from '../models/producto.models';
import { Usuario } from '../models/usuario.models';
import { Storage } from '@ionic/storage-angular';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from './authentication.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HojaDeRuta } from '../models/hojaDeRuta.models';



const producto1 = {
    idProducto: 1,
    nombre: 'ventilador',
    precio_unitario: 3100,
    descripcion: 'ventila bien',
    url_imagen: 'https://photo',
    esPrincipal: true
};

const email1 = {
    id_email: 1,
    direccion: 'Viamonte, 3096',
    esPrincipal: 'string'//revisar en el modelo, debería ser boolean
};

const telefono1 = {
    id_telefono: 1,
    telefono: '44558822',
    esPrincipal: 'true'
};

const contacto1 = {
    id_contacto: 1,
    nombre: 'fulano',
    apellido: 'de tal',
    emails: [email1],
    telefonos: telefono1
};

const disponibilidad1 = {
    idDisponibilidad: 1,
    diaSemana: {
        id_dia_semana: 1,
        diaSemana: 'Lunes',
    },
    hora_apertura: '9',
    hora_cierre: '18'
};

const disponibilidad2 = {
    idDisponibilidad: 2,
    diaSemana: {
        id_dia_semana: 2,
        diaSemana: 'Martes',
    },
    hora_apertura: '9',
    hora_cierre: '18'
};

const direccion1 = {
    call: '25 de Mayo',
    altura: 100,
    localidad: 'San Martin',
    provincia: 'Buenos Aires',
    latitud: 0.0,
    longitud: 0.0,
};

const direccion2 = {
    call: '25 de Mayo',
    altura: 300,
    localidad: 'San Martin',
    provincia: 'Buenos Aires',
    latitud: 0.0,
    longitud: 0.0,
};

const usuario1 = {
    nombre: 'Homero',
    apellido: 'Simpson',
    username: 'homer',
    password: 'abcd1',
    email: 'homer@mail.com',
};

const cliente1 = {
    idCliente: 1,
    nombre: 'Bart',
    observaciones: 'Nada aun',
    cuit: '27-45213321-5',
    promedio_espera: 32,
    activo: true,
    propietario: usuario1,
    direccion: direccion1,
    disponibilidades: [disponibilidad1, disponibilidad2],
    contactos: [contacto1]
};

const remito1 = {
    idRemito: 1,
    fechaDeCreacion: new Date(),
    total: 2500,
    motivo: '',
    tiempo_espera: 0,
    cliente: cliente1,
    estado: {
        id_estado: 2,
        nombre: 'pending',
        tipo: 'remito',
    },
    productos: [producto1],
    comprobante: null,//ComprobanteEntrega,
    cantidadDeItems: 10,
};
// remito 2
const producto2 = {
    idProducto: 2,
    nombre: 'Smart TV 40 ',
    precio_unitario: 63100,
    descripcion: 'Oferta de mundial',
    url_imagen: 'https://photo2',
    esPrincipal: true
};

const email2 = {
    id_email: 2,
    direccion: 'Coronel Molinedo, 1900',
    esPrincipal: 'string'//revisar en el modelo, debería ser boolean
};

const telefono2 = {
    id_telefono: 2,
    telefono: '77558822',
    esPrincipal: 'true'
};

const contacto2 = {
    id_contacto: 2,
    nombre: 'fulano',
    apellido: 'de tal',
    emails: [email2],
    telefonos: telefono2
};

const disponibilidad3 = {
    idDisponibilidad: 3,
    diaSemana: {
        id_dia_semana: 1,
        diaSemana: 'Lunes',
    },
    hora_apertura: '9',
    hora_cierre: '18'
};

const disponibilidad4 = {
    idDisponibilidad: 4,
    diaSemana: {
        id_dia_semana: 2,
        diaSemana: 'Martes',
    },
    hora_apertura: '9',
    hora_cierre: '18'
};

const direccion3 = {
    call: '25 de Mayo',
    altura: 800,
    localidad: 'San Martin',
    provincia: 'Buenos Aires',
    latitud: 0.0,
    longitud: 0.0,
};

const direccion4 = {
    call: '25 de Mayo',
    altura: 900,
    localidad: 'San Martin',
    provincia: 'Buenos Aires',
    latitud: 0.0,
    longitud: 0.0,
};

// const usuario1 = {
//     nombre: 'Homero',
//     apellido: 'Simpson',
//     username: 'homer',
//     password: 'abcd1',
//     email: 'homer@mail.com',
// };

const cliente2 = {
    idCliente: 2,
    nombre: 'Lisa',
    observaciones: 'Nada aun',
    cuit: '21-45213321-2',
    promedio_espera: 12,
    activo: true,
    propietario: usuario1,
    direccion: direccion3,
    disponibilidades: [disponibilidad3, disponibilidad4],
    contactos: [contacto2]
};

const remito2 = {
    idRemito: 2,
    fechaDeCreacion: new Date(),
    total: 500500,
    motivo: '',
    tiempo_espera: 0,
    cliente: cliente2,
    estado: {
        id_estado: 2,
        nombre: 'pending',
        tipo: 'remito',
    },
    productos: [producto2],
    comprobante: null,//ComprobanteEntrega,
    cantidadDeItems: 10,
};
/***************** */
// remito 3
const producto3 = {
    idProducto: 3,
    nombre: 'Cajon de Quilmes ',
    precio_unitario: 63100,
    descripcion: 'Oferta de mundial también',
    url_imagen: 'https://photo2',
    esPrincipal: true
};

const email3 = {
    id_email: 3,
    direccion: 'José Ignacio Rucci, 1783',
    esPrincipal: 'string'//revisar en el modelo, debería ser boolean
};

const telefono3 = {
    id_telefono: 3,
    telefono: '1599558822',
    esPrincipal: 'true'
};

const contacto3 = {
    id_contacto: 3,
    nombre: 'Mengano',
    apellido: 'de tal',
    emails: [email3],
    telefonos: telefono3
};

const disponibilidad5 = {
    idDisponibilidad: 5,
    diaSemana: {
        id_dia_semana: 1,
        diaSemana: 'Lunes',
    },
    hora_apertura: '9',
    hora_cierre: '18'
};

const disponibilidad6 = {
    idDisponibilidad: 6,
    diaSemana: {
        id_dia_semana: 2,
        diaSemana: 'Martes',
    },
    hora_apertura: '9',
    hora_cierre: '20'
};

const direccion5 = {
    call: '25 de Mayo',
    altura: 1100,
    localidad: 'San Martin',
    provincia: 'Buenos Aires',
    latitud: 0.0,
    longitud: 0.0,
};

const direccion6 = {
    call: '25 de Mayo',
    altura: 1200,
    localidad: 'San Martin',
    provincia: 'Buenos Aires',
    latitud: 0.0,
    longitud: 0.0,
};

// const usuario1 = {
//     nombre: 'Homero',
//     apellido: 'Simpson',
//     username: 'homer',
//     password: 'abcd1',
//     email: 'homer@mail.com',
// };

const cliente3 = {
    idCliente: 3,
    nombre: 'Lisa',
    observaciones: 'Nada aun',
    cuit: '21-45213321-2',
    promedio_espera: 12,
    activo: true,
    propietario: usuario1,
    direccion: direccion4,
    disponibilidades: [disponibilidad5, disponibilidad6],
    contactos: [contacto3]
};

const remito3 = {
    idRemito: 3,
    fechaDeCreacion: new Date(),
    total: 10000,
    motivo: '',
    tiempo_espera: 0,
    cliente: cliente3,
    estado: {
        id_estado: 2,
        nombre: 'pending',
        tipo: 'remito',
    },
    productos: [producto3],
    comprobante: null,//ComprobanteEntrega,
    cantidadDeItems: 10,
};

const hojaDeRuta1 = {
    id_hoja_de_ruta: 1,
    // fecha_hora_inicio: Date(),//'asdasd',//new ,
    // fecha_hora_fin: Date(),//'asdsd',//new Date(),
    kms_recorridos: 50,
    justificacion: '',
    estado: {
        id_estado: 1,
        nombre: 'pending',
        tipo: 'hojaDeRuta',
    },
    remitos: [remito1, remito2, remito3],
};


/* Servicios */
@Injectable({
    providedIn: 'root'
})

export class HojaDeRutaService {

    idUsuario: number;
    url = environment.apiUrl + '/producto';

    constructor(private http: HttpClient, private authService: AuthenticationService) {
        this.authService.loadsData();
        const user = this.authService.getUser();
        this.idUsuario = JSON.parse(user).idUsuario;
    }

    async getAll(){
        return [hojaDeRuta1];
    }


    //   async getAll(): Promise<Producto[]> {
    //     return await this.http.get<Producto[]>(this.url + '/all/' + this.idUsuario).toPromise();
    //   }

    //   async get(id: string): Promise<Producto> {
    //     // Esto va a variar dependiendo del usuario logeado
    //     const headers = new HttpHeaders({
    //       usuario: 'homer',
    //       password: 'abcd1'
    //     });

    //     return await this.http.get<Producto>(this.url+ '/' + id, {headers}).toPromise();
    //   }

    //   async create(id: string, producto: Producto): Promise<Producto> {
    //     // Esto va a variar dependiendo del usuario logeado
    //     const headers = new HttpHeaders({
    //       usuario: 'homer',
    //       password: 'abcd1',
    //       contentType: 'application/json',
    //     });
    //     return await this.http.post<Producto>(this.url, producto, {headers}).toPromise();
    //   }

    //   async update(id: string, producto: Producto): Promise<Producto> {
    //     // Esto va a variar dependiendo del usuario logeado
    //     const headers = new HttpHeaders({
    //       usuario: 'homer',
    //       password: 'abcd1',
    //       contentType: 'application/json',
    //     });
    //     return await this.http.put<Producto>(this.url, producto, {headers}).toPromise();
    //   }

    //   async delete(id: string): Promise<Producto> {// por ahora es put pero en el futuro debería ser delete
    //     // Esto va a variar dependiendo del usuario logeado
    //     const headers = new HttpHeaders({
    //       usuario: 'homer',
    //       password: 'abcd1',
    //     });
    //     return await this.http.delete<Producto>(this.url+ '/' + id, {headers}).toPromise();
    //   }

    //   // async usr(): Promise<Usuario> {
    //   //   return await this.storage.get('Usuario');
    //   // }
}
