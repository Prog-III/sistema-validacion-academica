import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {ResultadoEvaluacion, ResultadoEvaluacionRelations, InvitacionEvaluar} from '../models';
import {InvitacionEvaluarRepository} from './invitacion-evaluar.repository';

export class ResultadoEvaluacionRepository extends DefaultCrudRepository<
  ResultadoEvaluacion,
  typeof ResultadoEvaluacion.prototype.id,
  ResultadoEvaluacionRelations
> {

  public readonly resultado_evaluacion_pertenece_a_invitacion_evaluar: BelongsToAccessor<InvitacionEvaluar, typeof ResultadoEvaluacion.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('InvitacionEvaluarRepository') protected invitacionEvaluarRepositoryGetter: Getter<InvitacionEvaluarRepository>,
  ) {
    super(ResultadoEvaluacion, dataSource);
    this.resultado_evaluacion_pertenece_a_invitacion_evaluar = this.createBelongsToAccessorFor('resultado_evaluacion_pertenece_a_invitacion_evaluar', invitacionEvaluarRepositoryGetter,);
    this.registerInclusionResolver('resultado_evaluacion_pertenece_a_invitacion_evaluar', this.resultado_evaluacion_pertenece_a_invitacion_evaluar.inclusionResolver);
  }
}
