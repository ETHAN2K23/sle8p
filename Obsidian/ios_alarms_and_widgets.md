# ARQUITECTURA TÉCNICA: ALARMAS EN IOS, AUTO-PAUSE Y WIDGETKIT 📱⏰

## 1. El Dilema de las Alarmas Nativas en iOS
### ¿Por qué las apps de terceros no pueden leer directamente las alarmas de la app "Reloj"?
En iOS (Apple Sandbox), el daemon `com.apple.mobiletimer` y las alarmas nativas están completamente aisladas por razones de seguridad y privacidad. Apple **no proporciona una API pública** (`ClockKit` o `HealthKit` no exponen el horario de las alarmas configuradas en la app Reloj).

### La Estrategia Tripartita de Sle8p para Superar esta Limitación:

### Opción A: Sle8p Smart Dynamic Alarm Engine (Nativo Recomendado)
En lugar de depender de una alarma fija en el reloj del sistema, Sle8p gestiona la alarma de forma inteligente:
1. **Notificaciones Críticas de iOS (`UNAuthorizationOptions.criticalAlert`):**
   - Con el permiso correspondiente (`com.apple.developer.usernotifications.critical-alerts`), la alarma de Sle8p suena a todo volumen incluso si el iPhone está en modo Silencio físico o modo Concentración / No Molestar (Sleep Focus).
2. **Ciclo de Audio de Fondo (`AVAudioSession` + Background Audio):**
   - La app mantiene una sesión de audio pasiva en segundo plano. Cuando se alcanza la ventana de sueño ligero (cercana a las 8 horas de sueño real detectado), reproduce el tono de despertar gradual ("Sunrise Chime").

### Opción B: Integración Bidireccional con Atajos de Apple (Shortcuts & App Intents)
Permite interactuar con la app Reloj nativa de iOS sin romper las políticas de Apple:
1. **Sle8p Shortcuts Integration:**
   - La app expone App Intents (`Sle8pSetDynamicAlarmIntent`).
   - El usuario puede instalar un atajo de 1 click ("Sincronizar Sle8p con Reloj de iOS") que toma la hora estimada de despertar de Sle8p (ej. 07:42 AM calculada tras dormirse a las 23:42) y ejecuta la acción nativa de Atajos: `Crear Alarma en Reloj`.

### Opción C: Auto-Pausa de Podcast / ASMR / Música al Detectar Sueño
Cuando los algoritmos de Sle8p detectan que el usuario ha entrado en fase N1 (sueño ligero) o frecuencia cardíaca en reposo:
1. **Control de Reproducción Remota (`MPRemoteCommandCenter`):**
   - Sle8p puede solicitar el foco de audio o enviar una orden de pausa universal a través de `MPRemoteCommandCenter.shared().pauseCommand` o simplemente activando y desactivando una pequeña sesión de audio `AVAudioSessionCategoryPlayback` con opción `.duckOthers` o interrupción directa.
   - Esto pausa instantáneamente Spotify, Apple Podcasts, YouTube Music, Overcast, etc., sin despertar al usuario.

---

## 2. Ecosistema de Widgets iOS (WidgetKit & Live Activities)

Sle8p incluye 4 formatos de widgets premium diseñados bajo el lenguaje Apple Human Interface Guidelines:

| Formato | Nombre | Funcionalidad Clave |
| :--- | :--- | :--- |
| **Lock Screen (Circular)** | *Sle8p Eye Mascot* | Muestra el ojito "8" durmiendo o despierto y el porcentaje de las 8 horas. |
| **Lock Screen (Inline)** | *Sle8p Countdown* | Texto discreto: `🌙 Sle8p: 6h 40m dormidas · 1h 20m para 8h`. |
| **Home Screen (Small / Medium)** | *Weekly Orbit Ring* | Anillo concéntrico que muestra el cumplimiento de 8h los últimos 7 días con gradiente morado a naranja. |
| **StandBy Mode (iOS 17+)** | *Nightstand Glow* | Interfaz de mesilla de noche ultra-atenuada en rojo/ámbar oscuro con los ojos de la mascota respirando lentamente. |
| **Dynamic Island & Live Activity** | *Sleep Flight Monitor* | Muestra en tiempo real la fase de sueño estimada, audio reproduciéndose (con botón de fade manual) y la barra hacia las 8 horas. |

---

## 3. Especificación de Código Swift para Widgets y Control de Audio

```swift
// Sle8pAudioController.swift
import AVFoundation
import MediaPlayer

final class Sle8pAudioController {
    static let shared = Sle8pAudioController()
    
    /// Pausa cualquier podcast, ASMR o música de terceros cuando Sle8p detecta sueño
    func pauseSystemAudioOnSleepOnset() {
        let audioSession = AVAudioSession.sharedInstance()
        do {
            try audioSession.setCategory(.playback, mode: .default, options: [])
            try audioSession.setActive(true)
            // Al tomar el foco activo momentáneamente y luego liberarlo con notifyOthersOnDeactivation,
            // el reproductor del sistema (Apple Podcasts, Spotify) se pausa suavemente.
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
                try? audioSession.setActive(false, options: .notifyOthersOnDeactivation)
            }
        } catch {
            print("Error pausando audio del sistema: \(error)")
        }
    }
}
```
