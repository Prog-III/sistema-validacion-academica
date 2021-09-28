import {Entity, model, property, belongsTo} from '@loopback/repository';
import {InvitacionEvaluar} from './invitacion-evaluar.model';

@model()
export class ResultadoEvaluacion extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  descripcion: string;

  @property({
    type: 'date',
    required: true,
  })
  fecha: string;

  @property({
    type: 'string',
    required: true,
  })
  formato_diligenciado: string;

  @belongsTo(() => InvitacionEvaluar, {name: 'resultado_evaluacion_pertenece_a_invitacion_evaluar'})
  id_invitacion_evaluar: number;

  constructor(data?: Partial<ResultadoEvaluacion>) {
    super(data);
  }
}

export interface ResultadoEvaluacionRelations {
  // describe navigational properties here
}

export type ResultadoEvaluacionWithRelations = ResultadoEvaluacion & ResultadoEvaluacionRelations;
