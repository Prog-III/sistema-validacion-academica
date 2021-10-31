import {Entity, model, property, hasMany, belongsTo} from '@loopback/repository';
import {Proponente} from './proponente.model';
import {SolicitudProponente} from './solicitud-proponente.model';
import {Comite} from './comite.model';
import {SolicitudComite} from './solicitud-comite.model';
import {LineaInvestigacion} from './linea-investigacion.model';
import {TipoSolicitud} from './tipo-solicitud.model';
import {Modalidad} from './modalidad.model';
import {EstadoSolicitud} from './estado-solicitud.model';
import {InvitacionEvaluar} from './invitacion-evaluar.model';

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

  @property({
    type: 'string'
  })
  coincidencias?: string;

  @hasMany(() => Proponente, {through: {model: () => SolicitudProponente, keyFrom: 'id_solicitud', keyTo: 'id_proponente'}})
  proponentes: Proponente[];

  @hasMany(() => Comite, {through: {model: () => SolicitudComite, keyFrom: 'id_solicitud', keyTo: 'id_comite'}})
  comites: Comite[];

  @belongsTo(() => LineaInvestigacion, {name: 'linea_investigacion_pertenece_a_solicitud'})
  id_linea_investigacion: number;

  @belongsTo(() => TipoSolicitud, {name: 'solicitud_pertenece_a_tipo_solicitud'})
  id_tipo_solicitud: number;

  @belongsTo(() => Modalidad, {name: 'solicitud_pertenece_a_modalidad'})
  id_modalidad: number;

  @belongsTo(() => EstadoSolicitud, {name: 'solicitud_pertenece_a_estado_solicitud'})
  id_estado: number;

  @hasMany(() => InvitacionEvaluar, {keyTo: 'id_solicitud'})
  invitacionesEvaluar: InvitacionEvaluar[];

  constructor(data?: Partial<Solicitud>) {
    super(data);
  }
}

export interface SolicitudRelations {
  // describe navigational properties here
}

export type SolicitudWithRelations = Solicitud & SolicitudRelations;
