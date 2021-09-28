import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {Modalidad, ModalidadRelations, Solicitud} from '../models';
import {SolicitudRepository} from './solicitud.repository';

export class ModalidadRepository extends DefaultCrudRepository<
  Modalidad,
  typeof Modalidad.prototype.id,
  ModalidadRelations
> {

  public readonly solicitudes: HasManyRepositoryFactory<Solicitud, typeof Modalidad.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('SolicitudRepository') protected solicitudRepositoryGetter: Getter<SolicitudRepository>,
  ) {
    super(Modalidad, dataSource);
    this.solicitudes = this.createHasManyRepositoryFactoryFor('solicitudes', solicitudRepositoryGetter,);
    this.registerInclusionResolver('solicitudes', this.solicitudes.inclusionResolver);
  }
}
