import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {Jurado, JuradoRelations, InvitacionEvaluar} from '../models';
import {InvitacionEvaluarRepository} from './invitacion-evaluar.repository';

export class JuradoRepository extends DefaultCrudRepository<
  Jurado,
  typeof Jurado.prototype.id,
  JuradoRelations
> {

  public readonly invitacionesEvaluar: HasManyRepositoryFactory<InvitacionEvaluar, typeof Jurado.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('InvitacionEvaluarRepository') protected invitacionEvaluarRepositoryGetter: Getter<InvitacionEvaluarRepository>,
  ) {
    super(Jurado, dataSource);
    this.invitacionesEvaluar = this.createHasManyRepositoryFactoryFor('invitacionesEvaluar', invitacionEvaluarRepositoryGetter,);
    this.registerInclusionResolver('invitacionesEvaluar', this.invitacionesEvaluar.inclusionResolver);
  }
}
