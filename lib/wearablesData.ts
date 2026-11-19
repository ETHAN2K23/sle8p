export interface WearableIntegrationDetail {
  id: string;
  name: string;
  brand: string;
  category: "ring" | "watch" | "band";
  iconName: string;
  officialDocUrl: string;
  githubRepos: {
    name: string;
    url: string;
    stars: string;
    description: string;
  }[];
  apiType: "REST OAuth2" | "Apple HealthKit Native" | "Companion BLE SDK" | "Webhooks & Stream";
  keyEndpoints: string[];
  samplePayloadSnippet: string;
  sle8pAdvantage: string;
}

export const WEARABLES_CATALOG: WearableIntegrationDetail[] = [
  {
    id: "apple-watch",
    name: "Apple Watch (Series 4-10, SE & Ultra)",
    brand: "Apple",
    category: "watch",
    iconName: "Watch",
    officialDocUrl: "https://developer.apple.com/documentation/healthkit/hkcategorytypesleepanalysis",
    githubRepos: [
      {
        name: "react-native-health",
        url: "https://github.com/agencyenterprise/react-native-health",
        stars: "2.1k",
        description: "Librería puente completa para leer muestras de sueño y frecuencia cardíaca de HealthKit.",
      },
      {
        name: "@kingstinct/react-native-healthkit",
        url: "https://github.com/kingstinct/react-native-healthkit",
        stars: "1.2k",
        description: "Soporte moderno para sleep stages (Core, Deep, REM) y background delivery en iOS.",
      },
      {
        name: "capacitor-healthkit",
        url: "https://github.com/adrian-labs/capacitor-healthkit",
        stars: "450",
        description: "Plugin de Capacitor para HealthKit para apps híbridas iOS.",
      },
    ],
    apiType: "Apple HealthKit Native",
    keyEndpoints: [
      "HKCategoryTypeIdentifier.sleepAnalysis",
      "HKQuantityTypeIdentifier.heartRate",
      "HKQuantityTypeIdentifier.restingHeartRate",
      "HKQuantityTypeIdentifier.heartRateVariabilitySDNN",
    ],
    samplePayloadSnippet: `// Lectura de sueño nativo en Swift
let sleepType = HKObjectType.categoryType(forIdentifier: .sleepAnalysis)!
let query = HKSampleQuery(sampleType: sleepType, predicate: predicate, limit: 100, sortDescriptors: nil) { (query, results, error) in
    guard let samples = results as? [HKCategorySample] else { return }
    for sample in samples {
        // HKCategoryValueSleepAnalysis.asleepCore, .asleepDeep, .asleepREM
        Sle8pEngine.evaluateOnset(sample)
    }
}`,
    sle8pAdvantage: "Detección inmediata de latencia y vibraciones hápticas silenciosas en la muñeca al alcanzar las 8h.",
  },
  {
    id: "oura-ring",
    name: "Oura Ring (Gen 2, Gen 3 & Ring 4)",
    brand: "Oura",
    category: "ring",
    iconName: "CircleDot",
    officialDocUrl: "https://cloud.ouraring.com/docs/v2",
    githubRepos: [
      {
        name: "turing-complet/oura-v2-api",
        url: "https://github.com/turing-complet/oura-v2-api",
        stars: "180",
        description: "Cliente TypeScript fuertemente tipado para Oura Cloud API v2.",
      },
      {
        name: "netman88/ouraring-python",
        url: "https://github.com/netman88/ouraring-python",
        stars: "340",
        description: "Librería Python para sincronización masiva y procesamiento de hypnogramas Oura.",
      },
    ],
    apiType: "REST OAuth2",
    keyEndpoints: [
      "GET /v2/usercollection/sleep",
      "GET /v2/usercollection/daily_sleep",
      "GET /v2/usercollection/heart_rate",
      "POST /v2/webhook/subscription",
    ],
    samplePayloadSnippet: `{
  "data": [{
    "day": "2026-11-19",
    "score": 92,
    "efficiency": 94,
    "latency": 780, // 13 minutos hasta dormirse
    "hypnogram_5_min": "4444111222333111...",
    "total_sleep_duration": 28800 // 8 horas exactas
  }]
}`,
    sle8pAdvantage: "El sensor de temperatura y pulso más cómodo para dormir sin pantalla luminosa molesta.",
  },
  {
    id: "whoop-strap",
    name: "Whoop (Strap 4.0 & 5.0)",
    brand: "Whoop",
    category: "band",
    iconName: "Zap",
    officialDocUrl: "https://developer.whoop.com/",
    githubRepos: [
      {
        name: "whoop-api-client",
        url: "https://github.com/hedgewise/whoop-api-client",
        stars: "220",
        description: "Cliente Node.js para interactuar con la plataforma de desarrolladores de Whoop.",
      },
      {
        name: "whoop-sdk-python",
        url: "https://github.com/sam-wood/whoop-sdk-python",
        stars: "190",
        description: "Wrapper de autenticación OAuth y descarga de sleep activities en Whoop.",
      },
    ],
    apiType: "REST OAuth2",
    keyEndpoints: [
      "GET /v1/activity/sleep/{id}",
      "GET /v1/recovery",
      "GET /v1/cycle/{id}",
    ],
    samplePayloadSnippet: `{
  "score": {
    "stage_summary": {
      "total_in_bed_time_milli": 29800000,
      "total_awake_time_milli": 1000000,
      "total_slow_wave_sleep_time_milli": 7200000,
      "total_rem_sleep_time_milli": 7000000
    },
    "sleep_needed": { "baseline_milli": 28800000 }
  }
}`,
    sle8pAdvantage: "Algoritmo de cálculo de 'Sleep Debt' más preciso del mercado sincronizado con el score de Sle8p.",
  },
  {
    id: "garmin-wearables",
    name: "Garmin (Forerunner, Fenix, Epix, Venu)",
    brand: "Garmin",
    category: "watch",
    iconName: "Activity",
    officialDocUrl: "https://developer.garmin.com/health-api/overview/",
    githubRepos: [
      {
        name: "@garmin/fitsdk",
        url: "https://github.com/garmin/fit-javascript-sdk",
        stars: "580",
        description: "SDK oficial de Garmin para decodificar archivos binarios FIT y extraer telemetría de sueño.",
      },
      {
        name: "milosz/garmin-connect",
        url: "https://github.com/milosz/garmin-connect",
        stars: "890",
        description: "Librería Node.js para descargar resúmenes diarios de Garmin Connect sin cuotas enterprise.",
      },
    ],
    apiType: "Companion BLE SDK",
    keyEndpoints: [
      "Garmin Health Daily Sleep Endpoint",
      "Garmin Companion SDK (Direct BLE)",
      "FIT Protocol: Message type 113 (SleepLevel)",
    ],
    samplePayloadSnippet: `// Parseo de paquete FIT de Garmin
import { Decoder, Stream } from '@garmin/fitsdk';
const stream = Stream.fromBuffer(fitBuffer);
const decoder = new Decoder(stream);
const { messages } = decoder.read();
const sleepRecords = messages.filter(m => m.name === 'sleep_level');`,
    sle8pAdvantage: "Batería de larga duración (semanas) que permite tracking nocturno ininterrumpido.",
  },
  {
    id: "xiaomi-bands",
    name: "Xiaomi (Smart Band 7/8/9 & Xiaomi Watch)",
    brand: "Xiaomi",
    category: "band",
    iconName: "Smartphone",
    officialDocUrl: "https://developer.android.com/health-and-fitness/guides/health-connect",
    githubRepos: [
      {
        name: "Freeyourgadget/Gadgetbridge",
        url: "https://codeberg.org/Freeyourgadget/Gadgetbridge",
        stars: "4.8k",
        description: "El repositorio libre más grande del mundo para sincronizar pulseras Xiaomi Mi Band y Amazfit por Bluetooth directo.",
      },
      {
        name: "satcar/miband4",
        url: "https://github.com/satcar/miband4",
        stars: "620",
        description: "Protocolos BLE de reverse-engineering para sincronizar ritmo cardíaco y sueño en Mi Bands.",
      },
    ],
    apiType: "Companion BLE SDK",
    keyEndpoints: [
      "Google Health Connect (SleepSessionRecord)",
      "Bluetooth GATT Service: 0000fee0 (Mi Band Data)",
      "Xiaomi Health Cloud Sync",
    ],
    samplePayloadSnippet: `// Health Connect Sleep Record en Android
val sleepSession = SleepSessionRecord(
    startTime = onsetInstant,
    endTime = wakeInstant,
    stages = listOf(SleepSessionRecord.Stage(onsetInstant, onsetInstant.plus(30, MINUTES), STAGE_TYPE_LIGHT)),
    title = "Sle8p 8h Session"
)`,
    sle8pAdvantage: "El dispositivo más asequible y masivo del mundo, permitiendo democratizar Sle8p.",
  },
  {
    id: "amazfit-zepp",
    name: "Amazfit (Balance, GTR, GTS, T-Rex / Zepp OS)",
    brand: "Amazfit",
    category: "watch",
    iconName: "Compass",
    officialDocUrl: "https://docs.zepp.com/",
    githubRepos: [
      {
        name: "zepp-health/zeppos-samples",
        url: "https://github.com/zepp-health/zeppos-samples",
        stars: "310",
        description: "Ejemplos oficiales de Mini-Apps en JavaScript para relojes Amazfit con Zepp OS.",
      },
      {
        name: "Freeyourgadget/Gadgetbridge",
        url: "https://codeberg.org/Freeyourgadget/Gadgetbridge",
        stars: "4.8k",
        description: "Soporte de comunicación BLE directo con firmware Huami / Amazfit.",
      },
    ],
    apiType: "REST OAuth2",
    keyEndpoints: [
      "Zepp Open Platform Sleep REST API",
      "Zepp OS Device Sensor: hmSensor.createSensor(hmSensor.id.SLEEP)",
    ],
    samplePayloadSnippet: `// Mini-app nativa en Zepp OS (Amazfit)
import { createSensor, id } from '@zos/sensor'
const sleepSensor = createSensor(id.SLEEP)
const info = sleepSensor.getInfo()
// info: { score, deepMin, lightMin, remMin, awakeMin, startTime, endTime }`,
    sle8pAdvantage: "Capacidad de ejecutar una mini-app complementaria de Sle8p en el propio reloj.",
  },
];
