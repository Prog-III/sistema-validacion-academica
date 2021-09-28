import {Entity, model, property} from '@loopback/repository';

@model()
export class SolicitudComite extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;


  constructor(data?: Partial<SolicitudComite>) {
    super(data);
  }
}

export interface SolicitudComiteRelations {
  // describe navigational properties here
}

export type SolicitudComiteWithRelations = SolicitudComite & SolicitudComiteRelations;
