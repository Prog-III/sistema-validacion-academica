import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyThroughRepositoryFactory} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {Solicitud, SolicitudRelations, Proponente, SolicitudProponente} from '../models';
import {SolicitudProponenteRepository} from './solicitud-proponente.repository';
import {ProponenteRepository} from './proponente.repository';

export class SolicitudRepository extends DefaultCrudRepository<
  Solicitud,
  typeof Solicitud.prototype.id,
  SolicitudRelations
> {

  public readonly proponentes: HasManyThroughRepositoryFactory<Proponente, typeof Proponente.prototype.id,
          SolicitudProponente,
          typeof Solicitud.prototype.id
        >;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('SolicitudProponenteRepository') protected solicitudProponenteRepositoryGetter: Getter<SolicitudProponenteRepository>, @repository.getter('ProponenteRepository') protected proponenteRepositoryGetter: Getter<ProponenteRepository>,
  ) {
    super(Solicitud, dataSource);
    this.proponentes = this.createHasManyThroughRepositoryFactoryFor('proponentes', proponenteRepositoryGetter, solicitudProponenteRepositoryGetter,);
    this.registerInclusionResolver('proponentes', this.proponentes.inclusionResolver);
  }
}
