import {belongsTo, Entity, model, property} from '@loopback/repository';
import {InvitacionEvaluar} from './invitacion-evaluar.model';

@model()
export class Recordatorio extends Entity {
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
  fecha: string;

  @property({
    type: 'string'
  })
  hora?: string;

  @property({
    type: 'string',
    required: true,
  })
  tipo_recordatorio: string;

  @property({
    type: 'string'
  })
  descripcion?: string;

  @belongsTo(() => InvitacionEvaluar, {name: 'recordatorio_pertenece_a_invitacion_evaluar'})
  id_invitacion_evaluar: number;

  constructor(data?: Partial<Recordatorio>) {
    super(data);
  }
}

export interface RecordatorioRelations {
  // describe navigational properties here
}

export type RecordatorioWithRelations = Recordatorio & RecordatorioRelations;
