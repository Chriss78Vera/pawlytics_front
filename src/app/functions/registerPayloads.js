// Construye datos personales para registro de cliente.
export function buildRegisterUserDataPayload(form) {
  return {
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    address: form.address.trim(),
    phone: form.phone.trim(),
    identification: form.identification.trim(),
    birthDate: form.birthDate,
  };
}

// Construye usuario cliente para registro manual.
export function buildRegisterUserPayload(form, userDataId) {
  return {
    email: form.email.trim(),
    password: form.password,
    roleId: 2,
    userDataId,
  };
}
