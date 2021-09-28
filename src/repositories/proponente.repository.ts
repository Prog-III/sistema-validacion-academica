import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {Proponente, ProponenteRelations, TipoVinculacion} from '../models';
import {TipoVinculacionRepository} from './tipo-vinculacion.repository';

export class ProponenteRepository extends DefaultCrudRepository<
  Proponente,
  typeof Proponente.prototype.id,
  ProponenteRelations
> {

  public readonly tiene_un: BelongsToAccessor<TipoVinculacion, typeof Proponente.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('TipoVinculacionRepository') protected tipoVinculacionRepositoryGetter: Getter<TipoVinculacionRepository>,
  ) {
    super(Proponente, dataSource);
    this.tiene_un = this.createBelongsToAccessorFor('tiene_un', tipoVinculacionRepositoryGetter,);
    this.registerInclusionResolver('tiene_un', this.tiene_un.inclusionResolver);
  }
}
