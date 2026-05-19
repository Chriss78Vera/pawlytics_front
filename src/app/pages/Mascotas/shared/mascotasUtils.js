export const fallbackMascotas = [
  {
    id: 1,
    name: 'Firulais',
    color: 'Cafe',
    sex: 'Macho',
    type: { name: 'Perro' },
    breed: { name: 'Mestizo' },
    ownerData: { firstName: 'Christopher', lastName: 'Vera' },
  },
];

export const normalizeMascotas = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (response?.id) return [response];
  return [];
};

export const normalizePagination = (response, fallbackTotal = 0) => {
  return response?.pagination ?? {
    total: fallbackTotal,
    page: 1,
    limit: 5,
    totalPages: 1,
  };
};

export function getOwnerName(mascota) {
  const firstName = mascota.ownerData?.firstName ?? '';
  const lastName = mascota.ownerData?.lastName ?? '';
  return `${firstName} ${lastName}`.trim() || '-';
}
