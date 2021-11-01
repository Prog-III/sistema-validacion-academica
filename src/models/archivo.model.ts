import {Model, model, property} from '@loopback/repository';

@model()
export class Archivo extends Model {
  @property({
    type: 'string',
    required: true,
  })
  ruta: string;


  constructor(data?: Partial<Archivo>) {
    super(data);
  }
}

export interface ArchivoRelations {
  // describe navigational properties here
}

export type ArchivoWithRelations = Archivo & ArchivoRelations;
