# SISTEMA DE DISEÑO DE SLE8P: APPLE HIG & NIGHT/DAWN AESTHETICS 🎨✨

## 1. Filosofía Visual y Mascot Branding
Sle8p está concebida para utilizarse en el momento más vulnerable del día: en la oscuridad absoluta de la habitación antes de dormir, o en la vigilia temprana al despertar.
- **Mascota "8" (The Sle8p Eyes):**
  - El número "8" representa la meta fisiológica ideal de horas de descanso.
  - El glifo se representa horizontal o verticalmente como un par de ojos amigables, minimalistas y soñolientos.
  - En estado *Despierto / Espera*: Ojos abiertos curiosos con destellos azulados.
  - En estado *Detectando Sueño*: Párpados pesados entrecerrándose con halo de respiración circadiana (frecuencia de 4 segundos inhalación, 4 segundos exhalación para inducir relajación parasimpática).
  - En estado *Dormido*: Ojos completamente cerrados con sutiles arcos sonrientes y halo de sueño profundo púrpura estelar.
  - En estado *Despertar*: Ojos abriéndose con resplandor naranja amanecer.

---

## 2. Paleta Cromática (OLED Dark & Dawn Horizon)

| Token Semántico | Valor Hex | Uso Principal |
| :--- | :--- | :--- |
| `--bg-void` | `#05050A` | Fondo primario ultra-negro OLED (cero deslumbramiento). |
| `--bg-surface-glass` | `rgba(20, 18, 38, 0.65)` | Tarjetas y contenedores con desenfoque `backdrop-blur-xl`. |
| `--brand-purple-deep` | `#6366F1` | Púrpura de sueño profundo y botones primarios. |
| `--brand-purple-glow` | `#A855F7` | Halo de la mascota y estado de sueño REM. |
| `--brand-blue-night` | `#1E1B4B` | Degradados de medianoche y fases de sueño ligero. |
| `--brand-blue-cyan` | `#38BDF8` | Métricas de consistencia, aire y respiración. |
| `--brand-orange-dawn` | `#F97316` | Acentos de alarma, amanecer, racha de 8h y energía al despertar. |
| `--brand-orange-soft` | `#FDBA74` | Resplandor del botón de despertar suave y widgets. |
| `--text-primary` | `#F8FAFC` | Tipografía principal de máximo contraste nocturno. |
| `--text-secondary` | `#94A3B8` | Textos de apoyo, etiquetas secundarias. |
| `--text-dim` | `#475569` | Unidades y micro-datos para no fatigar la vista. |

---

## 3. Principios de Interacción (Apple HIG & Impeccable)
1. **Ritmo de 8pt y Áreas Táctiles:**
   - Todos los elementos interactivos tienen una superficie mínima de **44x44 pt** (`min-h-[44px] min-w-[44px]`).
   - El espaciado interior y exterior sigue múltiplos de 8 (8px, 16px, 24px, 32px, 48px).
2. **Micro-interacciones y Feedback Háptico:**
   - Cada pulsación en botones clave activa feedback háptico (`Haptics.impact({ style: ImpactStyle.Light })`).
   - Al pulsar "Iniciar Noche Sle8p", se reproduce una secuencia háptica descendente que imita el latido cardíaco ralentizándose.
3. **El Anillo Orbital de 8 Horas:**
   - El círculo de progreso central visualiza de un vistazo las 8 horas diarias y las semanas/meses.
   - El degradado del anillo transita de azul medianoche -> púrpura místico -> naranja amanecer conforme se alcanzan las 8 horas de sueño.
