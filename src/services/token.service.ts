import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {ConfiguracionUsuarios} from '../llaves/configuracion.usuarios';

const fetch = require('node-fetch');

@injectable({scope: BindingScope.TRANSIENT})
export class TokenService {
  constructor(/* Add @inject to inject parameters */) { }

  /*
   * Método para obtener tokens temporales para operaciones especiales
   * de un solo uso en el servicio de usuarios
   */
  async ObtenerTokenTemporal(llaveSecretaJWT: string) {
    return await fetch(ConfiguracionUsuarios.urlObtenerTokenTemporal, {
      method: 'POST',
      headers: {
        'x-jwt-secret-key': llaveSecretaJWT,
        'Content-Type': 'application/json'
      }
    })
  }
}
