import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {Comite, ComiteRelations} from '../models';

export class ComiteRepository extends DefaultCrudRepository<
  Comite,
  typeof Comite.prototype.id,
  ComiteRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(Comite, dataSource);
  }
}
