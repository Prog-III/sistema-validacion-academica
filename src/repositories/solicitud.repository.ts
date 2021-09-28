import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyThroughRepositoryFactory, BelongsToAccessor, HasManyRepositoryFactory} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {Solicitud, SolicitudRelations, Proponente, SolicitudProponente, Comite, SolicitudComite, LineaInvestigacion, TipoSolicitud, Modalidad, EstadoSolicitud, InvitacionEvaluar} from '../models';
import {SolicitudProponenteRepository} from './solicitud-proponente.repository';
import {ProponenteRepository} from './proponente.repository';
import {SolicitudComiteRepository} from './solicitud-comite.repository';
import {ComiteRepository} from './comite.repository';
import {LineaInvestigacionRepository} from './linea-investigacion.repository';
import {TipoSolicitudRepository} from './tipo-solicitud.repository';
import {ModalidadRepository} from './modalidad.repository';
import {EstadoSolicitudRepository} from './estado-solicitud.repository';
import {InvitacionEvaluarRepository} from './invitacion-evaluar.repository';

export class SolicitudRepository extends DefaultCrudRepository<
  Solicitud,
  typeof Solicitud.prototype.id,
  SolicitudRelations
> {

  public readonly proponentes: HasManyThroughRepositoryFactory<Proponente, typeof Proponente.prototype.id,
          SolicitudProponente,
          typeof Solicitud.prototype.id
        >;

  public readonly comites: HasManyThroughRepositoryFactory<Comite, typeof Comite.prototype.id,
          SolicitudComite,
          typeof Solicitud.prototype.id
        >;

  public readonly linea_investigacion_pertenece_a_solicitud: BelongsToAccessor<LineaInvestigacion, typeof Solicitud.prototype.id>;

  public readonly solicitud_pertenece_a_tipo_solicitud: BelongsToAccessor<TipoSolicitud, typeof Solicitud.prototype.id>;

  public readonly solicitud_pertenece_a_modalidad: BelongsToAccessor<Modalidad, typeof Solicitud.prototype.id>;

  public readonly solicitud_pertenece_a_estado_solicitud: BelongsToAccessor<EstadoSolicitud, typeof Solicitud.prototype.id>;

  public readonly invitacionesEvaluar: HasManyRepositoryFactory<InvitacionEvaluar, typeof Solicitud.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('SolicitudProponenteRepository') protected solicitudProponenteRepositoryGetter: Getter<SolicitudProponenteRepository>, @repository.getter('ProponenteRepository') protected proponenteRepositoryGetter: Getter<ProponenteRepository>, @repository.getter('SolicitudComiteRepository') protected solicitudComiteRepositoryGetter: Getter<SolicitudComiteRepository>, @repository.getter('ComiteRepository') protected comiteRepositoryGetter: Getter<ComiteRepository>, @repository.getter('LineaInvestigacionRepository') protected lineaInvestigacionRepositoryGetter: Getter<LineaInvestigacionRepository>, @repository.getter('TipoSolicitudRepository') protected tipoSolicitudRepositoryGetter: Getter<TipoSolicitudRepository>, @repository.getter('ModalidadRepository') protected modalidadRepositoryGetter: Getter<ModalidadRepository>, @repository.getter('EstadoSolicitudRepository') protected estadoSolicitudRepositoryGetter: Getter<EstadoSolicitudRepository>, @repository.getter('InvitacionEvaluarRepository') protected invitacionEvaluarRepositoryGetter: Getter<InvitacionEvaluarRepository>,
  ) {
    super(Solicitud, dataSource);
    this.invitacionesEvaluar = this.createHasManyRepositoryFactoryFor('invitacionesEvaluar', invitacionEvaluarRepositoryGetter,);
    this.registerInclusionResolver('invitacionesEvaluar', this.invitacionesEvaluar.inclusionResolver);
    this.solicitud_pertenece_a_estado_solicitud = this.createBelongsToAccessorFor('solicitud_pertenece_a_estado_solicitud', estadoSolicitudRepositoryGetter,);
    this.registerInclusionResolver('solicitud_pertenece_a_estado_solicitud', this.solicitud_pertenece_a_estado_solicitud.inclusionResolver);
    this.solicitud_pertenece_a_modalidad = this.createBelongsToAccessorFor('solicitud_pertenece_a_modalidad', modalidadRepositoryGetter,);
    this.registerInclusionResolver('solicitud_pertenece_a_modalidad', this.solicitud_pertenece_a_modalidad.inclusionResolver);
    this.solicitud_pertenece_a_tipo_solicitud = this.createBelongsToAccessorFor('solicitud_pertenece_a_tipo_solicitud', tipoSolicitudRepositoryGetter,);
    this.registerInclusionResolver('solicitud_pertenece_a_tipo_solicitud', this.solicitud_pertenece_a_tipo_solicitud.inclusionResolver);
    this.linea_investigacion_pertenece_a_solicitud = this.createBelongsToAccessorFor('linea_investigacion_pertenece_a_solicitud', lineaInvestigacionRepositoryGetter,);
    this.registerInclusionResolver('linea_investigacion_pertenece_a_solicitud', this.linea_investigacion_pertenece_a_solicitud.inclusionResolver);
    this.comites = this.createHasManyThroughRepositoryFactoryFor('comites', comiteRepositoryGetter, solicitudComiteRepositoryGetter,);
    this.registerInclusionResolver('comites', this.comites.inclusionResolver);
    this.proponentes = this.createHasManyThroughRepositoryFactoryFor('proponentes', proponenteRepositoryGetter, solicitudProponenteRepositoryGetter,);
    this.registerInclusionResolver('proponentes', this.proponentes.inclusionResolver);
  }
}
