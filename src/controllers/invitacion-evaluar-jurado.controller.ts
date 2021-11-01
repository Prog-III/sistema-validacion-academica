import {authenticate} from '@loopback/authentication';
import {
  repository
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef, param
} from '@loopback/rest';
import {
  InvitacionEvaluar,
  Jurado
} from '../models';
import {InvitacionEvaluarRepository} from '../repositories';

@authenticate('admin', 'auxiliar', 'evaluador')
export class InvitacionEvaluarJuradoController {
  constructor(
    @repository(InvitacionEvaluarRepository)
    public invitacionEvaluarRepository: InvitacionEvaluarRepository,
  ) { }

  @get('/invitacion-evaluars/{id}/jurado', {
    responses: {
      '200': {
        description: 'Jurado belonging to InvitacionEvaluar',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Jurado)},
          },
        },
      },
    },
  })
  async getJurado(
    @param.path.number('id') id: typeof InvitacionEvaluar.prototype.id,
  ): Promise<Jurado> {
    return this.invitacionEvaluarRepository.invitacion_evaluar_pertenece_a_jurado(id);
  }
}
