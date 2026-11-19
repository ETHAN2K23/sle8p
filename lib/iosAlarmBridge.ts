export interface IosAlarmConfig {
  wakeTimeIso: string;
  wakeHour: number;
  wakeMinute: number;
  alarmLabel: string;
  smartWindowMinutes: number;
}

export function generateAppleShortcutUrl(config: IosAlarmConfig): string {
  // Construye la URL para disparar el Atajo de iOS que configura la alarma nativa en la app Reloj
  const timeFormatted = `${config.wakeHour.toString().padStart(2, "0")}:${config.wakeMinute.toString().padStart(2, "0")}`;
  const encodedName = encodeURIComponent("Sle8p Dynamic 8H Alarm");
  const encodedInput = encodeURIComponent(
    JSON.stringify({
      time: timeFormatted,
      label: config.alarmLabel,
      window: config.smartWindowMinutes,
    })
  );
  return `shortcuts://run-shortcut?name=${encodedName}&input=${encodedInput}`;
}

export const SWIFT_IOS_ALARM_BRIDGE_CODE = `//
//  Sle8pAlarmManager.swift
//  Sle8p
//
import Foundation
import UserNotifications
import AVFoundation
import MediaPlayer

@objc public class Sle8pAlarmManager: NSObject {
    @objc public static let shared = Sle8pAlarmManager()
    private var audioPlayer: AVAudioPlayer?
    
    /// Programa Alarma Crítica (ignora silencio y No Molestar de iOS)
    @objc public func scheduleDynamicCriticalAlarm(at date: Date, title: String) {
        let center = UNUserNotificationCenter.current()
        center.requestAuthorization(options: [.alert, .sound, .criticalAlert]) { granted, error in
            guard granted else { return }
            
            let content = UNMutableNotificationContent()
            content.title = "🌙 Sle8p: 8 Horas Cumplidas"
            content.body = "Tu cuerpo ha completado 8 horas de sueño en fase ligera. Despierta renovado."
            // Sonido crítico al 100% de volumen
            content.sound = UNNotificationSound.criticalSoundNamed(
                UNNotificationSoundName(rawValue: "sunrise_chime.wav"),
                withAudioVolume: 1.0
            )
            content.categoryIdentifier = "SLE8P_WAKE_CATEGORY"
            
            let triggerDate = Calendar.current.dateComponents(
                [.year, .month, .day, .hour, .minute, .second],
                from: date
            )
            let trigger = UNCalendarNotificationTrigger(dateMatching: triggerDate, repeats: false)
            let request = UNNotificationRequest(identifier: "SLE8P_DYNAMIC_8H", content: content, trigger: trigger)
            
            center.add(request) { error in
                if let error = error {
                    print("Error programando alarma Sle8p: \\(error)")
                }
            }
        }
    }
    
    /// Auto-pausa cualquier audio/podcast de terceros en segundo plano al dormirse
    @objc public func pauseSystemAudioOnSleepDetected() {
        let session = AVAudioSession.sharedInstance()
        do {
            try session.setCategory(.playback, mode: .default, options: [])
            try session.setActive(true)
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
                try? session.setActive(false, options: .notifyOthersOnDeactivation)
            }
        } catch {
            print("Error pausando audio externo: \\(error)")
        }
    }
}
`;
