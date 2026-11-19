# CONTEXTO DEL PROYECTO: Sle8p 🌙

## 1. Visión y Misión del Producto
**Sle8p** es una aplicación de seguimiento de sueño de nueva generación, minimalista y ultra-inteligente, diseñada específicamente para el uso nocturno y matutino. Su identidad visual y mascota giran en torno al número **"8"**, estilizado como unos adorables ojitos soñolientos que respiran y reaccionan al estado del usuario.

### El Problema Fundamental que Resuelve:
Las aplicaciones de ciclo de sueño actuales obligan al usuario a fijar una hora de despertador estricta. Sin embargo, el tiempo que tarda una persona en dormirse (*sleep latency*) es sumamente inconsistente (15 min, 45 min, 1h+). Si te duermes tarde, la alarma fija te priva de tu descanso y te despierta con déficit de sueño.

### La Solución de Sle8p:
1. **Detección Dinámica de Inicio de Sueño:** Monitoriza activamente mediante sensores del móvil / wearables / micrófono (respiración) cuándo el usuario se queda dormido de verdad.
2. **Auto-Pausa de Podcast / ASMR / Música:** En el instante en que detecta el inicio del sueño, pausa suavemente (fade-out) el podcast, ASMR o sonido ambiental que el usuario estaba escuchando para evitar micro-despertares a medianoche.
3. **Garantía Dinámica de 8 Horas:** Calcula las 8 horas de sueño efectivas a partir de la hora real en que te dormiste.
4. **Despertador en Fase Ligera (Smart Wake-up):** Localiza una ventana óptima de fase de sueño ligero alrededor de la meta de 8h (ej. 7h45m - 8h15m) para despertarte en el punto fisiológico donde el cuerpo tiene menor inercia de sueño (*sleep inertia*).

---

## 2. Identidad Visual y Experiencia de Usuario (UI/UX)
- **Mascota "8":** El isotipo principal es un "8" rotado o erguido donde cada círculo representa un párpado/ojo cerrado o somnoliento con animaciones orgánicas de respiración (idle breathing animation).
- **Paleta de Colores (Night & Dawn OLED):**
  - **Fondo Primario:** Pitch Black / Midnight Obsidian (`#05050A`, `#080811`) optimizado para pantallas OLED a oscuras.
  - **Acentos Místicos Nocturnos:** Púrpura profundo y místico (`#7C3AED`, `#8B5CF6`, `#6366F1`).
  - **Azules Celestiales:** Azul noche y crepúsculo (`#1E1B4B`, `#38BDF8`, `#60A5FA`).
  - **Naranjas de Amanecer:** Naranja cálido y suave como luz de amanecer / sol naciente (`#F97316`, `#FB923C`, `#FDBA74`) para indicar despertar, racha y energía.
- **Métricas y Puntuación:**
  - Puntuación de Sueño (*Sle8p Score*) de 0 a 100 basada en regularidad, latencia, fases y proximidad a las 8 horas.
  - Fondo reactivo con anillos concéntricos y barra de progreso circular continua que refleja el cumplimiento de la meta de 8h semanal y mensual.
  - Tracker visual semanal (7 días) y mensual (calendario de constelaciones de sueño).

---

## 3. Arquitectura Tecnológica y Estándares de Diseño
- **Core Stack:** Next.js 16 + React 19 + TypeScript + Tailwind CSS + Framer Motion.
- **Envoltorio Móvil:** Capacitor 8 con soporte completo para iOS / Android, Haptics, Local Notifications, Background Mode y Dynamic Island / Live Activities.
- **Estándares Aplicados:**
  - `impeccable`: Diseño artesanal, ritmo vertical de 8pt, feedback micro-háptico, contraste WCAG AAA para baja luminosidad nocturna, áreas táctiles mínimas de 44x44pt.
  - `taste-skill`: Cero clichés de IA, tipografía editorial SF Pro / Geist, visualización de datos orgánica.
  - `apple-design`: Alineación total con las Human Interface Guidelines (HIG) de Apple, soporte de StandBy Mode en iOS, widgets de pantalla de bloqueo y pantalla de inicio.

---

## 4. Investigación Técnica: Alarmas en iOS & Audio Auto-Pause
### ¿Es posible acceder a las alarmas nativas de la app Reloj en iOS?
- **Sandbox de Apple:** Apple **no** expone una API pública de lectura/escritura directa para la base de datos de la app Reloj (`com.apple.mobiletimer`) a aplicaciones de terceros por motivos de privacidad y seguridad del sandbox de iOS.
- **Solución Implementada en Sle8p:**
  1. **Sle8p Smart Alarm Engine (Nativo):** Motor de alarmas propio con `AVAudioSession` configurada en modo `.playback` con interrupción activa, notificación local crítica (`UNAuthorizationOptions.criticalAlert`) que suena incluso en modo "No Molestar" o silencio.
  2. **Integración con Apple Shortcuts & Siri App Intents:** Esquema de URLs y App Intents en Swift (`INSetAlarmIntent` / `Shortcuts API`) que permite al usuario sincronizar o disparar alarmas nativas mediante atajos automatizados de iOS.
  3. **Auto-Pausa de Podcast / Audio:** Detección de sueño que utiliza `MPRemoteCommandCenter.shared().pauseCommand` o interrupción de `AVAudioSession` para enviar una orden de pausa al sistema iOS, deteniendo Spotify, Apple Podcasts, YouTube Music o audios en reproducción de fondo.

---

## 5. Ecosistema de Wearables y Repositorios Clave
Para la sincronización con los diferentes dispositivos de seguimiento de salud:
1. **Apple Watch:**
   - Framework: **Apple HealthKit** (`HKCategoryTypeIdentifier.sleepAnalysis`).
   - Muestras: `HKCategoryValueSleepAnalysis.asleepCore`, `asleepDeep`, `asleepREM`, `awake`.
2. **Oura Ring:**
   - API: **Oura API V2** (REST + Webhook). Endpoints: `/v2/usercollection/sleep`, `/v2/usercollection/daily_sleep`.
   - Docs & SDK: OAuth2 estándar con tokens de acceso para recuperación de hypnogramas minuto a minuto.
3. **Whoop:**
   - API: **Whoop Developer Platform API v1**. Endpoint: `/v1/activity/sleep/{id}` y `/v1/recovery`.
4. **Garmin:**
   - API: **Garmin Health API** & **Garmin Connect Companion SDK** (mide Sleep Pulse Ox, Body Battery y Sleep Levels).
   - Repo/Open Source: Compatibilidad con protocolos FIT (`garmin-fit-sdk`).
5. **Xiaomi / Amazfit (Zepp OS):**
   - Plataforma: **Zepp Open Platform / Zepp OS API** (sensores de sueño PPG y acelerómetro).
   - Repositorios comunitarios: **Gadgetbridge** (Android open-source bridge para Xiaomi/Amazfit/Huawei), **Health Connect** (Android API unificada).

---

## 6. Funcionalidades Premium y Widgets
- **Widgets de iOS / Android:**
  - *Small Widget:* El ojito "8" durmiendo o despierto con el Sle8p Score y la barra de 8h.
  - *Medium Widget:* Histograma semanal de horas y detección de sueño en vivo.
  - *Lock Screen / StandBy Widget:* Estado de carga de sueño nocturno, modo atenuado en rojo/ámbar para no deslumbrar.
  - *Live Activity (Dynamic Island):* Contador en vivo de horas de sueño acumuladas y tiempo restante para las 8h.
- **Sle8p AI Coach (Pantalla Especializada):**
  - IA conversacional especializada en medicina del sueño, ritmos circadianos, higiene del sueño y análisis predictivo según tus datos biométricos.
  - Consejos micro-accionables diarios (hora límite de cafeína, ventana de melatonina, temperatura de habitación).

---

## 7. Estructura de Pantallas de la App
1. **Dashboard Principal (Sleep & 8-Eyes):**
   - Mascota animada "8" con párpados interactivos y halo de respiración circadiana.
   - Puntuador diario y anillo circular de cumplimiento semanal de las 8 horas.
   - Botón háptico de activación: "Iniciar Noche Sle8p" (Auto-detect & Sleep Audio Fade).
2. **Tracker Semanal y Mensual:**
   - Mapa de constelaciones mensual de consistencia de 8h.
   - Gráfico de fases (REM, Profundo, Ligero) y latencia de sueño.
3. **Sle8p AI Coach:**
   - Asistente de IA generativa con recomendaciones personalizadas, cálculo de ventana de sueño y análisis de factores de vigilia.
4. **Conexiones & Wearables (Integrations Hub):**
   - Panel de emparejamiento con Apple Health, Oura, Whoop, Garmin, Xiaomi y Amazfit con estado en tiempo real.
5. **Perfil & Ajustes Premium:**
   - Configuración de ventana de alarma inteligente (Smart Wake-up Window: 15-30 min).
   - Gestión de audio (Fade-out timer y auto-pause por biorritmo).
   - Acceso al catálogo de Widgets exclusivos y suscripción Sle8p Pro.


---

## 8. Directivas Estrictas de Minimalismo Visual
1. **Navbar Ultra-Limpia:** Eliminación total de etiquetas de texto en la barra inferior de navegación. Únicamente iconos SVG nativos con indicador sutil de estado activo.
2. **Erradicación de Pills y Badges Banales:** Se suprimen todas las pastillas decorativas con texto o iconos superfluos ("8H GUARANTEE", "Auto-Fade ON", "SLE8P", badges de racha con llamas). Las métricas se muestran de forma limpia mediante tipografía y contraste directo.
3. **Mascota Oficial "8":** Integración de los assets gráficos exactos del usuario en `public/mascot/`:
   - `mascot_awake.png`: Ojos abiertos despiertos mirando lateralmente.
   - `mascot_drowsy.png`: Párpados entrecerrados en detección de latencia.
   - `mascot_asleep.png`: Ojos cerrados sonrientes en reposo profundo.
4. **Minimización de Texto Repetitivo:** Eliminación de frases condescendientes o explicaciones obvias. Todo el espacio visual se destina a métricas concisas (puntuación, horas, porcentajes de consistencia).


---

## 9. Rediseño Blanco y Negro, Tipografía More Sugar y Onboarding de Fases REM
1. **Paleta Cromática Estricta:**
   - Erradicación de degradados de IA y acentos saturados.
   - Fondo negro absoluto OLED (`#000000`) y elementos en blanco puro (`#FFFFFF`) y grises neutrales (`#161618`, `#71717A`).
2. **Tipografía Disruptiva:**
   - Integración de tipografía redondeada y juguetona estilo "More Sugar" (`Fredoka`) para títulos y números principales.
3. **Flujo de Onboarding (`/onboarding`):**
   - Acceso rápido con Apple, Google y Correo electrónico.
   - Selector deslizante interactivo (`RemPhaseSlider.tsx`) para fijar la meta de horas (con 8.0h como objetivo óptimo).
   - Cálculo dinámico del número de fases REM alcanzables (R1 a R6) con bloques visuales interactivos.
4. **Enfoque Puro de Descanso (Sin Reproductor de Música):**
   - Se elimina el reproductor manual de podcasts/música.
   - La app se centra exclusivamente en calcular y recomendar **a qué hora exacta debe acostarse el usuario** según su hora habitual de despertar para garantizar sus 8 horas y ciclos REM completos.
5. **Sle8p IA con Mascota Parpadeante (`/coach`):**
   - Ojos de la mascota en el centro de la pantalla parpadeando periódicamente cada 3.8s.
   - Tono amigable, empático y cercano con input inferior de consulta directa.


---

## 10. Actualización: Navbar Rellena, Logo Parpadeante, Resaltados y Supabase

1. **Navbar Ultra-Limpia con Iconos Rellenos y Logo:**
   - Erradicación definitiva de la pestaña de widgets (`/alarms-widgets`).
   - Iconos 100% rellenos (`fill="currentColor"`, estilo Apple HIG / SF Symbols nativo de iOS).
   - Inclusión del logo oficial de Sle8p (ojitos "8" con pupilas) directamente como el icono de inicio.
   - Cero etiquetas de texto en toda la barra de navegación.

2. **Logo y Mascota Parpadeantes:**
   - Componente `Sle8pBlinkingLogo`: Utiliza los fotogramas del logo de la marca parpadeando periódicamente cada 3.6s (abierto -> cerrado -> abierto).
   - Componente `Sle8pMascot`: Animación orgánica de parpadeo que recorre `abierto` -> `medio cerrado` -> `cerrado` -> `medio cerrado` -> `abierto` utilizando los assets transparentes optimizados en alta fidelidad. Interacción táctil inmediata al pulsar sobre la mascota.

3. **Colores de Resaltado (Verde Chillón, Naranja y Rojo):**
   - **Verde Chillón (`#00FF66`):** Metas óptimas (sueño &ge; 8h, score &ge; 85, batería wearable &gt; 50%, pulso VFC óptimo, conexión activa).
   - **Naranja (`#FF7700`):** Rangos moderados (sueño entre 7h y 8h, score 70-84, batería 20-50%, fases REM regulares).
   - **Rojo (`#FF3333`):** Alerta o déficit (sueño &lt; 7h, score &lt; 70, batería &lt; 20%).
   - Aplicado a la barra y anillo de progreso circular (`SleepCircleProgress`), gráfico semanal de barras (`/tracker`) y telemetría de wearables (`/wearables`).

4. **Wearables Funcionales y Base de Datos con Supabase:**
   - Sincronización biométrica bidireccional mediante `lib/supabase.ts` y tabla `wearable_connections`.
   - Estado de batería dinámico, pulso en reposo (bpm), variabilidad de frecuencia cardíaca (HRV ms) y fase de sueño en tiempo real con fallback resiliente a almacenamiento local.


---

## 11. Mejoras de Experiencia de Usuario (UX) e Integración de Skills (Apple HIG & Impeccable)

1. **Feedback Háptico Táctil Nativo (`lib/haptics.ts`):**
   - Integración de micro-hápticos discretos para transiciones de barra inferior (`hapticLight`), selección de días en tracker (`hapticSelection`), inicio de noche de descanso (`hapticSuccess`) y disparo de consultas de IA (`hapticMedium`).

2. **Simulador Interactivo de Dynamic Island y Live Activity (`DynamicIslandLiveActivity.tsx`):**
   - Cápsula flotante superior que se activa al iniciar el descanso nocturno.
   - Estado colapsado: Isotipo durmiente, tiempo transcurrido y pulso verde.
   - Estado expandido interactivo: Cronómetro en vivo, barra de progreso hacia las 8h y hora de alarma programada.

3. **Hoja de Desglose de Puntuación (`ScoreBreakdownModal.tsx`):**
   - Apertura fluida al pulsar sobre el anillo de progreso o puntuación.
   - Desglose conciso de los 3 pilares del algoritmo: Proximidad a 8 horas (96%), Latencia de inicio (92%) y Arquitectura REM/Profundo (89%).

4. **Inspector Interactivo de Noches en el Tracker (`/tracker`):**
   - Capacidad de pulsar individualmente sobre cada una de las 7 barras del histograma.
   - Actualización dinámica inmediata de los indicadores superiores: horas efectivas, deuda o superávit en minutos respecto a las 8h, puntuación y eficiencia.
   - Resalte con anillo de contraste sobre la barra activa.

5. **Carrusel de Consultas Rápidas en Sle8p IA (`/coach`):**
   - Acceso con un solo toque a preguntas habituales sobre cafeína, despertares nocturnos, hora óptima de cama y fases REM.
   - Indicador visual de escritura con rebote y desplazamiento suave automático.

6. **Sincronización en Lote de Wearables (`/wearables`):**
   - Botón superior "Sincronizar todo" con animación de giro para refrescar simultáneamente los biométricos de todos los dispositivos conectados.


---

## 12. Optimización UX Motion: Aplicación de los 20 Principios de Animación y UX

1. **Squash and Stretch (Principio 1):**
   - Deformación física suave (`scale(1.04, 0.94)`) en botones primarios ("Iniciar descanso", "Sincronizar", "Preguntar") con transiciones ultra-rápidas de 100ms cúbicas.

2. **Origin Awareness (Principio 11):**
   - Hoja modal `ScoreBreakdownModal` anclada a `transform-origin: bottom center`.
   - Cápsula flotante `DynamicIslandLiveActivity` y gaveta de código en wearables ancladas a `transform-origin: top center`.

3. **Stagger Cascades (Principio 3):**
   - Entradas escalonadas de 30ms en las barras del histograma semanal y 40ms en las tarjetas de wearables para guiar la atención sin saturar.

4. **Fast Closing (Principio 18):**
   - Cierre de la hoja de desglose de puntuación y elementos colapsables a 110-120ms (`cubic-bezier(0.7, 0, 0.84, 0)`), 2.5 veces más rápido que su apertura para no retrasar al usuario.

5. **Umbral de Doherty y Fitts (Principios 12 y 16):**
   - Áreas táctiles garantizadas de &ge;44x44pt en todos los controles y respuesta inmediata en &lt;100ms con vibración háptica.

6. **Respeto a Reducción de Movimiento (Principio 20):**
   - Regla `@media (prefers-reduced-motion: reduce)` en `globals.css` que neutraliza transformaciones bruscas y preserva la accesibilidad.


---

## 13. Infusión de Personalidad y Carácter Sle8p (Human Centered Design & Delight)

1. **Voz Activa y Expresividad de la Mascota ("Sle8p"):**
   - Incorporación de una burbuja de diálogo viva encima de los ojitos en el Dashboard (`Sle8pMascot.tsx`).
   - Citas con personalidad, cercanía y humor sobre la importancia de las 8 horas y el ritmo circadiano.
   - Interacción háptica y animación de balanceo squash al tocar a la mascota, permitiendo cambiar de frase y guiñar el ojo.

2. **Efectos Sensoriales y Visuales Nocturnos:**
   - Emisión de partículas flotantes "z Z Z" en modo detección y sueño profundo.
   - Tono cómplice en la tarjeta principal: "Tu cita con la almohada: 23:15" con tipografía More Sugar a gran escala.

3. **Veredicto con Carácter en el Historial (`/tracker`):**
   - Cada noche cuenta con una sentencia breve y motivadora de Sle8p (ej. "👑 Noche legendaria", "🔥 Modo bestia: 6 fases REM", "⚠️ Déficit de sueño: Esta noche a la cama temprano").

4. **Sle8p IA con Identidad Real (`/coach`):**
   - El asistente conversacional habla en primera persona como el propio guardián Sle8p, combinando neurociencia del sueño (adenosina, ciclos REM de 90m) con un tono de mejor amigo empático y cero corporativo.


---

## 14. Repositorio Git y Configuración de Base de Datos Supabase

1. **Repositorio Git Local y Remoto:**
   - Repositorio inicializado en rama principal `main` con `.gitignore` exhaustivo (excluye `node_modules`, `.next`, `.env*.local`, builds de iOS/Android).
   - Commits iniciales realizados bajo la identidad `ETHAN2K23`.
   - Remoto añadido: `origin https://github.com/ETHAN2K23/sle8p.git`.

2. **Despliegue de Supabase:**
   - Esquema DDL en `sql/00_sle8p_schema.sql`:
     - `profiles`: Datos de usuario, meta de horas, hora de despertar y cálculo ideal de acostarse.
     - `sleep_sessions`: Histórico de sueño diario, fases REM, latencia y eficiencia.
     - `wearable_connections`: Telemetría en vivo (ppm, VFC, fase y batería).
   - Variables de entorno preparadas en `.env.local` y `.env.example`:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`


---

## 15. Vinculación Activa: GitHub Oficial y Proyecto Supabase

1. **Repositorio GitHub Creado y Desplegado:**
   - URL: `https://github.com/ETHAN2K23/sle8p`
   - Estado: Rama `main` sincronizada con el 100% del código fuente, assets y schema.
   - Acceso Vercel: Habilitado para importación directa en Vercel Dashboard sin restricciones.

2. **Conexión Supabase en Producción:**
   - Project ID: `ewozvgylaeuagsafkipg`
   - URL: `https://ewozvgylaeuagsafkipg.supabase.co`
   - Claves inyectadas en `.env.local` (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`).
   - Esquema DDL en `sql/00_sle8p_schema.sql` con idempotencia total (`DROP POLICY IF EXISTS`, `DROP TRIGGER IF EXISTS`).


---

## 16. Integración Oficial `@supabase/ssr` (Next.js App Router & Middleware)

1. **Dependencias Instaladas:**
   - `@supabase/supabase-js` (^2.119.2)
   - `@supabase/ssr` (^0.5.2)

2. **Variables de Entorno Configuradas (`.env.local` y `.env.example`):**
   - `NEXT_PUBLIC_SUPABASE_URL=https://ewozvgylaeuagsafkipg.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_qnoyCaL_UjrvljXisSHO5A_l6-Yc4Vu`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_qnoyCaL_UjrvljXisSHO5A_l6-Yc4Vu` (compatibilidad fallback)
   - `SUPABASE_SERVICE_ROLE_KEY=[CONFIGURED_IN_ENV_LOCAL]` (operaciones de servidor con bypass RLS)

3. **Arquitectura de Helpers Creada:**
   - `utils/supabase/client.ts`: Generador del cliente navegador (`createBrowserClient`) utilizando la Publishable Key.
   - `utils/supabase/server.ts`: Generador asíncrono para Server Components y Route Handlers (`createServerClient`) con manejo dinámico de `cookies()`.
   - `utils/supabase/middleware.ts`: Función `updateSession(request: NextRequest)` que refresca sesiones de usuario activas y persiste cookies en respuestas HTTP.
   - `middleware.ts`: Middleware raíz de Next.js enlazado a `updateSession`, filtrando estáticos y assets de imagen.

4. **Compatibilidad y Sincronización:**
   - `lib/supabase.ts`: Conectado directamente a `utils/supabase/client.ts` para sincronización de perfiles y telemetría de wearables.
   - Repositorio GitHub sincronizado en `https://github.com/ETHAN2K23/sle8p.git` listo para Vercel.


---

## 17. Evolución UX & Arquitectura Científica: Rediseño Integral Sle8p

1. **Dashboard & Barra de Progreso Gorda:**
   - Erradicación definitiva de barras dobles concéntricas: se implementa una **única barra de progreso circular continua y gorda** (`strokeWidth: 18px`), dejando holgura total para valores altos como 92 o 100 sin colisión tipográfica.
   - Disposición **Side-by-Side (Hero Horizontal)**: La barra circular se sitúa en un flanco y la **Mascota Oficial Sle8p** (ojos abiertos de Ethan sin dos 'o's falsas) se posiciona a su lado en diálogo cómplice e interactivo.
   - Eliminación del logo superior izquierdo y de la pill `[• Modo Noche]`, dando paso a un encabezado minimalista con fecha y rango de descanso.

2. **Navbar Rediseñado (Apple HIG Puro):**
   - Supresión total de la pastilla flotante blanca superior sobre los iconos activos.
   - Icono 1 (Home `/`): **Casa 100% rellena**.
   - Icono 3 (IA `/coach`): **Logo oficial de Sle8p** (ojos reales abiertos en transparencia nítida).
   - Estado activo con `scale-110`, blanco puro y resplandor sutil; inactivos al 40% de opacidad.

3. **Gestión de Wearables e Integraciones iOS:**
   - **Dispositivo Conectado Exclusivo:** La vista muestra únicamente el dispositivo emparejado en formato de tarjeta de hardware (ej. Apple Watch Ultra 2 con pulso en vivo a 52 BPM, batería 86% y VFC), sin clutter de otros 5 dispositivos.
   - **Estado Desconectado:** Si no hay dispositivo emparejado, se activa un carrusel dinámico giratorio 3D con indicador de puntos y botón "+ Añadir Dispositivo".
   - **Integraciones Nativas:** Conectores directos para **Apple Salud (HealthKit)** y **Atajo de Alarmas (Siri Shortcuts)** para saltar el sandbox de iOS y programar el Reloj nativo.

4. **Planificador Diario de Acostarse & Notificaciones:**
   - Tarjeta interactiva diaria: "¿A qué hora te duermes hoy?" con chips rápidos (`22:30`, `23:00`, `23:15`, `23:30`, `00:00`).
   - Cálculo automático de hora de despertar garantizada (8h) y fases REM (5 fases).
   - Programación de **notificación automática 30 minutos antes** de la hora de acostarse (ej. 22:45 para ir a la cama a las 23:15).
   - Integración de **Descanso Programado iPhone** (Enfoque de Sueño de iOS).

5. **Tracker Unificado, Percentiles y Consejos Clínicos:**
   - Eliminación de la separación Semana vs Mes: gráfica combinada unificada con la media móvil del usuario (`Media: 7.9h`) y barras coloreadas con Verde chillón (`#00FF66`), Naranja (`#FF7700`) y Rojo (`#FF3333`).
   - Visualización de las fases REM logradas por noche (ej. 5 fases / 104 min).
   - **Benchmark Poblacional Científico:** Comparativa real basada en la National Sleep Foundation / CDC ("Tu descanso es superior al del 82% de los adultos").
   - **Consejos Clínicos Contextuales:**
     - *Mal sueño (< 7h)*: Regla de rescate circadiano 10-3-2-1 (corte de cafeína 10h antes, cena ligera 3h antes, apagado de pantallas 1h antes).
     - *Sueño normal (7-8h)*: Termorregulación a 18-19°C para potenciar la segunda mitad de la noche.
     - *Buen sueño (&ge; 8h)*: Exposición a 15m de luz solar matutina para fijar el pulso de cortisol.
   - **Estimación REM Sin Dispositivos:** Estimador de ciclos ultradianos (90m por ciclo, 22% REM total) basado en las medias biológicas contrastadas en internet cuando el usuario no dispone de smartwatch.
