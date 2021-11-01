import {authenticate} from '@loopback/authentication';
import {inject, service} from '@loopback/core';
import {
  Filter,
  repository
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef, param, post, Request, requestBody, response, RestBindings
} from '@loopback/rest';
import {Configuracion} from '../llaves/configuracion';
import {
  ArregloGeneral, Proponente, Solicitud, SolicitudProponente
} from '../models';
import {NotificacionCorreo} from '../models/notificacion-correo.model';
import {EstadoSolicitudRepository, LineaInvestigacionRepository, ModalidadRepository, ProponenteRepository, SolicitudComiteRepository, SolicitudProponenteRepository, SolicitudRepository, TipoVinculacionRepository} from '../repositories';
import {NotificacionesService} from '../services';

require('dotenv').config();

@authenticate('admin', 'auxiliar')
export class SolicitudProponenteController {
  constructor(
    @repository(SolicitudRepository) protected solicitudRepository: SolicitudRepository,
    @inject(RestBindings.Http.REQUEST) private req: Request,
    @repository(TipoVinculacionRepository)
    public tipoVinculacionRepository: TipoVinculacionRepository,
    @repository(ModalidadRepository)
    public modalidadRepository: ModalidadRepository,
    @repository(LineaInvestigacionRepository)
    public lineainvestigacionRepository: LineaInvestigacionRepository,
    @repository(SolicitudProponenteRepository)
    public solicitudproponenteRepository: SolicitudProponenteRepository,
    @repository(SolicitudComiteRepository)
    public solicitudcomiteRepository: SolicitudComiteRepository,
    @repository(ProponenteRepository)
    public proponenteRepository: ProponenteRepository,
    @repository(EstadoSolicitudRepository)
    public estadoSolicitudRepository: EstadoSolicitudRepository,
    @service(NotificacionesService)
    public servicioNotificaciones: NotificacionesService
  ) { }


  @get('/solicitudes/{id}/proponentes', {
    responses: {
      '200': {
        description: 'Array of solicitudes has many proponente through SolicitudProponente',
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

  @post('/solicitud-proponente', {
    responses: {
      '200': {
        description: 'create a instance of proponente with a solicitud',
        content: {'application/json': {schema: getModelSchemaRef(SolicitudProponente)}},
      },
    },
  })
  async createRelation(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SolicitudProponente, {
            title: 'NewProponenteWithSolicitud',
            exclude: ['id'],
          }),
        },
      },
    }) datos: Omit<SolicitudProponente, 'id'>,
  ): Promise<SolicitudProponente | null> {

    let solicitudProponenteAntiguo = await this.solicitudproponenteRepository.findOne({
      where: {
        id_solicitud: datos.id_solicitud
      }
    });

    let registro = await this.solicitudproponenteRepository.create(datos);

    if (registro) {
      let datosNotificacion = new NotificacionCorreo();

      let proponenteregistrado = await this.proponenteRepository.findById(registro.id_proponente)
      let solicitudregistrada = await this.solicitudRepository.findById(registro.id_solicitud)

      let modalidadsolicitud = await this.modalidadRepository.findById(solicitudregistrada.id_modalidad)
      let lineasolicitud = await this.lineainvestigacionRepository.findById(solicitudregistrada.id_linea_investigacion)
      let solicitudcomites = await this.solicitudRepository.comites(solicitudregistrada.id).find()

      let comitesString = ""
      solicitudcomites.forEach(comite => {
        comitesString += `${comite.nombre}. `
      });

      datosNotificacion.destinatario = proponenteregistrado.email;
      datosNotificacion.asunto = Configuracion.asuntoCreacionSolicitud;
      datosNotificacion.saludo = `${Configuracion.saludo} <strong>${proponenteregistrado.primer_nombre}</strong>`


      if (solicitudProponenteAntiguo) {
        let solicitudAntigua = await this.solicitudRepository.findById(solicitudProponenteAntiguo.id_solicitud);
        let estadoSolicitud = await this.estadoSolicitudRepository.findById(solicitudAntigua.id_estado);

        datosNotificacion.mensaje = `Su solicitud ya habia sido registrada anteriormente por otro proponente y
          actualmente está en estado: ${estadoSolicitud.nombre}`;

      } else {
        datosNotificacion.mensaje = `${Configuracion.mensajeCreacionSolicitud}
          ${Configuracion.fechasolicitudArg} ${solicitudregistrada.fecha}
          ${Configuracion.nombretrabajoArg} ${solicitudregistrada.nombre_trabajo}
          ${Configuracion.modalidadArg} ${modalidadsolicitud.nombre}
          ${Configuracion.comiteArg} ${comitesString}
          ${Configuracion.lineaArg} ${lineasolicitud.nombre}
          ${Configuracion.archivoArg} ${solicitudregistrada.archivo}
          ${Configuracion.descripcionArg} ${solicitudregistrada.descripcion}`
      }

      this.servicioNotificaciones.EnviarCorreo(datosNotificacion);
    }

    return registro;
  }


  @post('/asociar-solicitud-proponentes/{id}', {
    responses: {
      '200': {
        description: 'create a instance of proponente with a solicitud',
        content: {'application/json': {schema: getModelSchemaRef(SolicitudProponente)}},
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
      datos.array_general.forEach(async (id_proponente: number) => {
        let existe = await this.solicitudproponenteRepository.findOne({
          where: {
            id_solicitud: id_solicitud,
            id_proponente: id_proponente
          }
        });
        if (!existe) {
          this.solicitudproponenteRepository.create({
            id_solicitud: id_solicitud,
            id_proponente: id_proponente
          });
        }
      });
      return true;
    }
    return false;
  }


  @del('/solicitudes/{id_solicitud}/{id_proponente}')
  @response(204, {
    description: 'relation DELETE success',
  })
  async EliminarProponentedeSolicitud(
    @param.path.number('id_solicitud') id_solicitud: number,
    @param.path.number('id_proponente') id_proponente: number): Promise<Boolean> {
    let reg = await this.solicitudproponenteRepository.findOne({
      where: {
        id_solicitud: id_solicitud,
        id_proponente: id_proponente
      }
    });
    if (reg) {
      await this.solicitudproponenteRepository.deleteById(reg.id);
      return true;
    }
    return false;
  }
}
