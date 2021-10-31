import {service} from '@loopback/core';
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
  getModelSchemaRef, param, patch, post, put, requestBody,
  response
} from '@loopback/rest';
import {Configuracion} from '../llaves/configuracion';
import {Recordatorio} from '../models';
import {NotificacionCorreo} from '../models/notificacion-correo.model';
import {NotificacionSms} from '../models/notificacion-sms.model';
import {InvitacionEvaluarRepository, JuradoRepository, RecordatorioRepository, SolicitudRepository} from '../repositories';
import {NotificacionesService} from '../services';

export class RecordatorioController {
  constructor(
    @repository(RecordatorioRepository)
    public recordatorioRepository: RecordatorioRepository,
    @repository(InvitacionEvaluarRepository)
    public invitacionRepository: InvitacionEvaluarRepository,
    @repository(JuradoRepository)
    public juradoRepository: JuradoRepository,
    @repository(SolicitudRepository)
    public solicitudRepository: SolicitudRepository,
    @service(NotificacionesService)
    public servicioNotificaciones: NotificacionesService
  ) { }

  @post('/recordatorios')
  @response(200, {
    description: 'Recordatorio model instance',
    content: {'application/json': {schema: getModelSchemaRef(Recordatorio)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Recordatorio, {
            title: 'NewRecordatorio',
            exclude: ['id'],
          }),
        },
      },
    })
    recordatorio: Omit<Recordatorio, 'id'>,
  ): Promise<Recordatorio> {
    let Recordatorio = await this.recordatorioRepository.create(recordatorio);

    if (Recordatorio) {

      const invitacionEvaluar = await this.invitacionRepository.findById(Recordatorio.id_invitacion_evaluar);
      const jurado = await this.juradoRepository.findById(invitacionEvaluar.id_jurado)
      const solicitud = await this.solicitudRepository.findById(invitacionEvaluar.id_solicitud)

      if (jurado.telefono) {
        const datos = new NotificacionSms();

        datos.destino = jurado.telefono
        datos.mensaje = `${Configuracion.saludo} ${jurado.nombre}, recuerde evaluar el trabajo: ${solicitud.nombre_trabajo} del cual acepto ser jurado.`

        this.servicioNotificaciones.EnviarSms(datos)
      }

      const datos = new NotificacionCorreo();
      datos.destinatario = jurado.email
      datos.asunto = Configuracion.asuntoRecordatorioJurado
      datos.saludo = `${Configuracion.saludo} ${jurado.nombre}`
      datos.mensaje = `Recuerde evaluar lo más pronto posible el trabajo: ${solicitud.nombre_trabajo} del cual acepto ser jurado.`

      this.servicioNotificaciones.EnviarCorreo(datos)
    }

    return recordatorio
  }

  @get('/recordatorios/count')
  @response(200, {
    description: 'Recordatorio model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Recordatorio) where?: Where<Recordatorio>,
  ): Promise<Count> {
    return this.recordatorioRepository.count(where);
  }

  @get('/recordatorios')
  @response(200, {
    description: 'Array of Recordatorio model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Recordatorio, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Recordatorio) filter?: Filter<Recordatorio>,
  ): Promise<Recordatorio[]> {
    return this.recordatorioRepository.find(filter);
  }

  @patch('/recordatorios')
  @response(200, {
    description: 'Recordatorio PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Recordatorio, {partial: true}),
        },
      },
    })
    recordatorio: Recordatorio,
    @param.where(Recordatorio) where?: Where<Recordatorio>,
  ): Promise<Count> {
    return this.recordatorioRepository.updateAll(recordatorio, where);
  }

  @get('/recordatorios/{id}')
  @response(200, {
    description: 'Recordatorio model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Recordatorio, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Recordatorio, {exclude: 'where'}) filter?: FilterExcludingWhere<Recordatorio>
  ): Promise<Recordatorio> {
    return this.recordatorioRepository.findById(id, filter);
  }

  @patch('/recordatorios/{id}')
  @response(204, {
    description: 'Recordatorio PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Recordatorio, {partial: true}),
        },
      },
    })
    recordatorio: Recordatorio,
  ): Promise<void> {
    await this.recordatorioRepository.updateById(id, recordatorio);
  }

  @put('/recordatorios/{id}')
  @response(204, {
    description: 'Recordatorio PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() recordatorio: Recordatorio,
  ): Promise<void> {
    await this.recordatorioRepository.replaceById(id, recordatorio);
  }

  @del('/recordatorios/{id}')
  @response(204, {
    description: 'Recordatorio DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.recordatorioRepository.deleteById(id);
  }
}
