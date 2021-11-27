import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/context';
import {intercept} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, HttpErrors, param, patch, post, put, Request, requestBody,
  response,
  RestBindings
} from '@loopback/rest';
import path from 'path';
import {cloudFilesRoutes} from '../config/index.config';
import {imagesInterceptor} from '../middleware/multer';
import {Proponente} from '../models';
import {ProponenteRepository, TipoVinculacionRepository} from '../repositories';
import {cloudinary} from '../services/cloudinary.service';

@authenticate('admin', 'auxiliar')
export class ProponenteController {
  constructor(
    @repository(ProponenteRepository)
    public proponenteRepository: ProponenteRepository,

    @repository(TipoVinculacionRepository)
    public tipoVinculacionRepository: TipoVinculacionRepository,
    @inject(RestBindings.Http.REQUEST) private req: Request,
  ) { }

  @post('/proponentes')
  @intercept(imagesInterceptor)
  @response(200, {
    description: 'Proponente model instance',
    content: {'application/json': {schema: getModelSchemaRef(Proponente)}},
  })
  async create(): Promise<Proponente> {

    const {
      primer_nombre,
      otros_nombres,
      primer_apellido,
      segundo_apellido,
      documento,
      fecha_nacimiento,
      email,
      celular,
      id_tipo_vinculacion

    } = this.req.body;
console.log(this.req.body);

    const {file} = this.req;


    console.log(primer_nombre);
    console.log(primer_apellido);
    console.log(documento);
    console.log(fecha_nacimiento);
    console.log(email);
    console.log(celular);
    console.log(file);
    if (
      !primer_nombre ||

      !primer_apellido ||

      !documento ||
      !fecha_nacimiento ||
      !email ||
      !celular ||
      !file

    )

      throw new HttpErrors.BadRequest('Información incompleta');

    if (!id_tipo_vinculacion || !(await this.tipoVinculacionRepository.findById(id_tipo_vinculacion)))
      throw new HttpErrors.BadRequest('id_tipo_vinculacion Invalido');

    const uploadedImage: cloudinary.UploadApiResponse = await cloudinary.v2.uploader.upload(
      file.path,
      {
        public_id: `${cloudFilesRoutes.proponente}/${path.basename(
          file.path,
          path.extname(file.path),

        )}` //VER ESTO
      },
    );

    const image = uploadedImage.secure_url;
    console.log(image);
    const image_public_id = uploadedImage.public_id;

    return this.proponenteRepository.create({
      primer_nombre,
      otros_nombres,
      primer_apellido,
      segundo_apellido,
      documento,
      fecha_nacimiento,
      email,
      celular,
      id_tipo_vinculacion,
      image,
      image_public_id
    });
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
