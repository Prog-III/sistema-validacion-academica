import {authenticate} from '@loopback/authentication';
import {
  repository
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef, param
} from '@loopback/rest';
import {
  Departamento,
  Facultad
} from '../models';
import {DepartamentoRepository} from '../repositories';

@authenticate('admin')
export class DepartamentoFacultadController {
  constructor(
    @repository(DepartamentoRepository)
    public departamentoRepository: DepartamentoRepository,
  ) { }

  @authenticate('admin', 'auxiliar')
  @get('/departamentos/{id}/facultad', {
    responses: {
      '200': {
        description: 'Facultad belonging to Departamento',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Facultad)},
          },
        },
      },
    },
  })
  async getFacultad(
    @param.path.number('id') id: typeof Departamento.prototype.id,
  ): Promise<Facultad> {
    return this.departamentoRepository.pertenece_a(id);
  }
}
