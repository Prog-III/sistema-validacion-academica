import {Entity, model, property} from '@loopback/repository';

@model()
export class JuradoLineaInvestigacion extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;


  constructor(data?: Partial<JuradoLineaInvestigacion>) {
    super(data);
  }
}

export interface JuradoLineaInvestigacionRelations {
  // describe navigational properties here
}

export type JuradoLineaInvestigacionWithRelations = JuradoLineaInvestigacion & JuradoLineaInvestigacionRelations;
