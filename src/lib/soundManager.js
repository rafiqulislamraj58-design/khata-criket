let on = true, // শুরুতেই সাউন্ড রেডি থাকবে (মিউট বাটন চাপলে false হবে)
  ctx,
  bgmTimer = null,
  step = 0;

// সিঙ্গেল টোন জেনারেটর
const tone = (f, d, t0 = 0, type = 'sine', v = 0.15) => {
  if (!ctx) return;
  const c = ctx,
    o = c.createOscillator(),
    g = c.createGain(),
    n = c.currentTime + t0;
  o.type = type;
  o.frequency.value = f;
  g.gain.setValueAtTime(v, n);
  g.gain.exponentialRampToValueAtTime(0.001, n + d);
  o.connect(g).connect(c.destination);
  o.start(n);
  o.stop(n + d);
};

// গেমের সাউন্ড ইফেক্টসমূহ
const S = {
  // চরকা ঘোরার আসল "ত্ররররর... টিক... টিক" সাউন্ড (৪.২ সেকেন্ডের স্পিনের সাথে মিলিয়ে)
  spin: () => {
    const totalTicks = 42;
    for (let i = 0; i < totalTicks; i++) {
      // শুরুতে খুব দ্রুত (ত্রররর) এবং শেষে আস্তে আস্তে স্লো হবে (ease-out কার্ভ)
      const progress = i / totalTicks;
      const delay = Math.pow(progress, 2.2) * 3.9;
      // পিন বাড়ি খাওয়ার মতো তীক্ষ্ণ কাঠের/প্লাস্টিকের ক্লিক সাউন্ড
      tone(650 - progress * 200, 0.035, delay, 'triangle', 0.12);
    }
  },

  // চার রান
  four: () => [523, 659, 784].forEach((f, i) => tone(f, 0.22, i * 0.1, 'sine', 0.18)),

  // ছক্কা
  six: () =>
    [523, 659, 784, 1047, 1319].forEach((f, i) =>
      tone(f, 0.25, i * 0.09, 'square', 0.1)
    ),

  // আউট
  out: () =>
    [330, 262, 196].forEach((f, i) => tone(f, 0.3, i * 0.15, 'sawtooth', 0.14)),

  // ম্যাচ জিতলে
  win: () =>
    [523, 523, 659, 784, 659, 784, 1047].forEach((f, i) =>
      tone(f, 0.25, i * 0.14, 'triangle', 0.16)
    ),

  // সাধারণ বাটন ক্লিক (যদি প্লে/স্টার্ট বাটনে আলাদা ক্লিক সাউন্ড চান)
  click: () => tone(600, 0.06, 0, 'sine', 0.1),
};

const BGM_NOTES = [261.63, 0, 329.63, 392.0, 0, 349.23, 329.63, 0];

const initCtx = async () => {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (ctx.state === 'suspended') {
    await ctx.resume();
  }
  return ctx;
};

const sm = {
  isOn() {
    return on;
  },

  setOn(v) {
    on = v;
    if (!on) {
      this.stopBgm();
    }
  },

  // async করা হয়েছে যাতে ব্রাউজার অডিও আনলক হওয়ার সাথে সাথেই সাউন্ড বাজে
  async play(k) {
    if (!on) return;
    try {
      await initCtx();
      if (S[k]) {
        S[k]();
      }
    } catch (e) {}
  },

  async startBgm() {
    if (!on || bgmTimer || typeof window === 'undefined') return;
    try {
      await initCtx();
      bgmTimer = setInterval(() => {
        if (!on) return;
        const freq = BGM_NOTES[step % BGM_NOTES.length];
        if (freq > 0) tone(freq, 1.1, 0, 'sine', 0.015);
        step++;
      }, 750);
    } catch (e) {}
  },

  stopBgm() {
    if (bgmTimer) {
      clearInterval(bgmTimer);
      bgmTimer = null;
      step = 0;
    }
  },
};

export default sm;