import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import {microsoft_azure} from '../config/index.config';

const config = { // convertirlo a variables de entorno
  name: "mysql",
  connector: "mysql",
  url: "",
  host: microsoft_azure.host,
  port: microsoft_azure.port,
  user: microsoft_azure.user,
  password: microsoft_azure.password,
  database: microsoft_azure.database
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class MysqlDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'mysql';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.mysql', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
