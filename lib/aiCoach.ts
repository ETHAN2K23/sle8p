export interface SleepAdvice {
  id: string;
  category: "circadian" | "caffeine" | "recovery" | "environment" | "biorhythm";
  title: string;
  insight: string;
  actionableStep: string;
  source: string;
  priority: "high" | "medium" | "optimal";
}

export function calculateCaffeineCurfew(targetBedtime: string): string {
  // Ej: "23:30" -> 10 horas antes = "13:30"
  const [hours, mins] = targetBedtime.split(":").map(Number);
  let curfewHour = hours - 10;
  if (curfewHour < 0) curfewHour += 24;
  return `${curfewHour.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
}

export function calculateMelatoninWindow(targetBedtime: string): { start: string; peak: string } {
  // La secreción natural de melatonina comienza 2 horas antes de la hora de dormir
  const [hours, mins] = targetBedtime.split(":").map(Number);
  let startHour = hours - 2;
  if (startHour < 0) startHour += 24;
  return {
    start: `${startHour.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`,
    peak: targetBedtime,
  };
}

export const AI_COACH_TIPS: SleepAdvice[] = [
  {
    id: "caffeine-curfew",
    category: "caffeine",
    title: "Toque de Queda de Cafeína (Regla de las 10h)",
    insight: "La vida media de la cafeína es de 5 a 7 horas, pero su vida de aclaramiento cerebral alcanza las 10-12 horas. Aunque creas que puedes dormir con café tarde, destruye la fase N3 de sueño profundo no-REM.",
    actionableStep: "Suspende cafés, tés y pre-entrenos antes de las 13:30 si tu meta es dormir a las 23:30.",
    source: "Dr. Matthew Walker (Why We Sleep) & Stanford Neuroscience",
    priority: "high",
  },
  {
    id: "light-circadian",
    category: "circadian",
    title: "Anclaje de Fotones Matutinos (Luz Solar)",
    insight: "10 a 15 minutos de luz solar directa en los ojos en la primera hora tras despertar suprime la melatonina e inicia un temporizador biológico de 16 horas para tu descanso de hoy.",
    actionableStep: "Sal al balcón o camina 10 min sin gafas de sol tan pronto apagues Sle8p.",
    source: "Huberman Lab Podcast: Master Your Sleep",
    priority: "high",
  },
  {
    id: "thermoregulation",
    category: "environment",
    title: "Caída Térmica de 1°C para Dormir Rápido",
    insight: "Para iniciar el sueño, tu temperatura corporal interna DEBE descender entre 1°C y 1.5°C. Dormir en una habitación a más de 20°C aumenta la latencia de sueño un 35%.",
    actionableStep: "Mantén el dormitorio entre 17°C y 19°C. Una ducha tibia 60 min antes dilata los vasos periféricos y acelera el enfriamiento.",
    source: "Journal of Physiological Anthropology",
    priority: "medium",
  },
  {
    id: "dynamic-8h-rule",
    category: "biorhythm",
    title: "El Poder del Inicio Dinámico de Sle8p",
    insight: "Forzarte a levantarte a las 06:30 si tardaste 50 minutos en conciliar el sueño a la 01:00 causa déficit de sueño acumulativo. Sle8p ajusta tu alarma inteligente para asegurar que tus 8 horas se cumplan desde el primer minuto de sueño real.",
    actionableStep: "Deja que Sle8p calcule tu despertar. Si hoy te duermes 20 min más tarde, tu alarma se adaptará a tu fase ligera más cercana a las 8h.",
    source: "Algoritmo de Optimización Biológica Sle8p",
    priority: "optimal",
  },
];
