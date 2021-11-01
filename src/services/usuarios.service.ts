import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {ConfiguracionUsuarios} from '../llaves/configuracion.usuarios';
import {Usuario} from '../models/usuario.model';
const fetch = require('node-fetch');


@injectable({scope: BindingScope.TRANSIENT})
export class UsuariosService {
  constructor(/* Add @inject to inject parameters */) { }

  /*
   * Add service methods here
   */
  async CrearUsuario(usuario: Usuario, tokenAutenticacion: string) {
    return await fetch(ConfiguracionUsuarios.urlCrearUsuario, {
      headers: {
        'Authorization': `Bearer ${tokenAutenticacion}`,
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(usuario)
    })
  }
}
