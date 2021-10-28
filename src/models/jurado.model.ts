import {Entity, hasMany, model, property} from '@loopback/repository';
import {InvitacionEvaluar} from './invitacion-evaluar.model';
import {JuradoLineaInvestigacion} from './jurado-linea-investigacion.model';
import {LineaInvestigacion} from './linea-investigacion.model';

@model()
export class Jurado extends Entity {
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
  nombre: string;

  @property({
    type: 'string',
  })
  telefono?: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  entidad: string;

  @hasMany(() => InvitacionEvaluar, {keyTo: 'id_jurado'})
  invitacionesEvaluar: InvitacionEvaluar[];

  @hasMany(() => LineaInvestigacion, {through: {model: () => JuradoLineaInvestigacion, keyFrom: 'id_jurado', keyTo: 'id_linea_investigacion'}})
  lineasInvestigacion: LineaInvestigacion[];

  constructor(data?: Partial<Jurado>) {
    super(data);
  }
}

export interface JuradoRelations {
  // describe navigational properties here
}

export type JuradoWithRelations = Jurado & JuradoRelations;
