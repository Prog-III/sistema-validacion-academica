import {Model, model, property} from '@loopback/repository';

@model()
export class ArregloLineasInvestigacion extends Model {
  @property({
    type: 'array',
    itemType: 'number',
    required: true,
  })
  lineas_investigacion: number[];


  constructor(data?: Partial<ArregloLineasInvestigacion>) {
    super(data);
  }
}

export interface ArregloLineasInvestigacionRelations {
  // describe navigational properties here
}

export type ArregloLineasInvestigacionWithRelations = ArregloLineasInvestigacion & ArregloLineasInvestigacionRelations;
