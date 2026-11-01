import { DiaSemana, FuncionObra, FrecuenciaTaller, Obra } from '@/services/content/content.types';

export const TIMEZONE_CORDOBA = 'America/Argentina/Cordoba';

const MESES_ABR = [
  'ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN',
  'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC',
];

const DIAS_ABR: Record<number, string> = {
  0: 'DOM',
  1: 'LUN',
  2: 'MAR',
  3: 'MIÉ',
  4: 'JUE',
  5: 'VIE',
  6: 'SÁB',
};

const NUMERO_A_DIA_SEMANA: Record<number, DiaSemana> = {
  0: 'DOMINGO',
  1: 'LUNES',
  2: 'MARTES',
  3: 'MIERCOLES',
  4: 'JUEVES',
  5: 'VIERNES',
  6: 'SABADO',
};

const DIA_SEMANA_A_NUMERO: Record<DiaSemana, number> = {
  DOMINGO: 0,
  LUNES: 1,
  MARTES: 2,
  MIERCOLES: 3,
  JUEVES: 4,
  VIERNES: 5,
  SABADO: 6,
};

/**
 * Normaliza cualquier valor de fecha (string ISO o Date) a string "YYYY-MM-DD".
 * Resuelve el problema común de parseo de gray-matter/YAML donde fechas sin comillas se convierten en Date.
 */
export function normalizeDateString(val: string | Date | null | undefined): string {
  if (!val) return '';
  if (val instanceof Date) {
    const year = val.getUTCFullYear();
    const month = String(val.getUTCMonth() + 1).padStart(2, '0');
    const day = String(val.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  const str = String(val).trim();
  // Si viene con hora ISO (ej. 2026-11-14T00:00:00.000Z), tomar solo YYYY-MM-DD
  return str.split('T')[0];
}

/**
 * Obtiene las partes del día actual en la zona horaria de Córdoba (America/Argentina/Cordoba).
 */
export function getCordobaDateParts(baseDate: Date = new Date()) {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: TIMEZONE_CORDOBA,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const iso = formatter.format(baseDate); // YYYY-MM-DD
  const [yearStr, monthStr, dayStr] = iso.split('-');

  // Para el día de la semana en Córdoba:
  const dayOfWeekFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: TIMEZONE_CORDOBA,
    weekday: 'short',
  });
  const shortWeekday = dayOfWeekFormatter.format(baseDate);
  const weekdayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };

  return {
    year: parseInt(yearStr, 10),
    month: parseInt(monthStr, 10),
    day: parseInt(dayStr, 10),
    dayOfWeek: weekdayMap[shortWeekday] ?? 0,
    isoString: iso,
  };
}

/**
 * Retorna la fecha actual en Córdoba en formato ISO "YYYY-MM-DD".
 */
export function getTodayCordobaString(baseDate: Date = new Date()): string {
  return getCordobaDateParts(baseDate).isoString;
}

/**
 * Verifica si una fecha "YYYY-MM-DD" corresponde exactamente a la fecha de hoy en Córdoba.
 */
export function isDateToday(fechaISO: string, baseDate: Date = new Date()): boolean {
  return normalizeDateString(fechaISO) === getTodayCordobaString(baseDate);
}

/**
 * Calcula las fechas (YYYY-MM-DD) del fin de semana (Viernes, Sábado y Domingo)
 * de la semana actual en Córdoba.
 */
export function getCurrentWeekendDates(baseDate: Date = new Date()): string[] {
  const parts = getCordobaDateParts(baseDate);
  const todayUtc = new Date(Date.UTC(parts.year, parts.month - 1, parts.day));

  // Convertimos a día de semana donde Lunes=1, ..., Domingo=7
  const dayOfWeekIso = parts.dayOfWeek === 0 ? 7 : parts.dayOfWeek;
  
  // Lunes de la semana actual
  const mondayUtc = new Date(todayUtc);
  mondayUtc.setUTCDate(todayUtc.getUTCDate() - (dayOfWeekIso - 1));

  // Viernes (Lunes + 4), Sábado (Lunes + 5), Domingo (Lunes + 6)
  const weekendDates: string[] = [];
  for (const offset of [4, 5, 6]) {
    const d = new Date(mondayUtc);
    d.setUTCDate(mondayUtc.getUTCDate() + offset);
    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    weekendDates.push(`${y}-${m}-${day}`);
  }

  return weekendDates;
}

/**
 * Comprueba si una fecha "YYYY-MM-DD" cae en el fin de semana actual (Vie, Sáb o Dom).
 */
export function isDateInCurrentWeekend(fechaISO: string, baseDate: Date = new Date()): boolean {
  const normalized = normalizeDateString(fechaISO);
  const weekend = getCurrentWeekendDates(baseDate);
  return weekend.includes(normalized);
}

/**
 * Filtra obras que tengan al menos una función cuya fecha sea exactamente hoy.
 */
export function filterObrasHoy(obras: Obra[], baseDate: Date = new Date()): Obra[] {
  const hoy = getTodayCordobaString(baseDate);
  return obras.filter((obra) =>
    obra.funciones?.some((f) => normalizeDateString(f.fecha) === hoy)
  );
}

/**
 * Filtra obras que tengan al menos una función en el viernes, sábado o domingo de la semana actual.
 */
export function filterObrasFinDeSemana(obras: Obra[], baseDate: Date = new Date()): Obra[] {
  const weekend = getCurrentWeekendDates(baseDate);
  return obras.filter((obra) =>
    obra.funciones?.some((f) => weekend.includes(normalizeDateString(f.fecha)))
  );
}

/**
 * Obtiene la próxima función futura (o la más cercana hoy) de una lista de funciones.
 */
export function getNextFuncion(
  funciones: FuncionObra[],
  baseDate: Date = new Date()
): FuncionObra | null {
  if (!funciones || funciones.length === 0) return null;
  const hoy = getTodayCordobaString(baseDate);

  // Ordenar cronológicamente
  const sorted = [...funciones].sort((a, b) => {
    const diff = a.fecha.localeCompare(b.fecha);
    if (diff !== 0) return diff;
    return a.hora.localeCompare(b.hora);
  });

  // Buscar la primera hoy o posterior
  const upcoming = sorted.find((f) => normalizeDateString(f.fecha) >= hoy);
  return upcoming || sorted[0]; // Si todas ya pasaron, devolvemos la última
}

/**
 * Formatea una fecha ISO en badge editorial de 3 partes: "DIA / NUM / MES"
 * Ejemplo: "SÁB / 15 / NOV"
 */
export function formatBadgeDate(fechaISO: string): string {
  const norm = normalizeDateString(fechaISO);
  if (!norm) return '';
  const [y, m, d] = norm.split('-').map((v) => parseInt(v, 10));
  if (!y || !m || !d) return norm;

  const utc = new Date(Date.UTC(y, m - 1, d));
  const dayOfWeek = utc.getUTCDay();
  const diaTexto = DIAS_ABR[dayOfWeek] ?? '';
  const numTexto = String(d).padStart(2, '0');
  const mesTexto = MESES_ABR[m - 1] ?? '';

  return `${diaTexto} / ${numTexto} / ${mesTexto}`;
}

/**
 * Formatea una fecha legible en español (ej. "Sábado 15 de Noviembre de 2026").
 */
export function formatFechaLarga(fechaISO: string): string {
  const norm = normalizeDateString(fechaISO);
  if (!norm) return '';
  const [y, m, d] = norm.split('-').map((v) => parseInt(v, 10));
  if (!y || !m || !d) return norm;

  const mesesLargos = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
  ];
  const diasLargos = [
    'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado',
  ];

  const utc = new Date(Date.UTC(y, m - 1, d));
  const diaSem = diasLargos[utc.getUTCDay()];
  const mes = mesesLargos[m - 1];

  return `${diaSem} ${d} de ${mes}`;
}

/**
 * Determina si un taller con frecuencia QUINCENAL está activo en una fecha objetivo,
 * calculando semanas pares desde fechaReferencia:
 * Math.floor(diffSemanas) % 2 === 0
 */
export function isTallerActiveInWeek(
  frecuencia: FrecuenciaTaller,
  fechaReferencia: string | null | undefined,
  targetDateISO: string
): boolean {
  if (frecuencia === 'SEMANAL') {
    return true;
  }

  if (!fechaReferencia) {
    // Si no tiene fechaReferencia por defecto se considera semana activa
    return true;
  }

  const refNorm = normalizeDateString(fechaReferencia);
  const targetNorm = normalizeDateString(targetDateISO);

  const [ry, rm, rd] = refNorm.split('-').map((v) => parseInt(v, 10));
  const [ty, tm, td] = targetNorm.split('-').map((v) => parseInt(v, 10));

  const refUtc = Date.UTC(ry, rm - 1, rd);
  const targetUtc = Date.UTC(ty, tm - 1, td);

  const diffMs = targetUtc - refUtc;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffWeeks = Math.floor(diffDays / 7);

  // Semanas pares desde la fecha de referencia
  return Math.abs(diffWeeks) % 2 === 0;
}

/**
 * Obtiene el nombre DiaSemana de una fecha ISO en UTC.
 */
export function getDiaSemanaFromISO(fechaISO: string): DiaSemana {
  const norm = normalizeDateString(fechaISO);
  const [y, m, d] = norm.split('-').map((v) => parseInt(v, 10));
  const utc = new Date(Date.UTC(y, m - 1, d));
  return NUMERO_A_DIA_SEMANA[utc.getUTCDay()];
}

/**
 * Convierte DiaSemana a número JavaScript (0=Dom, 1=Lun... 6=Sáb)
 */
export function diaSemanaToNumber(dia: DiaSemana): number {
  return DIA_SEMANA_A_NUMERO[dia];
}
