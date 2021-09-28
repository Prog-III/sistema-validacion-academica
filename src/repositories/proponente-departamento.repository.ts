import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {ProponenteDepartamento, ProponenteDepartamentoRelations} from '../models';

export class ProponenteDepartamentoRepository extends DefaultCrudRepository<
  ProponenteDepartamento,
  typeof ProponenteDepartamento.prototype.id,
  ProponenteDepartamentoRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(ProponenteDepartamento, dataSource);
  }
}
