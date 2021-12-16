import {AuthenticationStrategy} from '@loopback/authentication';
import {service} from '@loopback/core';
import {HttpErrors, Request} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import parseBearerToken from 'parse-bearer-token';
import {TokenService} from '../services/token.service';

export class TemporalStrategy implements AuthenticationStrategy {
  name: string = 'temporal';

  constructor(
    @service(TokenService)
    public servicioToken: TokenService
  ) {

  }

  async authenticate(request: Request): Promise<UserProfile> {
    const token = parseBearerToken(request);
    if (!token) throw new HttpErrors[401]("No existe un token en la solicitud");

    const infoToken = await this.servicioToken.VerificarToken(token);
    if (!infoToken) throw new HttpErrors[401]("El token es inválido");

    if (infoToken.data.temporal === undefined) throw new HttpErrors[401]("La clase de Token no es válida para la solicitud");

    return Object.assign(infoToken);
  }
}
