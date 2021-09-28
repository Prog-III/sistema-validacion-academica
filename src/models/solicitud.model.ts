import {Entity, model, property, hasMany} from '@loopback/repository';
import {Proponente} from './proponente.model';
import {SolicitudProponente} from './solicitud-proponente.model';

@model()
export class Solicitud extends Entity {
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
    type: 'string',
    required: true,
  })
  nombre_trabajo: string;

  @property({
    type: 'string',
    required: true,
  })
  archivo: string;

  @property({
    type: 'string',
    required: true,
  })
  descripcion: string;

  @hasMany(() => Proponente, {through: {model: () => SolicitudProponente, keyFrom: 'id_solicitud', keyTo: 'id_proponente'}})
  proponentes: Proponente[];

  constructor(data?: Partial<Solicitud>) {
    super(data);
  }
}

export interface SolicitudRelations {
  // describe navigational properties here
}

export type SolicitudWithRelations = Solicitud & SolicitudRelations;
