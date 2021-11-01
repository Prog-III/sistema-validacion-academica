import {authenticate} from '@loopback/authentication';
import {
  Filter,
  repository
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef, param, post,
  requestBody,
  response
} from '@loopback/rest';
import {
  ArregloGeneral, Departamento, Proponente, ProponenteDepartamento
} from '../models';
import {DepartamentoRepository, ProponenteDepartamentoRepository} from '../repositories';

@authenticate('admin')
export class DepartamentoProponenteController {
  constructor(
    @repository(DepartamentoRepository) protected departamentoRepository: DepartamentoRepository,
    @repository(ProponenteDepartamentoRepository) protected proponentedepartamentoRepository: ProponenteDepartamentoRepository
  ) { }

  @authenticate('admin', 'auxiliar')
  @get('/departamentos/{id}/proponentes', {
    responses: {
      '200': {
        description: 'Array of departamentos has many proponente through DepartamentoProponente',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Proponente)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Proponente>,
  ): Promise<Proponente[]> {
    return this.departamentoRepository.proponentes(id).find(filter);
  }

  @post('/departamento-proponente', {
    responses: {
      '200': {
        description: 'create a instance of proponente with a departamento',
        content: {'application/json': {schema: getModelSchemaRef(ProponenteDepartamento)}},
      },
    },
  })
  async createRelation(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProponenteDepartamento, {
            title: 'NewProponenteWithDepartamento',
            exclude: ['id'],
          }),
        },
      },
    }) datos: Omit<ProponenteDepartamento, 'id'>,
  ): Promise<ProponenteDepartamento | null> {
    let registro = await this.proponentedepartamentoRepository.create(datos);
    return registro;
  }

  @post('/asociar-departamento-proponentes/{id}', {
    responses: {
      '200': {
        description: 'create a instance of proponente with a departamento',
        content: {'application/json': {schema: getModelSchemaRef(ProponenteDepartamento)}},
      },
    },
  })
  async createRelations(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ArregloGeneral, {}),
        },
      },
    }) datos: ArregloGeneral,
    @param.path.number('id') id_departamento: typeof Departamento.prototype.id
  ): Promise<Boolean> {
    if (datos.array_general.length > 0) {
      datos.array_general.forEach(async (id_proponente: number) => {
        let existe = await this.proponentedepartamentoRepository.findOne({
          where: {
            id_departamento: id_departamento,
            id_proponente: id_proponente
          }
        });
        if (!existe) {
          this.proponentedepartamentoRepository.create({
            id_departamento: id_departamento,
            id_proponente: id_proponente
          });
        }
      });
      return true;
    }
    return false;
  }


  @del('/departamentos/{id_departamento}/{id_proponente}')
  @response(204, {
    description: 'relation DELETE success',
  })
  async EliminarProponentedeSolicitud(
    @param.path.number('id_departamento') id_departamento: number,
    @param.path.number('id_proponente') id_proponente: number): Promise<Boolean> {
    let reg = await this.proponentedepartamentoRepository.findOne({
      where: {
        id_departamento: id_departamento,
        id_proponente: id_proponente
      }
    });
    if (reg) {
      await this.proponentedepartamentoRepository.deleteById(reg.id);
      return true;
    }
    return false;
  }
}
