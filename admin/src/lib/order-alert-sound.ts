let ctx: AudioContext | null = null;

export function unlockOrderAlertAudio() {
  if (typeof window === "undefined") return;
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === "suspended") void ctx.resume();
}

export function isOrderAlertSoundEnabled(): boolean {
  if (typeof window === "undefined") return true;
  return localStorage.getItem("ravanon_alert_sound") !== "off";
}

export function setOrderAlertSoundEnabled(on: boolean) {
  localStorage.setItem("ravanon_alert_sound", on ? "on" : "off");
}

/** Restoran POS tarzı çift zil */
export function playNewOrderChime() {
  if (!isOrderAlertSoundEnabled()) return;
  unlockOrderAlertAudio();
  if (!ctx) return;

  const now = ctx.currentTime;
  const master = ctx.createGain();
  master.gain.setValueAtTime(0.0001, now);
  master.gain.exponentialRampToValueAtTime(0.45, now + 0.02);
  master.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);
  master.connect(ctx.destination);

  const playTone = (freq: number, start: number, dur: number) => {
    const osc = ctx!.createOscillator();
    const g = ctx!.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, start);
    g.gain.setValueAtTime(0.0001, start);
    g.gain.exponentialRampToValueAtTime(0.35, start + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    osc.connect(g);
    g.connect(master);
    osc.start(start);
    osc.stop(start + dur + 0.05);
  };

  playTone(880, now, 0.22);
  playTone(1174.66, now + 0.18, 0.28);
  playTone(880, now + 0.42, 0.18);
}

/** Kargo hazırlık vurgusu — tek yüksek ton */
export function playShippingAlertChime() {
  if (!isOrderAlertSoundEnabled()) return;
  unlockOrderAlertAudio();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(659.25, now);
  osc.frequency.exponentialRampToValueAtTime(987.77, now + 0.12);
  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(0.4, now + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);
  osc.connect(g);
  g.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.6);
}