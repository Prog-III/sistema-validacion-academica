import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
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
import {CorreoNotificacion} from '../models';
import {CorreoNotificacionRepository} from '../repositories';

export class CorreoNotificacionController {
  constructor(
    @repository(CorreoNotificacionRepository)
    public correoNotificacionRepository : CorreoNotificacionRepository,
  ) {}

  @post('/correos-notificaciones')
  @response(200, {
    description: 'CorreoNotificacion model instance',
    content: {'application/json': {schema: getModelSchemaRef(CorreoNotificacion)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CorreoNotificacion, {
            title: 'NewCorreoNotificacion',
            exclude: ['id'],
          }),
        },
      },
    })
    correoNotificacion: Omit<CorreoNotificacion, 'id'>,
  ): Promise<CorreoNotificacion> {
    return this.correoNotificacionRepository.create(correoNotificacion);
  }

  @get('/correos-notificaciones/count')
  @response(200, {
    description: 'CorreoNotificacion model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(CorreoNotificacion) where?: Where<CorreoNotificacion>,
  ): Promise<Count> {
    return this.correoNotificacionRepository.count(where);
  }

  @get('/correos-notificaciones')
  @response(200, {
    description: 'Array of CorreoNotificacion model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(CorreoNotificacion, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(CorreoNotificacion) filter?: Filter<CorreoNotificacion>,
  ): Promise<CorreoNotificacion[]> {
    return this.correoNotificacionRepository.find(filter);
  }

  @patch('/correos-notificaciones')
  @response(200, {
    description: 'CorreoNotificacion PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CorreoNotificacion, {partial: true}),
        },
      },
    })
    correoNotificacion: CorreoNotificacion,
    @param.where(CorreoNotificacion) where?: Where<CorreoNotificacion>,
  ): Promise<Count> {
    return this.correoNotificacionRepository.updateAll(correoNotificacion, where);
  }

  @get('/correos-notificaciones/{id}')
  @response(200, {
    description: 'CorreoNotificacion model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(CorreoNotificacion, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(CorreoNotificacion, {exclude: 'where'}) filter?: FilterExcludingWhere<CorreoNotificacion>
  ): Promise<CorreoNotificacion> {
    return this.correoNotificacionRepository.findById(id, filter);
  }

  @patch('/correos-notificaciones/{id}')
  @response(204, {
    description: 'CorreoNotificacion PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CorreoNotificacion, {partial: true}),
        },
      },
    })
    correoNotificacion: CorreoNotificacion,
  ): Promise<void> {
    await this.correoNotificacionRepository.updateById(id, correoNotificacion);
  }

  @put('/correos-notificaciones/{id}')
  @response(204, {
    description: 'CorreoNotificacion PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() correoNotificacion: CorreoNotificacion,
  ): Promise<void> {
    await this.correoNotificacionRepository.replaceById(id, correoNotificacion);
  }

  @del('/correos-notificaciones/{id}')
  @response(204, {
    description: 'CorreoNotificacion DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.correoNotificacionRepository.deleteById(id);
  }
}
