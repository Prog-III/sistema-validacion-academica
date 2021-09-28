import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
  import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
Solicitud,
SolicitudComite,
Comite,
} from '../models';
import {SolicitudRepository} from '../repositories';

export class SolicitudComiteController {
  constructor(
    @repository(SolicitudRepository) protected solicitudRepository: SolicitudRepository,
  ) { }

  @get('/solicituds/{id}/comites', {
    responses: {
      '200': {
        description: 'Array of Solicitud has many Comite through SolicitudComite',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Comite)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Comite>,
  ): Promise<Comite[]> {
    return this.solicitudRepository.comites(id).find(filter);
  }

  @post('/solicituds/{id}/comites', {
    responses: {
      '200': {
        description: 'create a Comite model instance',
        content: {'application/json': {schema: getModelSchemaRef(Comite)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Solicitud.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Comite, {
            title: 'NewComiteInSolicitud',
            exclude: ['id'],
          }),
        },
      },
    }) comite: Omit<Comite, 'id'>,
  ): Promise<Comite> {
    return this.solicitudRepository.comites(id).create(comite);
  }

  @patch('/solicituds/{id}/comites', {
    responses: {
      '200': {
        description: 'Solicitud.Comite PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Comite, {partial: true}),
        },
      },
    })
    comite: Partial<Comite>,
    @param.query.object('where', getWhereSchemaFor(Comite)) where?: Where<Comite>,
  ): Promise<Count> {
    return this.solicitudRepository.comites(id).patch(comite, where);
  }

  @del('/solicituds/{id}/comites', {
    responses: {
      '200': {
        description: 'Solicitud.Comite DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Comite)) where?: Where<Comite>,
  ): Promise<Count> {
    return this.solicitudRepository.comites(id).delete(where);
  }
}
