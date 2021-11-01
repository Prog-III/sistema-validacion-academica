import {authenticate} from '@loopback/authentication';
import {
  repository
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef, param
} from '@loopback/rest';
import {
  Modalidad, Solicitud
} from '../models';
import {SolicitudRepository} from '../repositories';

@authenticate('admin')
export class SolicitudModalidadController {
  constructor(
    @repository(SolicitudRepository)
    public solicitudRepository: SolicitudRepository,
  ) { }

  @authenticate('admin', 'auxiliar')
  @get('/solicituds/{id}/modalidad', {
    responses: {
      '200': {
        description: 'Modalidad belonging to Solicitud',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Modalidad)},
          },
        },
      },
    },
  })
  async getModalidad(
    @param.path.number('id') id: typeof Solicitud.prototype.id,
  ): Promise<Modalidad> {
    return this.solicitudRepository.solicitud_pertenece_a_modalidad(id);
  }
}
