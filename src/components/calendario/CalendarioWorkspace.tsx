'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Obra, Taller } from '@/services/content/content.types';
import {
  getCordobaDateParts,
  normalizeDateString,
  isTallerActiveInWeek,
  getDiaSemanaFromISO,
  formatFechaLarga,
} from '@/lib/dates';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Sparkles,
  MapPin,
  ArrowRight,
  User,
  GraduationCap,
  Film,
  CalendarDays,
  ListFilter,
  CheckCircle2,
} from 'lucide-react';

export interface CalendarioEvent {
  id: string;
  tipo: 'obra' | 'jam' | 'taller';
  titulo: string;
  subtitulo?: string;
  fecha: string; // YYYY-MM-DD
  hora: string;  // HH:mm
  horaFin?: string;
  espacio: string;
  precio?: number;
  precioPorMes?: number;
  docentes?: string;
  esJam: boolean;
  slug?: string;
  asuntoContacto: 'reserva-obras' | 'talleres';
}

interface CalendarioWorkspaceProps {
  obras: Obra[];
  talleres: Taller[];
}

type VistaModo = 'mes' | 'semana' | 'listado';
type DisciplinaFiltro = 'todas' | 'jam';

const MESES_NOMBRES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

const DIAS_CABECERA = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

export function CalendarioWorkspace({ obras, talleres }: CalendarioWorkspaceProps) {
  const cordobaToday = useMemo(() => getCordobaDateParts(), []);
  
  // Estado de navegación temporal (Año y Mes)
  const [currentYear, setCurrentYear] = useState<number>(cordobaToday.year);
  const [currentMonth, setCurrentMonth] = useState<number>(cordobaToday.month); // 1-12
  const [selectedDate, setSelectedDate] = useState<string>(cordobaToday.isoString);

  // Selector de vistas: Mes | Semana | Listado
  const [vista, setVista] = useState<VistaModo>('mes');

  // Filtro de Disciplinas (REGLA ESTRICTA: Solo 'Todas' y 'Jam Escénica')
  const [disciplina, setDisciplina] = useState<DisciplinaFiltro>('todas');

  // Navegación de mes
  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleResetToday = () => {
    setCurrentYear(cordobaToday.year);
    setCurrentMonth(cordobaToday.month);
    setSelectedDate(cordobaToday.isoString);
  };

  // 1. Proyección de eventos para el mes seleccionado y semanas adyacentes
  const allEvents = useMemo(() => {
    const events: CalendarioEvent[] = [];

    // A. Proyectar funciones de Obras y Jams
    obras.forEach((obra) => {
      // Si el filtro es 'jam' y no es jam, omitir
      if (disciplina === 'jam' && !obra.esJam) return;

      obra.funciones.forEach((fn, idx) => {
        const fechaNorm = normalizeDateString(fn.fecha);
        events.push({
          id: `obra-${obra.id}-${fechaNorm}-${idx}`,
          tipo: obra.esJam ? 'jam' : 'obra',
          titulo: obra.titulo,
          subtitulo: obra.subtitulo,
          fecha: fechaNorm,
          hora: fn.hora,
          espacio: obra.espacioEscenico,
          precio: obra.precio,
          esJam: obra.esJam,
          slug: obra.slug,
          asuntoContacto: 'reserva-obras',
        });
      });
    });

    // B. Proyectar clases de Talleres si la disciplina es 'todas'
    // REGLA: Si taller.estado === 'EN_RECESO', NO se muestra bajo ninguna circunstancia
    if (disciplina === 'todas') {
      const vigentes = talleres.filter((t) => t.estado === 'VIGENTE');

      // Proyectamos para los días del mes actual (y un margen de 7 días antes/después para grillas completas)
      const startDate = new Date(Date.UTC(currentYear, currentMonth - 2, 20));
      const endDate = new Date(Date.UTC(currentYear, currentMonth, 15));

      for (let d = new Date(startDate); d <= endDate; d.setUTCDate(d.getUTCDate() + 1)) {
        const y = d.getUTCFullYear();
        const m = String(d.getUTCMonth() + 1).padStart(2, '0');
        const day = String(d.getUTCDate()).padStart(2, '0');
        const dateIso = `${y}-${m}-${day}`;
        const diaSemana = getDiaSemanaFromISO(dateIso);

        vigentes.forEach((taller) => {
          // Comprobar si el taller tiene horario en este día de la semana
          const horariosDia = taller.horarios.filter((h) => h.diaSemana === diaSemana);
          if (horariosDia.length === 0) return;

          // Si es quincenal, verificar semana activa desde fechaReferencia
          if (
            taller.frecuencia === 'QUINCENAL' &&
            !isTallerActiveInWeek('QUINCENAL', taller.fechaReferencia, dateIso)
          ) {
            return;
          }

          horariosDia.forEach((h, hIdx) => {
            events.push({
              id: `taller-${taller.id}-${dateIso}-${hIdx}`,
              tipo: 'taller',
              titulo: taller.nombre,
              subtitulo: taller.nivel || 'Taller Regular',
              fecha: dateIso,
              hora: h.horaInicio,
              horaFin: h.horaFin,
              espacio: 'Sala Baobabs',
              precioPorMes: taller.precioPorMes,
              docentes: taller.docentes,
              esJam: false,
              asuntoContacto: 'talleres',
            });
          });
        });
      }
    }

    // Ordenar cronológicamente
    return events.sort((a, b) => {
      const diffF = a.fecha.localeCompare(b.fecha);
      if (diffF !== 0) return diffF;
      return a.hora.localeCompare(b.hora);
    });
  }, [obras, talleres, currentYear, currentMonth, disciplina]);

  // Contador dinámico de funciones y jams del mes actual
  const monthStats = useMemo(() => {
    const prefix = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;
    const monthEvents = allEvents.filter((e) => e.fecha.startsWith(prefix));
    const funcionesCount = monthEvents.filter((e) => e.tipo === 'obra').length;
    const jamsCount = monthEvents.filter((e) => e.tipo === 'jam').length;
    const talleresCount = monthEvents.filter((e) => e.tipo === 'taller').length;

    return {
      total: monthEvents.length,
      funcionesCount,
      jamsCount,
      talleresCount,
    };
  }, [allEvents, currentYear, currentMonth]);

  // Eventos para el día seleccionado en el panel lateral
  const selectedDayEvents = useMemo(() => {
    return allEvents.filter((e) => e.fecha === selectedDate);
  }, [allEvents, selectedDate]);

  // Construcción de la matriz mensual (Lunes a Domingo)
  const monthCalendarGrid = useMemo(() => {
    const firstDayOfMonth = new Date(Date.UTC(currentYear, currentMonth - 1, 1));
    const dayOfWeek = firstDayOfMonth.getUTCDay(); // 0=Dom, 1=Lun...
    const isoDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek; // 1=Lun... 7=Dom

    // Inicio de la grilla (Lunes anterior o el 1° si cae lunes)
    const gridStart = new Date(firstDayOfMonth);
    gridStart.setUTCDate(firstDayOfMonth.getUTCDate() - (isoDayOfWeek - 1));

    const weeks: Array<Array<{ dateIso: string; dayNum: number; isCurrentMonth: boolean; events: CalendarioEvent[] }>> = [];
    const currentDayIter = new Date(gridStart);

    for (let w = 0; w < 6; w++) {
      const weekDays: Array<{ dateIso: string; dayNum: number; isCurrentMonth: boolean; events: CalendarioEvent[] }> = [];
      for (let d = 0; d < 7; d++) {
        const y = currentDayIter.getUTCFullYear();
        const m = currentDayIter.getUTCMonth() + 1;
        const dayNum = currentDayIter.getUTCDate();
        const dateIso = `${y}-${String(m).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
        const isCurrentMonth = m === currentMonth && y === currentYear;

        const dayEvents = allEvents.filter((e) => e.fecha === dateIso);
        weekDays.push({ dateIso, dayNum, isCurrentMonth, events: dayEvents });

        currentDayIter.setUTCDate(currentDayIter.getUTCDate() + 1);
      }
      weeks.push(weekDays);

      // Si terminamos el mes y ya completamos una semana, cortamos si la próxima semana es 100% del próximo mes
      const nextWeekStartMonth = currentDayIter.getUTCMonth() + 1;
      if (nextWeekStartMonth !== currentMonth && w >= 3) {
        break;
      }
    }

    return weeks;
  }, [currentYear, currentMonth, allEvents]);

  // Días de la semana seleccionada para la Vista Semana
  const weekViewDays = useMemo(() => {
    const [sy, sm, sd] = selectedDate.split('-').map((v) => parseInt(v, 10));
    const sel = new Date(Date.UTC(sy, sm - 1, sd));
    const dow = sel.getUTCDay();
    const isoDow = dow === 0 ? 7 : dow; // 1=Lun, ..., 7=Dom

    const monday = new Date(sel);
    monday.setUTCDate(sel.getUTCDate() - (isoDow - 1));

    const days: Array<{ dateIso: string; dayNum: number; diaLabel: string; events: CalendarioEvent[] }> = [];
    for (let i = 0; i < 7; i++) {
      const curr = new Date(monday);
      curr.setUTCDate(monday.getUTCDate() + i);
      const y = curr.getUTCFullYear();
      const m = String(curr.getUTCMonth() + 1).padStart(2, '0');
      const dNum = curr.getUTCDate();
      const iso = `${y}-${m}-${String(dNum).padStart(2, '0')}`;
      days.push({
        dateIso: iso,
        dayNum: dNum,
        diaLabel: DIAS_CABECERA[i],
        events: allEvents.filter((e) => e.fecha === iso),
      });
    }

    return days;
  }, [selectedDate, allEvents]);

  // Eventos para la Vista Listado (estilo Alternativa Teatral)
  const listadoEvents = useMemo(() => {
    const prefix = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;
    return allEvents.filter((e) => e.fecha.startsWith(prefix));
  }, [allEvents, currentYear, currentMonth]);

  return (
    <div className="flex flex-col gap-8">
      {/* 1. Barra de Controles Superiores */}
      <div className="flex flex-col gap-6 rounded-2xl border border-surface-container-highest/70 bg-surface-container/60 p-5 backdrop-blur-md lg:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Navegador de Mes */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 rounded-lg border border-surface-container-highest bg-surface-container-low p-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                aria-label="Mes anterior"
                className="rounded-md p-2 text-on-surface-variant hover:bg-surface-container hover:text-white transition-colors cursor-pointer"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                aria-label="Mes siguiente"
                className="rounded-md p-2 text-on-surface-variant hover:bg-surface-container hover:text-white transition-colors cursor-pointer"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-2xl font-bold tracking-tight text-white md:text-3xl">
                  {MESES_NOMBRES[currentMonth - 1]} {currentYear}
                </h2>
                <button
                  type="button"
                  onClick={handleResetToday}
                  className="rounded-md border border-teal-accent/30 bg-teal-accent/10 px-2 py-0.5 text-[11px] font-bold text-teal-accent hover:bg-teal-accent hover:text-primary-dark transition-colors"
                >
                  Hoy
                </button>
              </div>
              <p className="text-xs text-on-surface-variant mt-0.5">
                {monthStats.funcionesCount} funciones de sala · {monthStats.jamsCount} jams
                {disciplina === 'todas' && ` · ${monthStats.talleresCount} clases`}
              </p>
            </div>
          </div>

          {/* Selector de Vistas: Mes | Semana | Listado */}
          <div className="flex items-center gap-1 rounded-xl border border-surface-container-highest bg-surface-container-low p-1 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setVista('mes')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition-all cursor-pointer ${
                vista === 'mes'
                  ? 'bg-primary text-primary-dark shadow-cyan-glow'
                  : 'text-on-surface-variant hover:text-white'
              }`}
            >
              <CalendarDays className="h-4 w-4" />
              <span>Vista Mes</span>
            </button>

            <button
              type="button"
              onClick={() => setVista('semana')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition-all cursor-pointer ${
                vista === 'semana'
                  ? 'bg-primary text-primary-dark shadow-cyan-glow'
                  : 'text-on-surface-variant hover:text-white'
              }`}
            >
              <CalendarIcon className="h-4 w-4" />
              <span>Semana</span>
            </button>

            <button
              type="button"
              onClick={() => setVista('listado')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition-all cursor-pointer ${
                vista === 'listado'
                  ? 'bg-primary text-primary-dark shadow-cyan-glow'
                  : 'text-on-surface-variant hover:text-white'
              }`}
            >
              <ListFilter className="h-4 w-4" />
              <span>Listado</span>
            </button>
          </div>
        </div>

        {/* Filtro de Disciplinas (REGLA ESTRICTA: ÚNICAMENTE 'Todas' y 'Jam Escénica') */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-surface-container-highest/60 pt-4">
          <div className="flex items-center gap-2">
            <span className="label-caps text-on-surface-variant mr-1">Disciplina:</span>
            
            <button
              type="button"
              onClick={() => setDisciplina('todas')}
              className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                disciplina === 'todas'
                  ? 'bg-primary text-primary-dark shadow-cyan-glow'
                  : 'border border-surface-container-highest bg-surface-container-low text-on-surface-variant hover:text-white hover:bg-surface-container'
              }`}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Todas las Actividades</span>
            </button>

            <button
              type="button"
              onClick={() => setDisciplina('jam')}
              className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                disciplina === 'jam'
                  ? 'bg-tertiary text-white shadow-[0_0_16px_rgba(168,85,247,0.4)]'
                  : 'border border-surface-container-highest bg-surface-container-low text-on-surface-variant hover:text-white hover:bg-surface-container'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-secondary" />
              <span>Jam Escénica</span>
            </button>
          </div>

          <div className="hidden text-xs text-on-surface-variant lg:block">
            Zona horaria de referencia: <strong className="text-white">Córdoba (America/Argentina/Cordoba)</strong>
          </div>
        </div>
      </div>

      {/* 2. Cuerpo Principal del Calendario */}
      {vista === 'listado' ? (
        /* VISTA LISTADO: Estilo Alternativa Teatral */
        <div className="rounded-2xl border border-surface-container-highest/70 bg-surface-container/40 p-6 backdrop-blur-md">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="font-serif text-2xl font-bold text-white">
              Programación Cronológica · {MESES_NOMBRES[currentMonth - 1]} {currentYear}
            </h3>
            <span className="text-xs text-teal-accent font-semibold">
              {listadoEvents.length} eventos programados
            </span>
          </div>

          {listadoEvents.length > 0 ? (
            <div className="divide-y divide-surface-container-highest/50">
              {listadoEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="group flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between transition-colors hover:bg-surface-container/50 px-3 rounded-xl"
                >
                  <div className="flex items-start gap-4">
                    {/* Badge de fecha */}
                    <div className="flex h-14 w-16 shrink-0 flex-col items-center justify-center rounded-xl border border-primary/30 bg-surface-container-lowest/80 text-center">
                      <span className="text-[10px] font-bold uppercase text-primary">
                        {ev.fecha.slice(8, 10)}
                      </span>
                      <span className="label-caps text-[9px] text-teal-accent">
                        {MESES_NOMBRES[parseInt(ev.fecha.slice(5, 7), 10) - 1].slice(0, 3)}
                      </span>
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        {ev.tipo === 'jam' ? (
                          <span className="rounded-full bg-tertiary/20 px-2.5 py-0.5 text-[10px] font-bold text-tertiary-light">
                            Jam Escénica
                          </span>
                        ) : ev.tipo === 'taller' ? (
                          <span className="rounded-full bg-teal-accent/20 px-2.5 py-0.5 text-[10px] font-bold text-teal-accent">
                            Taller Regular
                          </span>
                        ) : (
                          <span className="rounded-full bg-primary/20 px-2.5 py-0.5 text-[10px] font-bold text-primary">
                            Obra de Sala
                          </span>
                        )}

                        <span className="flex items-center gap-1 text-xs text-white font-semibold">
                          <Clock className="h-3 w-3 text-teal-accent" />
                          {ev.hora} hs {ev.horaFin && `a ${ev.horaFin} hs`}
                        </span>
                      </div>

                      <h4 className="mt-1 font-serif text-lg font-bold text-white group-hover:text-primary transition-colors">
                        {ev.titulo}
                      </h4>

                      {ev.docentes && (
                        <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-0.5">
                          <User className="h-3 w-3 text-teal-accent" />
                          <span>Coordina: {ev.docentes}</span>
                        </p>
                      )}

                      <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3 text-primary" />
                        <span>{ev.espacio}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    {ev.precio && (
                      <span className="font-serif text-base font-extrabold text-white">
                        ${ev.precio.toLocaleString('es-AR')}
                      </span>
                    )}

                    <Link
                      href={`/contacto?asunto=${ev.asuntoContacto}&item=${encodeURIComponent(ev.titulo)}#formulario`}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-dark shadow-cyan-glow hover:brightness-110 transition-all"
                    >
                      <span>{ev.tipo === 'taller' ? 'Inscribirme' : 'Reservar Butaca'}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-on-surface-variant">
              No hay eventos en este mes para la disciplina seleccionada.
            </div>
          )}
        </div>
      ) : vista === 'semana' ? (
        /* VISTA SEMANA: 7 columnas enfocadas */
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8 rounded-2xl border border-surface-container-highest/70 bg-surface-container/40 p-5 backdrop-blur-md">
            <h3 className="label-caps mb-4 text-teal-accent">
              Semana del {weekViewDays[0].dayNum} al {weekViewDays[6].dayNum} de {MESES_NOMBRES[currentMonth - 1]}
            </h3>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-7">
              {weekViewDays.map((d) => {
                const isSelected = selectedDate === d.dateIso;
                const isToday = d.dateIso === cordobaToday.isoString;

                return (
                  <button
                    key={d.dateIso}
                    type="button"
                    onClick={() => setSelectedDate(d.dateIso)}
                    className={`flex flex-col items-center rounded-xl p-3 border transition-all text-left cursor-pointer ${
                      isSelected
                        ? 'border-primary bg-primary/10 shadow-cyan-glow'
                        : isToday
                        ? 'border-teal-accent/50 bg-surface-container'
                        : 'border-surface-container-highest/50 bg-surface-container-low hover:border-surface-container-high'
                    }`}
                  >
                    <span className="text-[11px] font-bold uppercase text-on-surface-variant">
                      {d.diaLabel}
                    </span>
                    <span className="mt-1 font-serif text-xl font-bold text-white">
                      {d.dayNum}
                    </span>

                    {/* Indicador de eventos */}
                    <div className="mt-3 flex flex-col gap-1 w-full">
                      {d.events.slice(0, 3).map((e) => (
                        <div
                          key={e.id}
                          className={`truncate rounded px-1.5 py-0.5 text-[9px] font-bold text-left ${
                            e.tipo === 'jam'
                              ? 'bg-tertiary text-white'
                              : e.tipo === 'taller'
                              ? 'bg-teal-accent/20 text-teal-accent'
                              : 'bg-primary/20 text-primary'
                          }`}
                        >
                          {e.hora} {e.titulo}
                        </div>
                      ))}
                      {d.events.length > 3 && (
                        <span className="text-[9px] text-on-surface-variant text-center font-bold">
                          +{d.events.length - 3} más
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Panel Lateral del Día Seleccionado en Semana */}
          <div className="lg:col-span-4">
            <DetalleDiaPanel
              dateIso={selectedDate}
              events={selectedDayEvents}
            />
          </div>
        </div>
      ) : (
        /* VISTA MES: Grilla tradicional de 7 columnas + Panel Lateral */
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Grilla Mensual (8 columnas) */}
          <div className="lg:col-span-8 rounded-2xl border border-surface-container-highest/70 bg-surface-container/40 p-4 sm:p-6 backdrop-blur-md">
            {/* Cabecera de días Lunes - Domingo */}
            <div className="grid grid-cols-7 gap-1 pb-3 text-center">
              {DIAS_CABECERA.map((dia) => (
                <div key={dia} className="label-caps text-[11px] text-teal-accent">
                  {dia}
                </div>
              ))}
            </div>

            {/* Matriz de semanas */}
            <div className="space-y-1">
              {monthCalendarGrid.map((week, wIdx) => (
                <div key={wIdx} className="grid grid-cols-7 gap-1">
                  {week.map((cell) => {
                    const isSelected = selectedDate === cell.dateIso;
                    const isToday = cell.dateIso === cordobaToday.isoString;

                    return (
                      <button
                        key={cell.dateIso}
                        type="button"
                        onClick={() => setSelectedDate(cell.dateIso)}
                        className={`group relative flex min-h-[86px] sm:min-h-[104px] flex-col rounded-xl p-2 border transition-all text-left cursor-pointer ${
                          isSelected
                            ? 'border-primary bg-primary/10 shadow-cyan-glow z-10'
                            : isToday
                            ? 'border-teal-accent/50 bg-surface-container/90'
                            : cell.isCurrentMonth
                            ? 'border-surface-container-highest/40 bg-surface-container-low hover:border-surface-container-high hover:bg-surface-container'
                            : 'border-transparent bg-surface-container-lowest/30 opacity-40 hover:opacity-80'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span
                            className={`font-serif text-sm font-bold ${
                              isSelected
                                ? 'text-primary'
                                : isToday
                                ? 'text-teal-accent'
                                : cell.isCurrentMonth
                                ? 'text-white'
                                : 'text-on-surface-variant'
                            }`}
                          >
                            {cell.dayNum}
                          </span>

                          {cell.events.length > 0 && (
                            <span className="flex h-2 w-2 rounded-full bg-primary" />
                          )}
                        </div>

                        {/* Eventos dentro de la celda */}
                        <div className="mt-1 flex flex-col gap-1 w-full overflow-hidden">
                          {cell.events.slice(0, 2).map((ev) => (
                            <div
                              key={ev.id}
                              className={`truncate rounded px-1.5 py-0.5 text-[9px] font-semibold ${
                                ev.tipo === 'jam'
                                  ? 'bg-tertiary text-white'
                                  : ev.tipo === 'taller'
                                  ? 'bg-teal-accent/20 text-teal-accent'
                                  : 'bg-primary/20 text-primary'
                              }`}
                            >
                              {ev.hora} {ev.titulo}
                            </div>
                          ))}
                          {cell.events.length > 2 && (
                            <span className="text-[9px] text-on-surface-variant font-bold text-center">
                              +{cell.events.length - 2} más
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Panel Lateral: Detalle del Día Seleccionado (4 columnas) */}
          <div className="lg:col-span-4">
            <DetalleDiaPanel
              dateIso={selectedDate}
              events={selectedDayEvents}
            />
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Panel Lateral con eventos del día seleccionado.
 * Todo botón de "Reservar", "Reservar Butaca" o "Consultar"
 * lleva DIRECTAMENTE a /contacto con el asunto preseleccionado (sin drawer lateral).
 */
function DetalleDiaPanel({
  dateIso,
  events,
}: {
  dateIso: string;
  events: CalendarioEvent[];
}) {
  return (
    <div className="flex flex-col rounded-2xl border border-surface-container-highest/80 bg-surface-container/70 p-6 backdrop-blur-md lg:sticky lg:top-24">
      <div className="border-b border-surface-container-highest/60 pb-4">
        <span className="label-caps text-teal-accent">Detalle de la Jornada</span>
        <h3 className="mt-1 font-serif text-xl font-bold text-white">
          {formatFechaLarga(dateIso)}
        </h3>
        <p className="text-xs text-on-surface-variant mt-0.5">
          {events.length === 0
            ? 'Sin actividades programadas'
            : `${events.length} actividad${events.length > 1 ? 'es' : ''} en agenda`}
        </p>
      </div>

      <div className="mt-5 space-y-4 max-h-[600px] overflow-y-auto pr-1">
        {events.length > 0 ? (
          events.map((ev) => {
            const reservaUrl = `/contacto?asunto=${ev.asuntoContacto}&item=${encodeURIComponent(ev.titulo)}#formulario`;

            return (
              <div
                key={ev.id}
                className="flex flex-col justify-between rounded-xl border border-surface-container-highest/70 bg-surface-container-low p-4 transition-all hover:border-primary/40"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    {ev.tipo === 'jam' ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-tertiary/20 px-2 py-0.5 text-[10px] font-bold text-tertiary-light">
                        <Sparkles className="h-3 w-3" /> Jam Escénica
                      </span>
                    ) : ev.tipo === 'taller' ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-teal-accent/20 px-2 py-0.5 text-[10px] font-bold text-teal-accent">
                        <GraduationCap className="h-3 w-3" /> Taller Regular
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-bold text-primary">
                        <Film className="h-3 w-3" /> Obra de Sala
                      </span>
                    )}

                    <span className="flex items-center gap-1 text-xs font-bold text-white">
                      <Clock className="h-3 w-3 text-teal-accent" />
                      {ev.hora} hs {ev.horaFin && `- ${ev.horaFin} hs`}
                    </span>
                  </div>

                  <h4 className="mt-2.5 font-serif text-lg font-bold text-white">
                    {ev.titulo}
                  </h4>

                  {ev.docentes && (
                    <p className="mt-1 text-xs text-on-surface-variant">
                      Coordina: <strong className="text-white">{ev.docentes}</strong>
                    </p>
                  )}

                  <div className="mt-2 flex items-center justify-between text-xs text-on-surface-variant">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-primary" />
                      {ev.espacio}
                    </span>

                    {ev.precio && (
                      <span className="font-serif font-bold text-white text-sm">
                        ${ev.precio.toLocaleString('es-AR')}
                      </span>
                    )}
                    {ev.precioPorMes && (
                      <span className="font-serif font-bold text-white text-sm">
                        ${ev.precioPorMes.toLocaleString('es-AR')} / mes
                      </span>
                    )}
                  </div>
                </div>

                {/* Botón de acción directo al formulario de contacto */}
                <div className="mt-4 pt-3 border-t border-surface-container-highest/50 flex items-center gap-2">
                  <Link
                    href={reservaUrl}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-xs font-bold text-primary-dark shadow-cyan-glow transition-all hover:brightness-110 active:scale-[0.98]"
                  >
                    <span>{ev.tipo === 'taller' ? 'Inscribirme' : 'Reservar Butaca'}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>

                  {ev.slug && (
                    <Link
                      href={`/obras/${ev.slug}`}
                      className="rounded-lg border border-surface-container-highest px-3 py-2 text-xs font-semibold text-on-surface-variant hover:text-white transition-colors"
                    >
                      Ficha
                    </Link>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center text-on-surface-variant">
            <CalendarIcon className="h-8 w-8 text-surface-container-highest mb-2" />
            <p className="text-xs">No hay eventos para esta fecha.</p>
            <p className="text-[11px] text-teal-accent mt-1">
              Seleccioná otro día en la grilla mensual.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
