// Convierte campos numericos opcionales del formulario en undefined o Number.
function emptyToUndefined(value) {
  return value === '' ? undefined : Number(value);
}

// Traduce el formulario documental al payload de clinical-history en Mongo.
export function buildClinicalHistoryPayload(form) {
  const symptoms = form.sintoma_nombre.trim()
    ? [{
        nombre: form.sintoma_nombre.trim(),
        intensidad: form.sintoma_intensidad,
        duracion: form.sintoma_duracion.trim() || 'No especificada',
        frecuencia: form.sintoma_frecuencia.trim() || 'No especificada',
      }]
    : [];

  return {
    id_mascota: Number(form.id_mascota),
    fecha_registro: form.fecha_registro || undefined,
    tipo_registro: form.tipo_registro,
    sintomas: symptoms,
    datos_salud: {
      peso: emptyToUndefined(form.peso),
      temperatura: emptyToUndefined(form.temperatura),
      frecuencia_cardiaca: emptyToUndefined(form.frecuencia_cardiaca),
      frecuencia_respiratoria: emptyToUndefined(form.frecuencia_respiratoria),
    },
    alimentacion: {
      come_normal: form.come_normal,
      descripcion: form.alimentacion_descripcion.trim(),
    },
    comportamiento: {
      estado_animo: form.estado_animo.trim(),
      nivel_actividad: form.nivel_actividad,
    },
    observaciones: form.observaciones.trim(),
    estado: 'registrado',
  };
}

// Detecta si el veterinario lleno datos relacionales adicionales para clinical-records.
export function hasClinicalRecordsData(form) {
  return Boolean(
    form.diet.trim()
    || form.births !== ''
    || form.animals.trim()
    || form.vaccines.some((vaccine) => vaccine.type.trim())
    || form.dewormingType.trim()
    || form.surgeryType.trim()
    || form.diseaseName.trim()
    || form.sterilization !== ''
  );
}

// Crea los registros relacionales auxiliares y enlaza sus ids en detalle-clinico.
export async function createClinicalRecordsIfNeeded(api, petId, form) {
  if (!hasClinicalRecordsData(form)) {
    return null;
  }

  const vaccineIds = [];
  const vaccines = form.vaccines.filter((vaccine) => vaccine.type.trim());

  for (const vaccine of vaccines) {
    const created = await api.createVaccine({
      type: vaccine.type.trim(),
      date: vaccine.date || undefined,
    });
    vaccineIds.push(created.id);
  }

  const deworming = form.dewormingType.trim()
    ? await api.createDeworming({
        type: form.dewormingType.trim(),
        date: form.dewormingDate || undefined,
      })
    : null;

  const surgery = form.surgeryType.trim()
    ? await api.createSurgery({
        type: form.surgeryType.trim(),
        description: form.surgeryDescription.trim() || undefined,
        date: form.surgeryDate || undefined,
      })
    : null;

  const disease = form.diseaseName.trim()
    ? await api.createDisease({
        name: form.diseaseName.trim(),
        treatment: form.diseaseTreatment.trim() || undefined,
      })
    : null;

  return api.createClinicalDetail({
    petId,
    diet: form.diet.trim() || undefined,
    sterilization: form.sterilization === '' ? undefined : form.sterilization === 'si',
    births: emptyToUndefined(form.births),
    animals: form.animals.trim() || undefined,
    dewormingId: deworming?.id,
    surgeryId: surgery?.id,
    diseaseId: disease?.id,
    vaccineIds,
  });
}
