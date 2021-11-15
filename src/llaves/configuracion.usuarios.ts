export namespace ConfiguracionUsuarios {
  export const urlServicioUsuarios = 'http://localhost:3002'
  export const urlCrearUsuario = `${urlServicioUsuarios}/usuarios`;
  export const urlObtenerUsuarioPorEmail = (email: string): string => `${urlServicioUsuarios}/usuarios/count?where={"correo": "${email}"}`;
  export const urlAsociarUsuarioRol = (usuarioId: string): string => `${urlServicioUsuarios}/asociar-usuario-roles/${usuarioId}`;

  export const urlVerificarToken = `${urlServicioUsuarios}/verificar-token`
  export const urlObtenerTokenTemporal = `${urlServicioUsuarios}/token-temporal`;

  export const claveSecretaJWT = 'Wf_yF8vxSJt9?0-dTK6cBZVnet|;?+r|Ap:1RZwwR3.Zwdj:|O_0,:*HWT?.WKjFGxh|+1';
  export const claveEncriptacion = 'K=n*#T,G8X+Okw4zsL3w;JWheRn';
}

export namespace ConfiguracionTokens {

}
