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
  InvitacionEvaluar, Solicitud
} from '../models';
import {SolicitudRepository} from '../repositories';

export class SolicitudInvitacionEvaluarController {
  constructor(
    @repository(SolicitudRepository) protected solicitudRepository: SolicitudRepository,
  ) { }

  @get('/solicituds/{id}/invitacion-evaluars', {
    responses: {
      '200': {
        description: 'Array of Solicitud has many InvitacionEvaluar',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(InvitacionEvaluar)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<InvitacionEvaluar>,
  ): Promise<InvitacionEvaluar[]> {
    return this.solicitudRepository.invitacionesEvaluar(id).find(filter);
  }

  @post('/solicituds/{id}/invitacion-evaluars', {
    responses: {
      '200': {
        description: 'Solicitud model instance',
        content: {'application/json': {schema: getModelSchemaRef(InvitacionEvaluar)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Solicitud.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(InvitacionEvaluar, {
            title: 'NewInvitacionEvaluarInSolicitud',
            exclude: ['id'],
            optional: ['id_solicitud']
          }),
        },
      },
    }) invitacionEvaluar: Omit<InvitacionEvaluar, 'id'>,
  ): Promise<InvitacionEvaluar> {
    return this.solicitudRepository.invitacionesEvaluar(id).create(invitacionEvaluar);
  }

  @patch('/solicituds/{id}/invitacion-evaluars', {
    responses: {
      '200': {
        description: 'Solicitud.InvitacionEvaluar PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(InvitacionEvaluar, {partial: true}),
        },
      },
    })
    invitacionEvaluar: Partial<InvitacionEvaluar>,
    @param.query.object('where', getWhereSchemaFor(InvitacionEvaluar)) where?: Where<InvitacionEvaluar>,
  ): Promise<Count> {
    return this.solicitudRepository.invitacionesEvaluar(id).patch(invitacionEvaluar, where);
  }

  @del('/solicituds/{id}/invitacion-evaluars', {
    responses: {
      '200': {
        description: 'Solicitud.InvitacionEvaluar DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(InvitacionEvaluar)) where?: Where<InvitacionEvaluar>,
  ): Promise<Count> {
    return this.solicitudRepository.invitacionesEvaluar(id).delete(where);
  }
}
