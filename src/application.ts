import {AuthenticationComponent, registerAuthenticationStrategy} from '@loopback/authentication';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {MySequence} from './sequence';
import {AdminStrategy} from './strategies/admin.strategy';
import {AuxiliarStrategy} from './strategies/auxiliar.strategy';
import {DirectorStrategy} from './strategies/director.strategy';
import {EvaluadorStrategy} from './strategies/evaluador.strategy';
import {TemporalStrategy} from './strategies/temporal.strategy';

export {ApplicationConfig};

export class App extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };

    registerAuthenticationStrategy(this, AdminStrategy);
    registerAuthenticationStrategy(this, AuxiliarStrategy);
    registerAuthenticationStrategy(this, EvaluadorStrategy);
    registerAuthenticationStrategy(this, DirectorStrategy);
    registerAuthenticationStrategy(this, TemporalStrategy);
    this.component(AuthenticationComponent);
  }
}
