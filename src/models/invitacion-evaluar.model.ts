import {belongsTo, Entity, hasMany, model, property} from '@loopback/repository';
import {Jurado} from './jurado.model';
import {Recordatorio} from './recordatorio.model';
import {ResultadoEvaluacion} from './resultado-evaluacion.model';
import {Solicitud} from './solicitud.model';

@model()
export class InvitacionEvaluar extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'date',
    required: true,
  })
  fecha_invitacion: string;

  @property({
    type: 'date',
  })
  fecha_respuesta?: string;

  @property({
    type: 'number',
    required: true,
  })
  estado_invitacion: number;

  @property({
    type: 'string'
  })
  hash?: string;

  @property({
    type: 'string',
  })
  observaciones?: string;

  @property({
    type: 'number',
    default: 0
  })
  estado_evaluacion: number;

  @belongsTo(() => Solicitud, {name: 'invitacion_evaluar_pertenece_a_solicitud'})
  id_solicitud: number;

  @belongsTo(() => Jurado, {name: 'invitacion_evaluar_pertenece_a_jurado'})
  id_jurado: number;

  @hasMany(() => ResultadoEvaluacion, {keyTo: 'id_invitacion_evaluar'})
  resultadosEvaluar: ResultadoEvaluacion[];

  @hasMany(() => Recordatorio, {keyTo: 'id_invitacion_evaluar'})
  recordatorios: Recordatorio[];

  constructor(data?: Partial<InvitacionEvaluar>) {
    super(data);
  }
}

export interface InvitacionEvaluarRelations {
  // describe navigational properties here
}

export type InvitacionEvaluarWithRelations = InvitacionEvaluar & InvitacionEvaluarRelations;
