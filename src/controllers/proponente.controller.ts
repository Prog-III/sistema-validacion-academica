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
import {Proponente} from '../models';
import {ProponenteRepository} from '../repositories';

export class ProponenteController {
  constructor(
    @repository(ProponenteRepository)
    public proponenteRepository : ProponenteRepository,
  ) {}

  @post('/proponentes')
  @response(200, {
    description: 'Proponente model instance',
    content: {'application/json': {schema: getModelSchemaRef(Proponente)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Proponente, {
            title: 'NewProponente',
            exclude: ['id'],
          }),
        },
      },
    })
    proponente: Omit<Proponente, 'id'>,
  ): Promise<Proponente> {
    return this.proponenteRepository.create(proponente);
  }

  @get('/proponentes/count')
  @response(200, {
    description: 'Proponente model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Proponente) where?: Where<Proponente>,
  ): Promise<Count> {
    return this.proponenteRepository.count(where);
  }

  @get('/proponentes')
  @response(200, {
    description: 'Array of Proponente model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Proponente, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Proponente) filter?: Filter<Proponente>,
  ): Promise<Proponente[]> {
    return this.proponenteRepository.find(filter);
  }

  @patch('/proponentes')
  @response(200, {
    description: 'Proponente PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Proponente, {partial: true}),
        },
      },
    })
    proponente: Proponente,
    @param.where(Proponente) where?: Where<Proponente>,
  ): Promise<Count> {
    return this.proponenteRepository.updateAll(proponente, where);
  }

  @get('/proponentes/{id}')
  @response(200, {
    description: 'Proponente model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Proponente, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Proponente, {exclude: 'where'}) filter?: FilterExcludingWhere<Proponente>
  ): Promise<Proponente> {
    return this.proponenteRepository.findById(id, filter);
  }

  @patch('/proponentes/{id}')
  @response(204, {
    description: 'Proponente PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Proponente, {partial: true}),
        },
      },
    })
    proponente: Proponente,
  ): Promise<void> {
    await this.proponenteRepository.updateById(id, proponente);
  }

  @put('/proponentes/{id}')
  @response(204, {
    description: 'Proponente PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() proponente: Proponente,
  ): Promise<void> {
    await this.proponenteRepository.replaceById(id, proponente);
  }

  @del('/proponentes/{id}')
  @response(204, {
    description: 'Proponente DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.proponenteRepository.deleteById(id);
  }
}
