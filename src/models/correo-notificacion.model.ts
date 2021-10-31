import {Entity, model, property} from '@loopback/repository';

@model()
export class CorreoNotificacion extends Entity {
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
    required: true,
  })
  correo: string;

  @property({
    type: 'boolean',
    required: true,
  })
  estado: boolean;


  constructor(data?: Partial<CorreoNotificacion>) {
    super(data);
  }
}

export interface CorreoNotificacionRelations {
  // describe navigational properties here
}

export type CorreoNotificacionWithRelations = CorreoNotificacion & CorreoNotificacionRelations;
