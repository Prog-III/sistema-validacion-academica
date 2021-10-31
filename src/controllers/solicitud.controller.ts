import {inject, service} from '@loopback/core';
import {NotificacionCorreo} from '../models/notificacion-correo.model';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';

import {NotificacionesService} from '../services';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Solicitud} from '../models';
import {SolicitudRepository, SolicitudProponenteRepository} from '../repositories';

export class SolicitudController {
  constructor(
    @repository(SolicitudRepository)
    public solicitudRepository : SolicitudRepository,

    @repository(SolicitudProponenteRepository)
    public solicitudproponenteRepository : SolicitudProponenteRepository,

    @service(NotificacionesService)
    public servicioNotificaciones: NotificacionesService
  ) {}

  @post('/solicitudes')
  @response(200, {
    description: 'Solicitud model instance',
    content: {'application/json': {schema: getModelSchemaRef(Solicitud)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Solicitud, {
            title: 'NewSolicitud',
            exclude: ['id'],
          }),
        },
      },


    })
    solicitud: Omit<Solicitud, 'id'>,
  ): Promise<Solicitud> {

    let solicitudAntigua = await this.solicitudRepository.findOne({
      where: {
        nombre_trabajo: solicitud.nombre_trabajo,
        id_linea_investigacion: solicitud.id_linea_investigacion,
        id_modalidad: solicitud.id_modalidad
      },
    })
    if(solicitudAntigua){
      solicitud.id_estado = solicitudAntigua.id_estado;

      if(solicitudAntigua.coincidencias){
        solicitud.coincidencias = solicitudAntigua.id + ", " + solicitudAntigua.coincidencias;
      }
      else{
        solicitud.coincidencias = String(solicitudAntigua.id);
      }
    }


    return this.solicitudRepository.create(solicitud);
  }

  @get('/solicitudes/count')
  @response(200, {
    description: 'Solicitud model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Solicitud) where?: Where<Solicitud>,
  ): Promise<Count> {
    return this.solicitudRepository.count(where);
  }

  @get('/solicitudes')
  @response(200, {
    description: 'Array of Solicitud model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Solicitud, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Solicitud) filter?: Filter<Solicitud>,
  ): Promise<Solicitud[]> {
    return this.solicitudRepository.find(filter);
  }

  @patch('/solicitudes')
  @response(200, {
    description: 'Solicitud PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Solicitud, {partial: true}),
        },
      },
    })
    solicitud: Solicitud,
    @param.where(Solicitud) where?: Where<Solicitud>,
  ): Promise<Count> {
    return this.solicitudRepository.updateAll(solicitud, where);
  }

  @get('/solicitudes/{id}')
  @response(200, {
    description: 'Solicitud model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Solicitud, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Solicitud, {exclude: 'where'}) filter?: FilterExcludingWhere<Solicitud>
  ): Promise<Solicitud> {
    return this.solicitudRepository.findById(id, filter);
  }

  @patch('/solicitudes/{id}')
  @response(204, {
    description: 'Solicitud PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Solicitud, {partial: true}),
        },
      },
    })
    solicitud: Solicitud,
  ): Promise<void> {
    await this.solicitudRepository.updateById(id, solicitud);
  }

  @put('/solicitudes/{id}')
  @response(204, {
    description: 'Solicitud PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() solicitud: Solicitud,
  ): Promise<void> {
    await this.solicitudRepository.replaceById(id, solicitud);
  }

  @del('/solicitudes/{id}')
  @response(204, {
    description: 'Solicitud DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.solicitudRepository.deleteById(id);
  }
}
