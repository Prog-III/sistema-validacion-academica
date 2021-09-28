import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory, HasManyThroughRepositoryFactory} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {Jurado, JuradoRelations, InvitacionEvaluar, LineaInvestigacion, JuradoLineaInvestigacion} from '../models';
import {InvitacionEvaluarRepository} from './invitacion-evaluar.repository';
import {JuradoLineaInvestigacionRepository} from './jurado-linea-investigacion.repository';
import {LineaInvestigacionRepository} from './linea-investigacion.repository';

export class JuradoRepository extends DefaultCrudRepository<
  Jurado,
  typeof Jurado.prototype.id,
  JuradoRelations
> {

  public readonly invitacionesEvaluar: HasManyRepositoryFactory<InvitacionEvaluar, typeof Jurado.prototype.id>;

  public readonly lineasInvestigacion: HasManyThroughRepositoryFactory<LineaInvestigacion, typeof LineaInvestigacion.prototype.id,
          JuradoLineaInvestigacion,
          typeof Jurado.prototype.id
        >;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('InvitacionEvaluarRepository') protected invitacionEvaluarRepositoryGetter: Getter<InvitacionEvaluarRepository>, @repository.getter('JuradoLineaInvestigacionRepository') protected juradoLineaInvestigacionRepositoryGetter: Getter<JuradoLineaInvestigacionRepository>, @repository.getter('LineaInvestigacionRepository') protected lineaInvestigacionRepositoryGetter: Getter<LineaInvestigacionRepository>,
  ) {
    super(Jurado, dataSource);
    this.lineasInvestigacion = this.createHasManyThroughRepositoryFactoryFor('lineasInvestigacion', lineaInvestigacionRepositoryGetter, juradoLineaInvestigacionRepositoryGetter,);
    this.registerInclusionResolver('lineasInvestigacion', this.lineasInvestigacion.inclusionResolver);
    this.invitacionesEvaluar = this.createHasManyRepositoryFactoryFor('invitacionesEvaluar', invitacionEvaluarRepositoryGetter,);
    this.registerInclusionResolver('invitacionesEvaluar', this.invitacionesEvaluar.inclusionResolver);
  }
}
