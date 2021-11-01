import {AuthenticationStrategy} from '@loopback/authentication';
import {service} from '@loopback/core';
import {HttpErrors, Request} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import parseBearerToken from 'parse-bearer-token';
import {TokenService} from '../services/token.service';

export class AdminStrategy implements AuthenticationStrategy {
  name: string = 'admin';

  constructor(
    @service(TokenService)
    public servicioToken: TokenService
  ) { }

  async authenticate(request: Request): Promise<UserProfile> {
    const token = parseBearerToken(request);
    if (!token) throw new HttpErrors[401]("No existe un token en la solicitud");

    const infoUsuario = await this.servicioToken.VerificarToken(token);
    if (!infoUsuario) throw new HttpErrors[401]("El token es invalido");

    console.log(infoUsuario);


    const {roles, estado} = infoUsuario.data;
    if (!estado) throw new HttpErrors[401]("El usuario no está habilitado en el sistema");

    const esAdministrador = roles.includes("Administrador");
    if (!esAdministrador) throw new HttpErrors[401]("El usuario no tiene los permisos necesarios para realizar la operacion");

    return Object.assign(infoUsuario);
  }
}
