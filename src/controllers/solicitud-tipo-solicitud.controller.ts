import {authenticate} from '@loopback/authentication';
import {
  repository
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef, param
} from '@loopback/rest';
import {
  Solicitud,
  TipoSolicitud
} from '../models';
import {SolicitudRepository} from '../repositories';

@authenticate('admin')
export class SolicitudTipoSolicitudController {
  constructor(
    @repository(SolicitudRepository)
    public solicitudRepository: SolicitudRepository,
  ) { }

  @authenticate('admin', 'auxiliar')
  @get('/solicituds/{id}/tipo-solicitud', {
    responses: {
      '200': {
        description: 'TipoSolicitud belonging to Solicitud',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(TipoSolicitud)},
          },
        },
      },
    },
  })
  async getTipoSolicitud(
    @param.path.number('id') id: typeof Solicitud.prototype.id,
  ): Promise<TipoSolicitud> {
    return this.solicitudRepository.solicitud_pertenece_a_tipo_solicitud(id);
  }
}
