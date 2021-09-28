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
  Modalidad,
  Solicitud,
} from '../models';
import {ModalidadRepository} from '../repositories';

export class ModalidadSolicitudController {
  constructor(
    @repository(ModalidadRepository) protected modalidadRepository: ModalidadRepository,
  ) { }

  @get('/modalidads/{id}/solicituds', {
    responses: {
      '200': {
        description: 'Array of Modalidad has many Solicitud',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Solicitud)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Solicitud>,
  ): Promise<Solicitud[]> {
    return this.modalidadRepository.solicitudes(id).find(filter);
  }

  @post('/modalidads/{id}/solicituds', {
    responses: {
      '200': {
        description: 'Modalidad model instance',
        content: {'application/json': {schema: getModelSchemaRef(Solicitud)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Modalidad.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Solicitud, {
            title: 'NewSolicitudInModalidad',
            exclude: ['id'],
            optional: ['id_modalidad']
          }),
        },
      },
    }) solicitud: Omit<Solicitud, 'id'>,
  ): Promise<Solicitud> {
    return this.modalidadRepository.solicitudes(id).create(solicitud);
  }

  @patch('/modalidads/{id}/solicituds', {
    responses: {
      '200': {
        description: 'Modalidad.Solicitud PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Solicitud, {partial: true}),
        },
      },
    })
    solicitud: Partial<Solicitud>,
    @param.query.object('where', getWhereSchemaFor(Solicitud)) where?: Where<Solicitud>,
  ): Promise<Count> {
    return this.modalidadRepository.solicitudes(id).patch(solicitud, where);
  }

  @del('/modalidads/{id}/solicituds', {
    responses: {
      '200': {
        description: 'Modalidad.Solicitud DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Solicitud)) where?: Where<Solicitud>,
  ): Promise<Count> {
    return this.modalidadRepository.solicitudes(id).delete(where);
  }
}
