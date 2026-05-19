import userOptions from '@/app/assets/data/userOptions.json';

// Construye el payload de datos personales para crear un veterinario.
export function buildVeterinarianUserDataPayload(form) {
  return {
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    address: form.address.trim(),
    phone: form.phone.trim(),
    identification: form.identification.trim(),
    birthDate: form.birthDate,
  };
}

// Construye el payload de usuario asociado al rol veterinario.
export function buildVeterinarianUserPayload(form, userDataId) {
  return {
    email: form.email.trim(),
    password: form.password,
    roleId: userOptions.roles.veterinario.id,
    userDataId,
    active: true,
  };
}

// Obtiene un nombre humano desde la relacion userData.
export function getUserName(user) {
  const firstName = user.userData?.firstName ?? '';
  const lastName = user.userData?.lastName ?? '';
  return `${firstName} ${lastName}`.trim() || '-';
}

// Traduce ids de rol a etiquetas visibles.
export function getRoleName(roleId) {
  const role = Object.values(userOptions.roles).find((item) => item.id === roleId);
  return role?.label ?? '-';
}

// Restringe el cambio de estado a clientes y veterinarios.
export function canToggleUser(user) {
  return user.roleId === userOptions.roles.cliente.id || user.roleId === userOptions.roles.veterinario.id;
}
