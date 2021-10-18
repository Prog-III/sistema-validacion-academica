import {inject, intercept} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
  import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  HttpErrors,
  param,
  patch,
  post,
  requestBody,
  RestBindings,
  Request,
  response
} from '@loopback/rest';
import {cloudFilesRoutes} from '../config/index.config';
import {filesInterceptor} from '../middleware/multer';
import {
Solicitud,
SolicitudProponente,
Proponente,
} from '../models';
import path from 'path';
import {SolicitudRepository, TipoVinculacionRepository} from '../repositories';
import {cloudinary} from '../services/cloudinary.service';

export class SolicitudProponenteController {
  constructor(
    @repository(SolicitudRepository) protected solicitudRepository: SolicitudRepository,
    @inject(RestBindings.Http.REQUEST) private req: Request,
    @repository(TipoVinculacionRepository)
    public tipoVinculacionRepository: TipoVinculacionRepository,
  ) { }

  @get('/solicituds/{id}/proponentes', {
    responses: {
      '200': {
        description: 'Array of Solicitud has many Proponente through SolicitudProponente',
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
    return this.solicitudRepository.proponentes(id).find(filter);
  }


  @post('/solicituds/{id}/proponentes')
  @intercept(filesInterceptor)
  @response(200, {
    description: 'Proponente model instance',
    content: {'application/json': {schema: getModelSchemaRef(Proponente)}},
  })
  async create(
    @param.path.number('id') id: typeof Solicitud.prototype.id
  ): Promise<Proponente> {

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

    const {file} = this.req;

    if (
      !primer_nombre ||
      !otros_nombres ||
      !primer_apellido ||
      !segundo_apellido ||
      !documento ||
      !fecha_nacimiento ||
      !email ||
      !celular ||
      !file

    )throw new HttpErrors.BadRequest('Información incompleta');

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
      const image= uploadedImage.secure_url;
      const image_public_id = uploadedImage.public_id;


    return this.solicitudRepository.proponentes(id).create({
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

  @patch('/solicituds/{id}/proponentes', {
    responses: {
      '200': {
        description: 'Solicitud.Proponente PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Proponente, {partial: true}),
        },
      },
    })
    proponente: Partial<Proponente>,
    @param.query.object('where', getWhereSchemaFor(Proponente)) where?: Where<Proponente>,
  ): Promise<Count> {
    return this.solicitudRepository.proponentes(id).patch(proponente, where);
  }

  @del('/solicituds/{id}/proponentes', {
    responses: {
      '200': {
        description: 'Solicitud.Proponente DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Proponente)) where?: Where<Proponente>,
  ): Promise<Count> {
    return this.solicitudRepository.proponentes(id).delete(where);
  }
}
