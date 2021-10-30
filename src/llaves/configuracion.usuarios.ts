export namespace ConfiguracionUsuarios {
  export const urlServicioUsuarios = 'http://localhost:3002'
  export const urlCrearUsuario = `${urlServicioUsuarios}/usuarios`;
  export const urlAsociarUsuarioRol = (usuarioId: string): string => `${urlServicioUsuarios}/asociar-usuario-roles/${usuarioId}`;
}
