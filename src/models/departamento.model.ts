import {belongsTo, Entity, hasMany, model, property} from '@loopback/repository';
import {Facultad} from './facultad.model';
import {ProponenteDepartamento} from './proponente-departamento.model';
import {Proponente} from './proponente.model';

@model()
export class Departamento extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
    unique: true
  })
  nombre: string;

  @belongsTo(() => Facultad, {name: 'pertenece_a'})
  id_facultad: number;


  @hasMany(() => Proponente, {through: {model: () => ProponenteDepartamento, keyFrom: 'id_departamento', keyTo: 'id_proponente'}})
  proponentes: Proponente[];

  constructor(data?: Partial<Departamento>) {
    super(data);
  }
}

export interface DepartamentoRelations {
  // describe navigational properties here
}

export type DepartamentoWithRelations = Departamento & DepartamentoRelations;
