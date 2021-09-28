import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor, HasManyRepositoryFactory} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {InvitacionEvaluar, InvitacionEvaluarRelations, Solicitud, Jurado, ResultadoEvaluacion, Recordatorio} from '../models';
import {SolicitudRepository} from './solicitud.repository';
import {JuradoRepository} from './jurado.repository';
import {ResultadoEvaluacionRepository} from './resultado-evaluacion.repository';
import {RecordatorioRepository} from './recordatorio.repository';

export class InvitacionEvaluarRepository extends DefaultCrudRepository<
  InvitacionEvaluar,
  typeof InvitacionEvaluar.prototype.id,
  InvitacionEvaluarRelations
> {

  public readonly invitacion_evaluar_pertenece_a_solicitud: BelongsToAccessor<Solicitud, typeof InvitacionEvaluar.prototype.id>;

  public readonly invitacion_evaluar_pertenece_a_jurado: BelongsToAccessor<Jurado, typeof InvitacionEvaluar.prototype.id>;

  public readonly resultadosEvaluar: HasManyRepositoryFactory<ResultadoEvaluacion, typeof InvitacionEvaluar.prototype.id>;

  public readonly recordatorios: HasManyRepositoryFactory<Recordatorio, typeof InvitacionEvaluar.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('SolicitudRepository') protected solicitudRepositoryGetter: Getter<SolicitudRepository>, @repository.getter('JuradoRepository') protected juradoRepositoryGetter: Getter<JuradoRepository>, @repository.getter('ResultadoEvaluacionRepository') protected resultadoEvaluacionRepositoryGetter: Getter<ResultadoEvaluacionRepository>, @repository.getter('RecordatorioRepository') protected recordatorioRepositoryGetter: Getter<RecordatorioRepository>,
  ) {
    super(InvitacionEvaluar, dataSource);
    this.recordatorios = this.createHasManyRepositoryFactoryFor('recordatorios', recordatorioRepositoryGetter,);
    this.registerInclusionResolver('recordatorios', this.recordatorios.inclusionResolver);
    this.resultadosEvaluar = this.createHasManyRepositoryFactoryFor('resultadosEvaluar', resultadoEvaluacionRepositoryGetter,);
    this.registerInclusionResolver('resultadosEvaluar', this.resultadosEvaluar.inclusionResolver);
    this.invitacion_evaluar_pertenece_a_jurado = this.createBelongsToAccessorFor('invitacion_evaluar_pertenece_a_jurado', juradoRepositoryGetter,);
    this.registerInclusionResolver('invitacion_evaluar_pertenece_a_jurado', this.invitacion_evaluar_pertenece_a_jurado.inclusionResolver);
    this.invitacion_evaluar_pertenece_a_solicitud = this.createBelongsToAccessorFor('invitacion_evaluar_pertenece_a_solicitud', solicitudRepositoryGetter,);
    this.registerInclusionResolver('invitacion_evaluar_pertenece_a_solicitud', this.invitacion_evaluar_pertenece_a_solicitud.inclusionResolver);
  }
}
