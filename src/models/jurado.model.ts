import {Entity, model, property, hasMany} from '@loopback/repository';
import {InvitacionEvaluar} from './invitacion-evaluar.model';

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

  @property({
    type: 'string',
    required: true,
  })
  clave: string;

  @hasMany(() => InvitacionEvaluar, {keyTo: 'id_jurado'})
  invitacionesEvaluar: InvitacionEvaluar[];

  constructor(data?: Partial<Jurado>) {
    super(data);
  }
}

export interface JuradoRelations {
  // describe navigational properties here
}

export type JuradoWithRelations = Jurado & JuradoRelations;
