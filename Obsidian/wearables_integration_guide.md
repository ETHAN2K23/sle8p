# GUÍA DE INTEGRACIÓN DE WEARABLES: SLE8P ⌚💍

Este documento detalla la arquitectura de integración, librerías, repositorios de código abierto y APIs oficiales para conectar los principales dispositivos wearables con Sle8p.

---

## 1. Apple Watch (watchOS & iOS)
- **Framework Principal:** `HealthKit` (Apple Native).
- **Tipos de Datos:**
  - `HKCategoryTypeIdentifier.sleepAnalysis`: Muestras de sueño categóricas (`awake`, `asleepCore`, `asleepDeep`, `asleepREM`).
  - `HKQuantityTypeIdentifier.heartRate`: Frecuencia cardíaca en tiempo real para detección de inicio de sueño.
  - `HKQuantityTypeIdentifier.restingHeartRate`: Frecuencia en reposo.
  - `HKQuantityTypeIdentifier.heartRateVariabilitySDNN`: Variabilidad (HRV) para calcular estrés y profundidad de sueño.
- **Detección en Segundo Plano:** `HKObserverQuery` y `enableBackgroundDelivery(for:frequency:.immediate)`.
- **Comunicación con Apple Watch:** `WatchConnectivity` (`WCSession`) para enviar señales de vibración háptica de despertar suave.
- **Repositorios / Librerías Recomendadas:**
  - `react-native-health` / `@kingstinct/react-native-healthkit` (para ecosistemas React Native).
  - `@capacitor-community/apple-sign-in` y plugins personalizados de Capacitor para HealthKit: `capacitor-plugin-health` o `HealthKit Swift Bridge`.

---

## 2. Oura Ring (Gen 2 / Gen 3 / Ring 4)
- **API Oficial:** **Oura API V2** (RESTful API + Webhooks).
- **Autenticación:** OAuth 2.0 (Authorization Code Grant).
- **Scopes Requeridos:** `daily`, `heartrate`, `personal`, `session`, `workout`.
- **Endpoints Clave:**
  - `GET /v2/usercollection/daily_sleep`: Puntuación de sueño, eficiencia, duración en cama.
  - `GET /v2/usercollection/sleep`: Hipnograma de sueño a intervalos de 5 minutos (REM, Deep, Light, Awake), latencia de sueño (*time to fall asleep*).
  - `GET /v2/usercollection/heart_rate`: Mediciones nocturnas segundo a segundo.
- **Webhooks:** Suscripción a eventos `sleep_updated` para sincronización instantánea al despertar.
- **Repositorios & SDKs:**
  - `oura-v2-client` (TypeScript / JavaScript): Cliente tipado para la API v2 de Oura.
  - Repositorio de referencia: `https://github.com/turing-complet/oura-v2-api` y ejemplos oficiales en `https://cloud.ouraring.com/docs/`.

---

## 3. Whoop (Whoop 4.0 / 5.0)
- **API Oficial:** **Whoop Developer Platform API v1**.
- **Autenticación:** OAuth 2.0 (`https://api.prod.whoop.com/oauth/oauth2/token`).
- **Endpoints Clave:**
  - `GET /v1/activity/sleep/{id}`: Métricas completas de sueño, necesidad de sueño (*Sleep Need*), deuda de sueño acumulada.
  - `GET /v1/recovery`: Puntuación de recuperación diaria (0-100%), HRV nocturno, temperatura de piel.
- **Detección de Sueño:** Notificación automática en cuanto el algoritmo de Whoop detecta la finalización o inicio de una sesión.
- **Librerías de Referencia:**
  - SDK no oficial para Node.js: `whoop-client` / `whoop-api`.

---

## 4. Garmin (Forerunner, Fenix, Venu, Lily)
- **API Oficial:** **Garmin Health API** (B2B / Partner API) & **Garmin Connect Developer Program**.
- **SDK para Dispositivos:** **Garmin Connect IQ SDK** (permite crear pequeñas apps en el reloj con Monkey C) y **Garmin Companion SDK** (comunicación directa BLE/Bluetooth móvil-reloj).
- **Procesamiento de Archivos FIT:**
  - Repositorio oficial: `@garmin/fitsdk` (Garmin FIT SDK oficial en NPM y GitHub: `https://github.com/garmin/fit-javascript-sdk`).
  - Permite parsear los registros directos de `SleepLevel`, `HeartRate` y `RespirationRate`.

---

## 5. Xiaomi & Amazfit (Huami / Zepp Health)
- **Plataforma Oficial:** **Zepp Open Platform / Zepp OS SDK** (`https://docs.zepp.com/`).
- **Compatibilidad con Xiaomi:** Xiaomi Smart Band (Mi Band 7/8/9), Xiaomi Watch.
- **Integración Unificada en Android:** **Google Health Connect** (las apps Mi Fitness y Zepp sincronizan nativamente sus datos de sueño en Health Connect).
- **Proyectos Open Source de Referencia:**
  - **Gadgetbridge** (`https://codeberg.org/Freeyourgadget/Gadgetbridge`): El mayor repositorio open-source para ingeniería inversa y comunicación Bluetooth directa con pulseras Xiaomi Mi Band y relojes Amazfit sin depender de servidores chinos.
  - **ZeppOS Mini-Apps**: Permite crear mini-aplicaciones complementarias en JavaScript para instalar en relojes Amazfit y sincronizar con Sle8p.

---

## 6. Arquitectura del Agregador de Datos en Sle8p
```
  [Apple Watch (HealthKit)]  \
  [Oura Ring (OAuth V2)]      \
  [Whoop (OAuth V1)]           --> [ Sle8p Unified Wearable Adapter ] --> [ Sle8p Sleep Engine ]
  [Garmin (FIT / Health API)] /                                            ├── 1. Sleep Onset Detector
  [Xiaomi/Amazfit (Zepp/BLE)]/                                            ├── 2. Audio Auto-Pause
                                                                          ├── 3. Dynamic 8H Goal
                                                                          └── 4. Smart Wake Window
```
