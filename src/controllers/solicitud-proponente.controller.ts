import {service} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody
} from '@loopback/rest';
import {
  Proponente, Solicitud
} from '../models';
import {NotificacionCorreo} from '../models/notificacion-correo.model';
import {SolicitudRepository} from '../repositories';
import {NotificacionesService} from '../services';

require('dotenv').config();
export class SolicitudProponenteController {
  constructor(
    @repository(SolicitudRepository) protected solicitudRepository: SolicitudRepository,
    @service(NotificacionesService)
    public servicioNotificaciones: NotificacionesService
  ) { }

  @get('/solicituds/{id}/proponentes', {
    responses: {
      '200': {
        description: 'Array of Solicitud has many Proponente through SolicitudProponente',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Proponente)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Proponente>,
  ): Promise<Proponente[]> {
    return this.solicitudRepository.proponentes(id).find(filter);
  }

  @post('/solicituds/{id}/proponentes', {
    responses: {
      '200': {
        description: 'create a Proponente model instance',
        content: {'application/json': {schema: getModelSchemaRef(Proponente)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Solicitud.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Proponente, {
            title: 'NewProponenteInSolicitud',
            exclude: ['id'],
          }),
        },
      },
    }) proponente: Omit<Proponente, 'id'>,
  ): Promise<Proponente> {
    let ProponenteCreado = await this.solicitudRepository.proponentes(id).create(proponente);
    if (ProponenteCreado) {
      let datos = new NotificacionCorreo();
      datos.destinatario = proponente.email;
      datos.asunto = process.env.asuntoCreacionSolicitud;
      datos.saludo = `${process.env.saludo} ${proponente.primer_nombre}`
      let solicitudregistrada = await this.solicitudRepository.findById(id)
      datos.mensaje = `${process.env.mensajeCreacionSolicitud} ${solicitudregistrada.fecha} ${solicitudregistrada.nombre_trabajo}${solicitudregistrada.id_modalidad} ${solicitudregistrada.comites}${solicitudregistrada.id_linea_investigacion}${solicitudregistrada.archivo}${solicitudregistrada.descripcion}`
      this.servicioNotificaciones.EnviarCorreo(datos)
    }
    return ProponenteCreado
  }

  @patch('/solicituds/{id}/proponentes', {
    responses: {
      '200': {
        description: 'Solicitud.Proponente PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Proponente, {partial: true}),
        },
      },
    })
    proponente: Partial<Proponente>,
    @param.query.object('where', getWhereSchemaFor(Proponente)) where?: Where<Proponente>,
  ): Promise<Count> {
    return this.solicitudRepository.proponentes(id).patch(proponente, where);
  }

  @del('/solicituds/{id}/proponentes', {
    responses: {
      '200': {
        description: 'Solicitud.Proponente DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Proponente)) where?: Where<Proponente>,
  ): Promise<Count> {
    return this.solicitudRepository.proponentes(id).delete(where);
  }
}
