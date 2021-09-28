import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Recordatorio,
  InvitacionEvaluar,
} from '../models';
import {RecordatorioRepository} from '../repositories';

export class RecordatorioInvitacionEvaluarController {
  constructor(
    @repository(RecordatorioRepository)
    public recordatorioRepository: RecordatorioRepository,
  ) { }

  @get('/recordatorios/{id}/invitacion-evaluar', {
    responses: {
      '200': {
        description: 'InvitacionEvaluar belonging to Recordatorio',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(InvitacionEvaluar)},
          },
        },
      },
    },
  })
  async getInvitacionEvaluar(
    @param.path.number('id') id: typeof Recordatorio.prototype.id,
  ): Promise<InvitacionEvaluar> {
    return this.recordatorioRepository.recordatorio_pertenece_a_invitacion_evaluar(id);
  }
}
