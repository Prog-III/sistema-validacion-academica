import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {LineaInvestigacion, LineaInvestigacionRelations, Solicitud} from '../models';
import {SolicitudRepository} from './solicitud.repository';

export class LineaInvestigacionRepository extends DefaultCrudRepository<
  LineaInvestigacion,
  typeof LineaInvestigacion.prototype.id,
  LineaInvestigacionRelations
> {

  public readonly solicitudes: HasManyRepositoryFactory<Solicitud, typeof LineaInvestigacion.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('SolicitudRepository') protected solicitudRepositoryGetter: Getter<SolicitudRepository>,
  ) {
    super(LineaInvestigacion, dataSource);
    this.solicitudes = this.createHasManyRepositoryFactoryFor('solicitudes', solicitudRepositoryGetter,);
    this.registerInclusionResolver('solicitudes', this.solicitudes.inclusionResolver);
  }
}
