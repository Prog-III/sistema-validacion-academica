import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Comite} from '../models';
import {ComiteRepository} from '../repositories';

export class ComiteController {
  constructor(
    @repository(ComiteRepository)
    public comiteRepository : ComiteRepository,
  ) {}

  @post('/comites')
  @response(200, {
    description: 'Comite model instance',
    content: {'application/json': {schema: getModelSchemaRef(Comite)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Comite, {
            title: 'NewComite',
            exclude: ['id'],
          }),
        },
      },
    })
    comite: Omit<Comite, 'id'>,
  ): Promise<Comite> {
    return this.comiteRepository.create(comite);
  }

  @get('/comites/count')
  @response(200, {
    description: 'Comite model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Comite) where?: Where<Comite>,
  ): Promise<Count> {
    return this.comiteRepository.count(where);
  }

  @get('/comites')
  @response(200, {
    description: 'Array of Comite model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Comite, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Comite) filter?: Filter<Comite>,
  ): Promise<Comite[]> {
    return this.comiteRepository.find(filter);
  }

  @patch('/comites')
  @response(200, {
    description: 'Comite PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Comite, {partial: true}),
        },
      },
    })
    comite: Comite,
    @param.where(Comite) where?: Where<Comite>,
  ): Promise<Count> {
    return this.comiteRepository.updateAll(comite, where);
  }

  @get('/comites/{id}')
  @response(200, {
    description: 'Comite model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Comite, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Comite, {exclude: 'where'}) filter?: FilterExcludingWhere<Comite>
  ): Promise<Comite> {
    return this.comiteRepository.findById(id, filter);
  }

  @patch('/comites/{id}')
  @response(204, {
    description: 'Comite PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Comite, {partial: true}),
        },
      },
    })
    comite: Comite,
  ): Promise<void> {
    await this.comiteRepository.updateById(id, comite);
  }

  @put('/comites/{id}')
  @response(204, {
    description: 'Comite PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() comite: Comite,
  ): Promise<void> {
    await this.comiteRepository.replaceById(id, comite);
  }

  @del('/comites/{id}')
  @response(204, {
    description: 'Comite DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.comiteRepository.deleteById(id);
  }
}
