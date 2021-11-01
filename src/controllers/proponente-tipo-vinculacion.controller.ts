import {authenticate} from '@loopback/authentication';
import {
  repository
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef, param
} from '@loopback/rest';
import {
  Proponente,
  TipoVinculacion
} from '../models';
import {ProponenteRepository} from '../repositories';

@authenticate('admin')
export class ProponenteTipoVinculacionController {
  constructor(
    @repository(ProponenteRepository)
    public proponenteRepository: ProponenteRepository,
  ) { }

  @authenticate('admin', 'auxiliar')
  @get('/proponentes/{id}/tipo-vinculacion', {
    responses: {
      '200': {
        description: 'TipoVinculacion belonging to Proponente',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(TipoVinculacion)},
          },
        },
      },
    },
  })
  async getTipoVinculacion(
    @param.path.number('id') id: typeof Proponente.prototype.id,
  ): Promise<TipoVinculacion> {
    return this.proponenteRepository.tiene_un(id);
  }
}
