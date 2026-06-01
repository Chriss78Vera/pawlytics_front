const TEXT_PATTERN = /^[A-Za-z0-9\s.,;:()/_#%+-]+$/;
const NAME_PATTERN = /^[A-Za-z\s.'-]+$/;

function parseDate(value) {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function isAfter(left, right) {
  return left && right && left.getTime() > right.getTime();
}

function isSameOrBefore(left, right) {
  return left && right && left.getTime() <= right.getTime();
}

function today() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

function normalizeText(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function hasInvalidText(value, pattern = TEXT_PATTERN) {
  const normalized = normalizeText(value);
  return Boolean(normalized) && !pattern.test(normalized);
}

function hasOnlyDigits(value) {
  return /^[0-9]+$/.test(String(value ?? '').trim());
}

function isMale(pet) {
  return String(pet?.sex ?? '').trim().toLowerCase() === 'macho';
}

function validateOptionalDate({ value, label, minDate, minLabel, errors }) {
  if (!value) return;

  const date = parseDate(value);
  if (!date) {
    errors.push(`${label} debe ser una fecha valida.`);
    return;
  }

  if (isAfter(date, today())) {
    errors.push(`${label} no puede ser una fecha futura.`);
  }

  if (minDate && isSameOrBefore(date, minDate)) {
    errors.push(`${label} debe ser posterior a ${minLabel}.`);
  }
}

function validatePositiveNumber({ value, label, min, max, errors }) {
  if (value === '' || value === undefined || value === null) return;

  const number = Number(value);
  if (Number.isNaN(number)) {
    errors.push(`${label} debe ser numerico.`);
    return;
  }

  if (number < min || number > max) {
    errors.push(`${label} debe estar entre ${min} y ${max}.`);
  }
}

export function validateMascotaForm(form) {
  const errors = [];
  const birthDate = parseDate(form.birthDate);

  if (!form.name.trim()) errors.push('El nombre de la mascota es obligatorio.');
  if (hasInvalidText(form.name, NAME_PATTERN)) errors.push('El nombre solo debe contener letras, espacios, apostrofes o guiones.');
  if (hasInvalidText(form.color, NAME_PATTERN)) errors.push('El color solo debe contener letras y espacios.');
  if (hasInvalidText(form.particularSigns)) errors.push('Las senas particulares contienen caracteres no permitidos.');

  if (!birthDate) {
    errors.push('La fecha de nacimiento es obligatoria y debe ser valida.');
  } else if (isAfter(birthDate, today())) {
    errors.push('La fecha de nacimiento no puede ser futura.');
  }

  validatePositiveNumber({
    value: form.weight,
    label: 'El peso',
    min: 0.1,
    max: 120,
    errors,
  });

  return errors;
}

export function validateRegisterForm(form) {
  const errors = [];
  const identification = String(form.identification ?? '').trim();
  const phone = String(form.phone ?? '').trim();

  if (!hasOnlyDigits(identification)) {
    errors.push('La identificacion solo debe contener numeros del 0 al 9.');
  } else if (identification.length !== 10) {
    errors.push('La identificacion debe tener exactamente 10 caracteres numericos.');
  }

  if (!hasOnlyDigits(phone)) {
    errors.push('El telefono solo debe contener numeros del 0 al 9.');
  } else if (phone.length !== 9) {
    errors.push('El telefono debe tener exactamente 9 caracteres numericos.');
  }

  return errors;
}

export function validateClinicalHistoryForms({ historyForm, recordsForm, pet }) {
  const errors = [];
  const petBirthDate = parseDate(pet?.birthDate);

  if (!pet) {
    errors.push('Selecciona una mascota valida.');
  }

  if (!historyForm.fecha_registro) {
    errors.push('La fecha de registro es obligatoria.');
  }

  validateOptionalDate({
    value: historyForm.fecha_registro,
    label: 'La fecha de registro',
    minDate: petBirthDate,
    minLabel: 'la fecha de nacimiento de la mascota',
    errors,
  });

  validatePositiveNumber({ value: historyForm.peso, label: 'El peso del historial', min: 0.1, max: 120, errors });
  validatePositiveNumber({ value: historyForm.temperatura, label: 'La temperatura', min: 35, max: 43, errors });
  validatePositiveNumber({ value: historyForm.frecuencia_cardiaca, label: 'La frecuencia cardiaca', min: 20, max: 300, errors });
  validatePositiveNumber({ value: historyForm.frecuencia_respiratoria, label: 'La frecuencia respiratoria', min: 5, max: 120, errors });

  [
    ['Sintoma', historyForm.sintoma_nombre],
    ['Duracion del sintoma', historyForm.sintoma_duracion],
    ['Frecuencia del sintoma', historyForm.sintoma_frecuencia],
    ['Estado de animo', historyForm.estado_animo],
    ['Detalle de alimentacion', historyForm.alimentacion_descripcion],
    ['Observaciones', historyForm.observaciones],
  ].forEach(([label, value]) => {
    if (hasInvalidText(value)) errors.push(`${label} contiene caracteres no permitidos.`);
  });

  const births = recordsForm.births === '' ? 0 : Number(recordsForm.births);
  if (recordsForm.births !== '' && (!Number.isInteger(births) || births < 0 || births > 30)) {
    errors.push('Partos debe ser un numero entero entre 0 y 30.');
  }

  if (isMale(pet) && births > 0) {
    errors.push('Una mascota macho no puede registrar partos.');
  }

  recordsForm.vaccines.forEach((vaccine, index) => {
    const hasType = vaccine.type.trim();
    if (hasInvalidText(vaccine.type)) errors.push(`La vacuna ${index + 1} contiene caracteres no permitidos.`);
    if (vaccine.date && !hasType) errors.push(`La vacuna ${index + 1} necesita tipo si tiene fecha.`);
    if (hasType && !vaccine.date) errors.push(`La vacuna ${index + 1} necesita fecha.`);
    validateOptionalDate({
      value: vaccine.date,
      label: `La fecha de vacuna ${index + 1}`,
      minDate: petBirthDate,
      minLabel: 'la fecha de nacimiento de la mascota',
      errors,
    });
  });

  [
    ['Dieta', recordsForm.diet],
    ['Convive con animales', recordsForm.animals],
    ['Tipo de desparasitacion', recordsForm.dewormingType],
    ['Tipo de cirugia', recordsForm.surgeryType],
    ['Descripcion de cirugia', recordsForm.surgeryDescription],
    ['Nombre de enfermedad', recordsForm.diseaseName],
    ['Tratamiento de enfermedad', recordsForm.diseaseTreatment],
  ].forEach(([label, value]) => {
    if (hasInvalidText(value)) errors.push(`${label} contiene caracteres no permitidos.`);
  });

  if (recordsForm.dewormingDate && !recordsForm.dewormingType.trim()) {
    errors.push('La desparasitacion necesita tipo si tiene fecha.');
  }
  if (recordsForm.dewormingType.trim() && !recordsForm.dewormingDate) {
    errors.push('La desparasitacion necesita fecha.');
  }
  validateOptionalDate({
    value: recordsForm.dewormingDate,
    label: 'La fecha de desparasitacion',
    minDate: petBirthDate,
    minLabel: 'la fecha de nacimiento de la mascota',
    errors,
  });

  if (recordsForm.surgeryDate && !recordsForm.surgeryType.trim()) {
    errors.push('La cirugia necesita tipo si tiene fecha.');
  }
  if (recordsForm.surgeryType.trim() && !recordsForm.surgeryDate) {
    errors.push('La cirugia necesita fecha.');
  }
  validateOptionalDate({
    value: recordsForm.surgeryDate,
    label: 'La fecha de cirugia',
    minDate: petBirthDate,
    minLabel: 'la fecha de nacimiento de la mascota',
    errors,
  });

  return errors;
}
