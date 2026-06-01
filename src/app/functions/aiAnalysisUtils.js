export const roleIdByName = {
  admin: 1,
  cliente: 2,
  veterinario: 3,
};

export function buildAiRequest(history) {
  const symptoms = Array.isArray(history.sintomas) ? history.sintomas : [];

  return [
    `Analiza el historial clinico ${history.id ?? ''} de la mascota ${history.id_mascota}.`,
    `Tipo de registro: ${history.tipo_registro || 'No definido'}.`,
    `Estado actual: ${history.estado || 'No definido'}.`,
    `Sintomas principales: ${JSON.stringify(symptoms)}.`,
    `Observaciones: ${history.observaciones || 'Sin observaciones'}.`,
    'Mira si los antecedentes, dieta, cirugias, enfermedades, desparasitacion, vacunas o convivencia con animales tienen relacion con los sintomas principales.'
  ].join(' ');
}
