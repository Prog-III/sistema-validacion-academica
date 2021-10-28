import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Configuracion} from '../llaves/configuracion';
import {NotificacionCorreo} from '../models/notificacion-correo.model';
import {NotificacionSms} from '../models/notificacion-sms.model';
import {CorreoNotificacionRepository} from '../repositories/correo-notificacion.repository';
const fetch = require('node-fetch');

require('dotenv').config();

@injectable({scope: BindingScope.TRANSIENT})
export class NotificacionesService {
  constructor(
    @repository(CorreoNotificacionRepository)
    private correoNotificacionRepository: CorreoNotificacionRepository
  ) { }

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

  async NotificarCorreosNotificacion(asunto: string, saludo: string, mensaje: string) {
    const correosNotificacion = await this.correoNotificacionRepository.find()

    correosNotificacion.forEach(correoNotificacion => {
      const url = `${Configuracion.urlCorreo}?${Configuracion.destinoArg}=${correoNotificacion.correo}&${Configuracion.asuntoArg}=${asunto}&${Configuracion.saludoArg}=${saludo}&${Configuracion.mensajeArg}=${mensaje}&${Configuracion.hashArg}=${Configuracion.hasNotificacion}`
      fetch(url)
        .then((res: any) => {
          console.log(res.text())
        })
    })
  }
}
