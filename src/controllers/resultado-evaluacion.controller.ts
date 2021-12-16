import {authenticate} from '@loopback/authentication';
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
import {ResultadoEvaluacion} from '../models';
import {InvitacionEvaluarRepository, ResultadoEvaluacionRepository} from '../repositories';
import {JuradoRepository} from '../repositories/jurado.repository';
import {SolicitudRepository} from '../repositories/solicitud.repository';
import {NotificacionesService} from '../services/notificaciones.service';

@authenticate('admin')
export class ResultadoEvaluacionController {
  constructor(
    @repository(ResultadoEvaluacionRepository)
    public resultadoEvaluacionRepository: ResultadoEvaluacionRepository,
    @repository(InvitacionEvaluarRepository)
    public invitacionEvaluarRepository: InvitacionEvaluarRepository,
    @repository(JuradoRepository)
    public juradoRepository: JuradoRepository,
    @repository(SolicitudRepository)
    public solicitudRepository: SolicitudRepository,
    @service(NotificacionesService)
    public servicioNotificaciones: NotificacionesService
  ) { }

  @authenticate('admin', 'evaluador')
  @post('/resultados-evaluaciones')
  @response(200, {
    description: 'ResultadoEvaluacion model instance',
    content: {'application/json': {schema: getModelSchemaRef(ResultadoEvaluacion)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ResultadoEvaluacion, {
            title: 'NewResultadoEvaluacion',
            exclude: ['id'],
          }),
        },
      },
    })
    resultadoEvaluacion: Omit<ResultadoEvaluacion, 'id'>,
  ): Promise<ResultadoEvaluacion> {
    let resultadoEvaluacionCreado = await this.resultadoEvaluacionRepository.create(resultadoEvaluacion);

    if (resultadoEvaluacionCreado) {
      let invitacionEvaluar = await this.invitacionEvaluarRepository.findById(resultadoEvaluacionCreado.id_invitacion_evaluar);
      invitacionEvaluar.estado_evaluacion = 2;

      this.invitacionEvaluarRepository.updateById(invitacionEvaluar.id, invitacionEvaluar)
        .then(async () => {
          let jurado = await this.juradoRepository.findById(invitacionEvaluar.id_jurado);
          let solicitud = await this.solicitudRepository.findById(invitacionEvaluar.id_solicitud);

          let asunto = 'Evaluación jurado';
          let saludo = Configuracion.saludo;

          let mensaje = `
            El jurado ${jurado.nombre} ha evaluado el trabajo: '${solicitud.nombre_trabajo}'
            con las siguientes consideraciones: ${resultadoEvaluacionCreado.descripcion}`;

          this.servicioNotificaciones.NotificarCorreosNotificacion(asunto, saludo, mensaje);

          const existeMasInvitacionesAEvaluar = await this.invitacionEvaluarRepository.findOne({
            "where": {
              "and": [
                {"id_solicitud": invitacionEvaluar.id_solicitud},
                {
                  "or": [
                    {"estado_evaluacion": 0},
                    {"estado_evaluacion": 1}
                  ]
                }
              ]
            }
          })

          if (!existeMasInvitacionesAEvaluar) {
            solicitud.id_estado = 2;
            await this.solicitudRepository.updateById(solicitud.id, solicitud);
          }
        })
    }

    return resultadoEvaluacionCreado;
  }

  @get('/resultados-evaluaciones/count')
  @response(200, {
    description: 'ResultadoEvaluacion model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(ResultadoEvaluacion) where?: Where<ResultadoEvaluacion>,
  ): Promise<Count> {
    return this.resultadoEvaluacionRepository.count(where);
  }

  @authenticate('admin', 'director', 'auxiliar')
  @get('/resultados-evaluaciones')
  @response(200, {
    description: 'Array of ResultadoEvaluacion model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(ResultadoEvaluacion, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(ResultadoEvaluacion) filter?: Filter<ResultadoEvaluacion>,
  ): Promise<ResultadoEvaluacion[]> {
    return this.resultadoEvaluacionRepository.find(filter);
  }

  @patch('/resultados-evaluaciones')
  @response(200, {
    description: 'ResultadoEvaluacion PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ResultadoEvaluacion, {partial: true}),
        },
      },
    })
    resultadoEvaluacion: ResultadoEvaluacion,
    @param.where(ResultadoEvaluacion) where?: Where<ResultadoEvaluacion>,
  ): Promise<Count> {
    return this.resultadoEvaluacionRepository.updateAll(resultadoEvaluacion, where);
  }

  @authenticate('admin', 'evaluador', 'director', 'auxiliar')
  @get('/resultados-evaluaciones/{id}')
  @response(200, {
    description: 'ResultadoEvaluacion model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(ResultadoEvaluacion, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(ResultadoEvaluacion, {exclude: 'where'}) filter?: FilterExcludingWhere<ResultadoEvaluacion>
  ): Promise<ResultadoEvaluacion> {
    return this.resultadoEvaluacionRepository.findById(id, filter);
  }

  @authenticate('admin', 'director')
  @patch('/resultados-evaluaciones/{id}')
  @response(204, {
    description: 'ResultadoEvaluacion PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ResultadoEvaluacion, {partial: true}),
        },
      },
    })
    resultadoEvaluacion: ResultadoEvaluacion,
  ): Promise<void> {
    await this.resultadoEvaluacionRepository.updateById(id, resultadoEvaluacion);
  }

  @authenticate('admin', 'director')
  @put('/resultados-evaluaciones/{id}')
  @response(204, {
    description: 'ResultadoEvaluacion PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() resultadoEvaluacion: ResultadoEvaluacion,
  ): Promise<void> {
    await this.resultadoEvaluacionRepository.replaceById(id, resultadoEvaluacion);
  }

  @authenticate('admin', 'director')
  @del('/resultados-evaluaciones/{id}')
  @response(204, {
    description: 'ResultadoEvaluacion DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    const resultadoEvaluacion = await this.resultadoEvaluacionRepository.findById(id);

    if (resultadoEvaluacion) {
      const invitacionEvaluar = await this.invitacionEvaluarRepository.findById(resultadoEvaluacion.id_invitacion_evaluar);
      invitacionEvaluar.estado_evaluacion = 1;

      const solicitud = await this.solicitudRepository.findById(invitacionEvaluar.id_solicitud);
      solicitud.id_estado = 1;
      await this.solicitudRepository.updateById(solicitud.id, solicitud);

      await this.resultadoEvaluacionRepository.deleteById(id)
        .then(async () => {
          await this.invitacionEvaluarRepository.updateById(invitacionEvaluar.id, invitacionEvaluar)

        });

    }
  }
}
