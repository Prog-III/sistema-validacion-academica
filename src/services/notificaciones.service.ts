import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {Configuracion} from '../llaves/configuracion';
import {NotificacionCorreo} from '../models/notificacion-correo.model';
import {NotificacionSms} from '../models/notificacion-sms.model';
const fetch = require('node-fetch');

require('dotenv').config();

@injectable({scope: BindingScope.TRANSIENT})
export class NotificacionesService {
  constructor(/* Add @inject to inject parameters */) { }

  /*
   * Add service methods here
   */

  EnviarCorreo(datos: NotificacionCorreo) {
    let url = `${Configuracion.urlCorreo}?${Configuracion.destinoArg}=${datos.destinatario}&${Configuracion.asuntoArg}=${datos.asunto}&${Configuracion.saludoArg}=${datos.saludo}&${Configuracion.mensajeArg}=${datos.mensaje}&${Configuracion.hashArg}=${Configuracion.hasNotificacion}`;

    fetch(url)
      .then((res: any) => {
        console.log(res.text())
      })
  }

  EnviarSms(datos: NotificacionSms) {
    let url = `${process.env.urlMensajeTexto}?${process.env.destinoArg}=${datos.destino}&${process.env.mensajeArg}=${datos.mensaje}&${process.env.hashArg}=${process.env.hasNotificacion}`;
    fetch(url)
      .then((res: any) => {
        console.log(res.text())
      })
  }
}
