// Normaliza respuestas de mascotas que pueden venir como arreglo, paginadas o como un solo objeto.
export const normalizeMascotas = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (response?.id) return [response];
  return [];
};

// Extrae metadatos de paginacion y entrega valores seguros cuando el backend falla.
export const normalizePagination = (response, fallbackTotal = 0) => {
  return response?.pagination ?? {
    total: fallbackTotal,
    page: 1,
    limit: 5,
    totalPages: 1,
  };
};

// Construye el nombre visible del propietario asociado a una mascota.
export function getOwnerName(mascota) {
  const firstName = mascota.ownerData?.firstName ?? '';
  const lastName = mascota.ownerData?.lastName ?? '';
  return `${firstName} ${lastName}`.trim() || '-';
}

// Traduce el formulario de mascota al contrato esperado por el backend.
export function buildMascotaPayload(form, userDataId) {
  return {
    typeId: form.typeId,
    breedId: form.breedId,
    name: form.name.trim(),
    birthDate: form.birthDate,
    color: form.color.trim(),
    sex: form.sex,
    weight: Number(form.weight),
    particularSigns: form.particularSigns.trim(),
    userDataId,
  };
}
