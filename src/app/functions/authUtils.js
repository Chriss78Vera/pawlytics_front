// Resuelve compatibilidad con distintas claves historicas del login.
export function getLoginUserDataId(loginResponse) {
  return loginResponse.userData ?? loginResponse.userDat ?? loginResponse.userDataId;
}

// Traduce errores HTTP de login a mensajes seguros para la UI.
export function getLoginErrorMessage(error) {
  if (!error.response) {
    return 'Error con la conexion, intente mas tarde';
  }

  const status = error.response.status;
  const apiMessage = error.response.data?.message ?? error.response.data?.error ?? '';

  if (status === 403 && apiMessage.toLowerCase().includes('inactivo')) {
    return 'Usuario inactivo. Contacta al administrador.';
  }

  if (status === 401 || apiMessage.toLowerCase().includes('contrasena')) {
    return 'Contrasena incorrecta';
  }

  return 'Error con la conexion, intente mas tarde';
}
