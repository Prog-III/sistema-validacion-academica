import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  ResultadoEvaluacion,
  InvitacionEvaluar,
} from '../models';
import {ResultadoEvaluacionRepository} from '../repositories';

export class ResultadoEvaluacionInvitacionEvaluarController {
  constructor(
    @repository(ResultadoEvaluacionRepository)
    public resultadoEvaluacionRepository: ResultadoEvaluacionRepository,
  ) { }

  @get('/resultado-evaluacions/{id}/invitacion-evaluar', {
    responses: {
      '200': {
        description: 'InvitacionEvaluar belonging to ResultadoEvaluacion',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(InvitacionEvaluar)},
          },
        },
      },
    },
  })
  async getInvitacionEvaluar(
    @param.path.number('id') id: typeof ResultadoEvaluacion.prototype.id,
  ): Promise<InvitacionEvaluar> {
    return this.resultadoEvaluacionRepository.resultado_evaluacion_pertenece_a_invitacion_evaluar(id);
  }
}
