import {authenticate} from '@loopback/authentication';
import {
  repository
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef, param
} from '@loopback/rest';
import {
  LineaInvestigacion, Solicitud
} from '../models';
import {SolicitudRepository} from '../repositories';

@authenticate('admin')
export class SolicitudLineaInvestigacionController {
  constructor(
    @repository(SolicitudRepository)
    public solicitudRepository: SolicitudRepository,
  ) { }

  @authenticate('admin', 'auxiliar')
  @get('/solicituds/{id}/linea-investigacion', {
    responses: {
      '200': {
        description: 'LineaInvestigacion belonging to Solicitud',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(LineaInvestigacion)},
          },
        },
      },
    },
  })
  async getLineaInvestigacion(
    @param.path.number('id') id: typeof Solicitud.prototype.id,
  ): Promise<LineaInvestigacion> {
    return this.solicitudRepository.linea_investigacion_pertenece_a_solicitud(id);
  }
}
