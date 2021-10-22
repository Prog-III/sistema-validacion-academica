import {Model, model, property} from '@loopback/repository';

@model()
export class ArregloGeneral extends Model {
  @property({
    type: 'array',
    itemType: 'number',
    required: true,
  })
  array_general: number[];


  constructor(data?: Partial<ArregloGeneral>) {
    super(data);
  }
}

export interface ArregloGeneralRelations {
  // describe navigational properties here
}

export type ArregloGeneralWithRelations = ArregloGeneral & ArregloGeneralRelations;
