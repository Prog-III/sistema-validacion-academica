import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {ConfiguracionUsuarios} from '../llaves/configuracion.usuarios';
import {Usuario} from '../models/usuario.model';


@injectable({scope: BindingScope.TRANSIENT})
export class UsuariosService {
  constructor(/* Add @inject to inject parameters */) { }

  /*
   * Add service methods here
   */
  async CrearUsuario(usuario: Usuario, tokenAutenticacion: string) {
    return await fetch(ConfiguracionUsuarios.urlCrearUsuario, {
      method: 'POST',
      body: JSON.stringify(usuario),
      headers: {
        'Authorization': `Token ${tokenAutenticacion}`,
        'Content-Type': 'application/json'
      }
    })
  }
}
