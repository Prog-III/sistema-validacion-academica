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
  getModelSchemaRef, HttpErrors, param, patch, post, put, requestBody,
  response
} from '@loopback/rest';
import {Configuracion} from '../llaves/configuracion';
import {InvitacionEvaluar} from '../models';
import {NotificacionCorreo} from '../models/notificacion-correo.model';
import {InvitacionEvaluarRepository, JuradoRepository, SolicitudRepository} from '../repositories';
import {NotificacionesService} from '../services';

const createHash = require('hash-generator');

export class InvitacionEvaluarController {
  constructor(
    @repository(InvitacionEvaluarRepository)
    public invitacionEvaluarRepository: InvitacionEvaluarRepository,
    @repository(JuradoRepository)
    public juradoRepository: JuradoRepository,
    @repository(SolicitudRepository)
    public solicitudRepository: SolicitudRepository,
    @service(NotificacionesService)
    public servicioNotificaciones: NotificacionesService
  ) { }

  @post('/invitaciones-evaluar')
  @response(200, {
    description: 'InvitacionEvaluar model instance',
    content: {'application/json': {schema: getModelSchemaRef(InvitacionEvaluar)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(InvitacionEvaluar, {
            title: 'NewInvitacionEvaluar',
            exclude: ['id'],
          }),
        },
      },
    })
    invitacionEvaluar: Omit<InvitacionEvaluar, 'id'>,
  ): Promise<InvitacionEvaluar> {
    let hash = createHash(30);
    invitacionEvaluar.hash = hash;

    let InvitacionRegistrada = await this.invitacionEvaluarRepository.create(invitacionEvaluar);
    if (InvitacionRegistrada) {
      let datosNotificacion = new NotificacionCorreo();

      let juradoregistrado = await this.juradoRepository.findById(InvitacionRegistrada.id_jurado)
      let solicitudregistrado = await this.solicitudRepository.findById(InvitacionRegistrada.id_solicitud)

      datosNotificacion.destinatario = juradoregistrado.email;
      datosNotificacion.asunto = Configuracion.asuntoInvitacionJurado;
      datosNotificacion.saludo = `${Configuracion.saludo} <strong>${juradoregistrado.nombre}</strong>`
      datosNotificacion.mensaje = `
        ${Configuracion.mensajeInvitacionJurado}
        ${Configuracion.nombretrabajoArg} ${solicitudregistrado.nombre_trabajo}
        <br /> <a href="http://localhost:4200/responder-invitacion-evaluar?hash=${hash}">Responder a invitación</a>
      `
      this.servicioNotificaciones.EnviarCorreo(datosNotificacion);
    }
    return InvitacionRegistrada
  }

  @get('/invitaciones-evaluar/count')
  @response(200, {
    description: 'InvitacionEvaluar model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(InvitacionEvaluar) where?: Where<InvitacionEvaluar>,
  ): Promise<Count> {
    return this.invitacionEvaluarRepository.count(where);
  }

  @get('/invitaciones-evaluar')
  @response(200, {
    description: 'Array of InvitacionEvaluar model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(InvitacionEvaluar, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(InvitacionEvaluar) filter?: Filter<InvitacionEvaluar>,
  ): Promise<InvitacionEvaluar[]> {
    return this.invitacionEvaluarRepository.find(filter);
  }

  @patch('/invitaciones-evaluar')
  @response(200, {
    description: 'InvitacionEvaluar PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(InvitacionEvaluar, {partial: true}),
        },
      },
    })
    invitacionEvaluar: InvitacionEvaluar,
    @param.where(InvitacionEvaluar) where?: Where<InvitacionEvaluar>,
  ): Promise<Count> {
    return this.invitacionEvaluarRepository.updateAll(invitacionEvaluar, where);
  }

  @get('/invitaciones-evaluar/{id}')
  @response(200, {
    description: 'InvitacionEvaluar model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(InvitacionEvaluar, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(InvitacionEvaluar, {exclude: 'where'}) filter?: FilterExcludingWhere<InvitacionEvaluar>
  ): Promise<InvitacionEvaluar> {
    return this.invitacionEvaluarRepository.findById(id, filter);
  }


  @patch('/invitaciones-evaluar/{id}')
  @response(204, {
    description: 'InvitacionEvaluar PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(InvitacionEvaluar, {partial: true}),
        },
      },
    })
    invitacionEvaluar: InvitacionEvaluar,
  ): Promise<void> {
    await this.invitacionEvaluarRepository.updateById(id, invitacionEvaluar);
  }

  @patch('invitaciones-evaluar/actualizar-estado/{hash}')
  @response(204, {
    description: 'Actualizar estado de la invitacion a evaluar',
  })
  async updatebyHash(
    @param.path.string('hash') parametroHash: string,
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              "nuevoEstado": {type: 'number'}
            },
          }
        },
      },
    })
    objetoEstadoInvitacion: {nuevoEstado: number},
  ): Promise<void> {
    const invitacionActual = await this.invitacionEvaluarRepository.findOne({
      where: {hash: parametroHash}
    });

    if (invitacionActual) {
      const estadoInvitacion = invitacionActual.estado_invitacion;

      if (estadoInvitacion === 0) {
        const nuevoEstadoInvitacion = objetoEstadoInvitacion.nuevoEstado;
        invitacionActual.estado_invitacion = nuevoEstadoInvitacion;

        const juradoInvitado = await this.juradoRepository.findById(invitacionActual.id_jurado);
        const solicitud = await this.solicitudRepository.findById(invitacionActual.id_solicitud);

        const asunto = 'Respuesta jurado';
        const saludo = `${Configuracion.saludo}`;

        if (nuevoEstadoInvitacion === 1) {
          invitacionActual.estado_evaluacion = 1;

          return await this.invitacionEvaluarRepository.updateById(invitacionActual.id, invitacionActual)
            .then(() => {
              const mensaje = `El jurado ${juradoInvitado.nombre} ha aceptado la invitacion a evaluar el trabajo: ${solicitud.nombre_trabajo}`;
              this.servicioNotificaciones.NotificarCorreosNotificacion(asunto, saludo, mensaje);
            })
        } else if (nuevoEstadoInvitacion === 2) {
          return await this.invitacionEvaluarRepository.updateById(invitacionActual.id, invitacionActual)
            .then(() => {
              const mensaje = `El jurado ${juradoInvitado.nombre} ha rechazado la invitacion a evaluar el trabajo: ${solicitud.nombre_trabajo}`;

              this.servicioNotificaciones.NotificarCorreosNotificacion(asunto, saludo, mensaje)
            })
        }
      }

      throw new HttpErrors[400]("La invitacion ya ha sido respondida");
    }

    throw new HttpErrors[404]("Invitacion a evaluar no encontrada");
  }

  @put('/invitaciones-evaluar/{id}')
  @response(204, {
    description: 'InvitacionEvaluar PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() invitacionEvaluar: InvitacionEvaluar,
  ): Promise<void> {
    await this.invitacionEvaluarRepository.replaceById(id, invitacionEvaluar);
  }

  @del('/invitaciones-evaluar/{id}')
  @response(204, {
    description: 'InvitacionEvaluar DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.invitacionEvaluarRepository.deleteById(id);
  }
}
