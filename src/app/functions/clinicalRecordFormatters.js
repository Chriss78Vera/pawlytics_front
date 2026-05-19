// Formatea fechas clinicas con locale colombiano para mostrarlas en tablas y detalle.
export function formatDate(date) {
  if (!date) return '-';
  return new Intl.DateTimeFormat('es-CO').format(new Date(date));
}

// Agrega la unidad visual a metricas clinicas opcionales.
export function formatMetric(value, unit) {
  if (value === undefined || value === null || value === '') {
    return '-';
  }

  return `${value} ${unit}`;
}

// Muestra registros simples como vacunas o desparasitaciones en una sola linea.
export function formatSimpleRecord(record) {
  if (!record) return '-';
  return [record.type, record.date ? formatDate(record.date) : ''].filter(Boolean).join(' - ');
}

// Muestra cirugias combinando tipo, descripcion y fecha cuando existen.
export function formatSurgery(surgery) {
  if (!surgery) return '-';
  return [surgery.type, surgery.description, surgery.date ? formatDate(surgery.date) : ''].filter(Boolean).join(' - ');
}

// Muestra enfermedad y tratamiento en un texto compacto.
export function formatDisease(disease) {
  if (!disease) return '-';
  return [disease.name, disease.treatment].filter(Boolean).join(' - ');
}

// Junta multiples vacunas registradas para la mascota.
export function formatVaccines(vaccines = []) {
  if (!vaccines.length) return '-';
  return vaccines.map((vaccine) => formatSimpleRecord(vaccine)).join(', ');
}
