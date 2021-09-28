import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {Recordatorio, RecordatorioRelations, InvitacionEvaluar} from '../models';
import {InvitacionEvaluarRepository} from './invitacion-evaluar.repository';

export class RecordatorioRepository extends DefaultCrudRepository<
  Recordatorio,
  typeof Recordatorio.prototype.id,
  RecordatorioRelations
> {

  public readonly recordatorio_pertenece_a_invitacion_evaluar: BelongsToAccessor<InvitacionEvaluar, typeof Recordatorio.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('InvitacionEvaluarRepository') protected invitacionEvaluarRepositoryGetter: Getter<InvitacionEvaluarRepository>,
  ) {
    super(Recordatorio, dataSource);
    this.recordatorio_pertenece_a_invitacion_evaluar = this.createBelongsToAccessorFor('recordatorio_pertenece_a_invitacion_evaluar', invitacionEvaluarRepositoryGetter,);
    this.registerInclusionResolver('recordatorio_pertenece_a_invitacion_evaluar', this.recordatorio_pertenece_a_invitacion_evaluar.inclusionResolver);
  }
}
