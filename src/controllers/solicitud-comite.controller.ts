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
  ArregloGeneral,
  Comite, Solicitud, SolicitudComite
} from '../models';
import {SolicitudComiteRepository, SolicitudRepository} from '../repositories';

@authenticate('admin')
export class SolicitudComiteController {
  constructor(
    @repository(SolicitudRepository) protected solicitudRepository: SolicitudRepository,
    @repository(SolicitudComiteRepository) protected solicitudComiteRepository: SolicitudComiteRepository
  ) { }

  @authenticate('admin', 'auxiliar', 'evaluador', 'director')
  @get('/solicitudes/{id}/comites', {
    responses: {
      '200': {
        description: 'Array of solicitudes has many comite through SolicitudComite',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Comite)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Comite>,
  ): Promise<Comite[]> {
    return this.solicitudRepository.comites(id).find(filter);
  }

  @post('/solicitud-comite', {
    responses: {
      '200': {
        description: 'create a instance of comite with a solicitud',
        content: {'application/json': {schema: getModelSchemaRef(SolicitudComite)}},
      },
    },
  })
  async createRelation(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SolicitudComite, {
            title: 'NewComiteWithSolicitud',
            exclude: ['id'],
          }),
        },
      },
    }) datos: Omit<SolicitudComite, 'id'>,
  ): Promise<SolicitudComite | null> {
    let registro = await this.solicitudComiteRepository.create(datos);
    return registro;
  }

  @post('/asociar-solicitud-comites/{id}', {
    responses: {
      '200': {
        description: 'create a instance of comite with a solicitud',
        content: {'application/json': {schema: getModelSchemaRef(SolicitudComite)}},
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
    @param.path.number('id') id_solicitud: typeof Solicitud.prototype.id
  ): Promise<Boolean> {
    if (datos.array_general.length > 0) {
      datos.array_general.forEach(async (id_comite: number) => {
        let existe = await this.solicitudComiteRepository.findOne({
          where: {
            id_solicitud: id_solicitud,
            id_comite: id_comite
          }
        });
        if (!existe) {
          this.solicitudComiteRepository.create({
            id_solicitud: id_solicitud,
            id_comite: id_comite
          });
        }
      });
      return true;
    }
    return false;
  }


  @del('/solicitudes/{id_solicitud}/{id_comite}')
  @response(204, {
    description: 'relation DELETE success',
  })
  async EliminarLineaDeJurado(
    @param.path.number('id_solicitud') id_solicitud: number,
    @param.path.number('id_comite') id_comite: number): Promise<Boolean> {
    let reg = await this.solicitudComiteRepository.findOne({
      where: {
        id_solicitud: id_solicitud,
        id_comite: id_comite
      }
    });
    if (reg) {
      await this.solicitudComiteRepository.deleteById(reg.id);
      return true;
    }
    return false;
  }
}
