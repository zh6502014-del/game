"""Procedural sound design for the four story-battle skills (STORY-SKILL-FX v2).
Each cue is layered from physical parts (impacts, debris, whooshes, blade ring, energy) plus a short cave room.
Synthesized from scratch, 44.1 kHz mono. Run: python3 gen_skill_fx_sfx.py <outdir>  -> <name>.wav (convert to mp3 with ffmpeg).
Style: dark, weighty, restrained - no cartoon chimes."""
import sys, os, numpy as np
from scipy import signal
from scipy.io import wavfile
SR = 44100
rng = np.random.default_rng(2026)
OUT = sys.argv[1] if len(sys.argv) > 1 else '.'
os.makedirs(OUT, exist_ok=True)

def T(d): return np.arange(int(d * SR)) / SR
def sos(x, kind, f, o=2): return signal.sosfilt(signal.butter(o, f, kind, fs=SR, output='sos'), x)
def noise(d): return rng.standard_normal(int(d * SR))
def brown(d):
    x = np.cumsum(noise(d)); x = sos(x, 'high', 20); return x / (np.max(np.abs(x)) + 1e-9)
def place(buf, x, at, g=1.0):
    i = int(at * SR); j = min(len(buf), i + len(x))
    if j > i: buf[i:j] += x[:j - i] * g
def env_exp(d, tau, att=.002):
    t = T(d); return np.minimum(1, t / att) * np.exp(-t / tau)
def sweep_sine(d, f0, f1, curve=2.0):
    t = T(d); f = f1 + (f0 - f1) * (1 - t / d) ** curve; return np.sin(2 * np.pi * np.cumsum(f) / SR)
def bandsweep(x, f0, f1, q=1.2, blocks=48):
    """time-varying bandpass by blocks (log sweep)"""
    n = len(x); out = np.zeros(n); B = max(256, n // blocks); zi = np.zeros((1, 2))
    for i in range(0, n, B):
        k = i / max(1, n - 1); f = f0 * (f1 / f0) ** k; bw = f / q
        lo, hi = max(30, f - bw / 2), min(SR / 2 - 100, f + bw / 2)
        s = signal.butter(1, [lo, hi], 'band', fs=SR, output='sos')
        seg, zi = signal.sosfilt(s, x[i:i + B], zi=zi); out[i:i + B] = seg
    return out
def lowsweep(x, f0, f1, blocks=48):
    n = len(x); out = np.zeros(n); B = max(256, n // blocks); zi = np.zeros((1, 2))
    for i in range(0, n, B):
        k = i / max(1, n - 1); f = f0 * (f1 / f0) ** k
        s = signal.butter(2, min(f, SR / 2 - 200), 'low', fs=SR, output='sos')
        seg, zi = signal.sosfilt(s, x[i:i + B], zi=zi); out[i:i + B] = seg
    return out
def room(x, size=.35, wet=.35, hp=150):
    L = int(size * 3 * SR); ir = sos(noise(L / SR), 'low', 3500) * np.exp(-np.arange(L) / SR / size)
    ir[:int(.01 * SR)] = 0; ir /= np.sqrt((ir ** 2).sum()) + 1e-9
    w = signal.fftconvolve(sos(x, 'high', hp), ir)[:len(x)]
    return x + w * wet
def finish(name, x, peak=.89, tail=.04):
    x = sos(x, 'high', 28)
    x = np.tanh(x / (np.max(np.abs(x)) + 1e-9) * 1.4); x = x / np.max(np.abs(x)) * peak
    m = int(tail * SR); x[-m:] *= np.linspace(1, 0, m)
    wavfile.write(os.path.join(OUT, name + '.wav'), SR, (x * 32767).astype(np.int16))
    print(f'{name:16s} {len(x)/SR:.2f}s rms {np.sqrt((x**2).mean()):.3f}')

# ---- building blocks -------------------------------------------------------------------------------------------
def thump(d, f0, f1, tau, g=1.0):  # low body hit with pitch drop
    return sweep_sine(d, f0, f1, 3) * env_exp(d, tau, .003) * g
def knock(d, lo, hi, tau, g=1.0):  # filtered noise burst
    return sos(noise(d), 'band', [lo, hi]) * env_exp(d, tau, .001) * g
def click(f, tau=.006, g=1.0):  # tiny pebble tick: resonant ping + noise
    d = tau * 8; t = T(d)
    return (np.sin(2 * np.pi * f * t) * .6 + sos(noise(d), 'band', [f * .7, min(f * 1.5, 18000)]) * .8) * np.exp(-t / tau) * g
def debris(d, n, start=0.0, spread=None, fmin=900, fmax=4200, g=1.0, fall=True):
    """gravel/rock rattle: random ticks, denser early, quieter later"""
    buf = np.zeros(int(d * SR)); spread = spread or d * .9
    for k in range(n):
        u = rng.random() ** (1.7 if fall else 1)
        at = start + u * spread; f = rng.uniform(fmin, fmax); gain = g * rng.uniform(.3, 1) * (1 - .7 * u)
        place(buf, click(f, rng.uniform(.004, .012), gain), at)
        if rng.random() < .35: place(buf, knock(.05, 180, 700, .012, gain * .6), at)
    return buf
def metal_ring(d, f, parts=((1, 1), (2.76, .55), (5.4, .32), (8.93, .18)), tau=.6, beat=.4, g=1.0):
    t = T(d); x = np.zeros_like(t)
    for r, a in parts:
        x += a * (np.sin(2 * np.pi * f * r * t) + .6 * np.sin(2 * np.pi * (f * r + beat * r) * t)) * np.exp(-t / (tau / r ** .35))
    return x * g
def whoosh(d, f0, f1, shape='swell', q=1.0, g=1.0):
    x = bandsweep(noise(d), f0, f1, q); t = T(d) / d
    e = {'swell': np.sin(np.pi * t) ** 1.5, 'rev': t ** 2.2 * (t < .96) + (t >= .96) * (1 - (t - .96) / .04), 'decay': np.exp(-t * 5) * np.minimum(1, t * 40)}[shape]
    return x * e * g
def fm(d, fc0, fc1, ratio, idx0, idx1, curve=1.0):
    t = T(d); k = (t / d) ** curve
    fc = fc0 * (fc1 / fc0) ** k; idx = idx0 + (idx1 - idx0) * k
    pc = 2 * np.pi * np.cumsum(fc) / SR; pm = 2 * np.pi * np.cumsum(fc * ratio) / SR
    return np.sin(pc + idx * np.sin(pm))

# ================= 地遁 =================
def quake_stomp():
    d = .9; x = np.zeros(int(d * SR))
    place(x, thump(.55, 95, 34, .16, 1.0), 0)                     # boot+shield slam, chest-deep
    place(x, knock(.12, 120, 650, .03, .9), 0)                    # body
    place(x, metal_ring(.35, 410, tau=.12, g=.10), .004)          # armour/shield clank, short
    place(x, debris(.8, 40, .01, .6, 600, 2400, .4), 0)           # gravel kicked up
    place(x, sos(brown(.8), 'low', 160) * env_exp(.8, .28) * .5, 0)  # ground shudder
    finish('fxQuakeStomp', room(x, .3, .3))

def quake_crack():
    d = .75; x = np.zeros(int(d * SR)); t = T(d)
    r = sos(brown(d), 'low', 140) * (np.minimum(1, t / .08) * np.exp(-np.clip(t - .45, 0, None) / .12)) * (1 + .5 * np.sin(2 * np.pi * 13 * t))
    place(x, r, 0, .9)                                            # rolling rumble under the floor
    grind = bandsweep(noise(d), 260, 900, 2.5) * np.sin(np.pi * np.clip(t / .6, 0, 1)) * .35
    place(x, grind, 0)                                            # stone grinding along the crack
    for k in range(26):                                           # sharp cracks racing forward, denser as it goes
        at = .02 + (k / 26) ** .8 * .5 + rng.uniform(-.01, .01)
        place(x, knock(.04, rng.uniform(900, 1800), rng.uniform(2600, 5200), rng.uniform(.004, .01), rng.uniform(.35, .8)), at)
    place(x, debris(.7, 20, .05, .5, 500, 2000, .28, False), 0)
    finish('fxQuakeCrack', room(x, .3, .25), peak=.8)

def quake_impact():
    d = 1.6; x = np.zeros(int(d * SR)); t = T(d)
    place(x, thump(1.1, 78, 28, .35, 1.0), 0)                     # deep boom
    place(x, sos(noise(.06), 'high', 1800) * env_exp(.06, .01) * .5, 0)  # crack transient
    burst = lowsweep(noise(.9), 3200, 160) * env_exp(.9, .2, .002)
    place(x, burst, 0, .85)                                       # earth bursting upward
    place(x, sos(brown(1.4), 'low', 110) * env_exp(1.4, .5, .02) * .8, 0)   # long ground roll
    place(x, debris(1.5, 60, .08, 1.1, 400, 2600, .5), 0)        # rocks and dirt raining down
    for k in range(7):                                            # a few heavier stones landing
        at = .25 + k * .12 + rng.uniform(0, .05); place(x, thump(.18, rng.uniform(140, 220), 70, .04, .35), at); place(x, knock(.08, 200, 900, .02, .3), at)
    finish('fxQuakeImpact', room(x, .45, .4))

def stun():
    d = 1.6; t = T(d); x = np.zeros(int(d * SR))
    place(x, thump(.3, 110, 50, .08, .7), 0)                      # dull knock to the head
    place(x, knock(.15, 150, 600, .04, .4), 0)
    vib = 1 + .045 * np.sin(2 * np.pi * 3.4 * t)                  # slow, seasick sway
    body = np.zeros_like(t)
    for f, a in ((98, .5), (103.5, .4), (147, .25)):              # low detuned drone sinking down - "head spinning"
        fr = f * vib * (1 - .18 * t / d)
        body += (np.sin(2 * np.pi * np.cumsum(fr) / SR) + .35 * np.sin(4 * np.pi * np.cumsum(fr) / SR)) * a
    body = sos(body, 'low', 700) * np.minimum(1, t / .12) * np.exp(-t / .7)
    swirl = noise(d)                                              # muffled swirling air, wah-wah filter
    out = np.zeros_like(swirl); B = 512; zi = np.zeros((1, 2))
    for i in range(0, len(swirl), B):
        f = 350 + 250 * np.sin(2 * np.pi * 2.2 * i / SR)
        sec = signal.butter(1, [f * .7, f * 1.3], 'band', fs=SR, output='sos'); seg, zi = signal.sosfilt(sec, swirl[i:i + B], zi=zi); out[i:i + B] = seg
    swirl = out * np.minimum(1, t / .1) * np.exp(-t / .6) * .5
    x += body + swirl
    finish('fxStun', room(sos(x, 'low', 1500), .4, .35), peak=.62)

# ================= 殘影 =================
def shadow_gather():
    d = .55; t = T(d); x = np.zeros(int(d * SR))
    place(x, whoosh(d, 250, 2400, 'rev', 1.4, 1.0), 0)            # smoke sucked inward (reverse whoosh)
    breath = bandsweep(noise(d), 700, 1600, 3) * (t / d) ** 2 * .4  # breathy whisper texture
    place(x, breath, 0)
    place(x, sos(brown(d), 'low', 90) * (t / d) ** 2 * .5, 0)
    finish('fxShadowGather', room(x, .25, .3), peak=.7)

def shadow_burst():
    d = 1.2; t = T(d); x = np.zeros(int(d * SR))
    place(x, thump(.35, 120, 45, .09, .7), 0)                     # soft low "poof"
    place(x, whoosh(.9, 1800, 300, 'decay', .9, 1.0), 0)          # smoke spreading out
    flutter = sos(noise(.7), 'band', [300, 1600]) * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 19 * T(.7)))) * env_exp(.7, .22) * .45
    place(x, flutter, .02)                                        # cloak flapping
    for f in (110, 116.5):                                        # dark minor-second swell underneath
        place(x, np.sin(2 * np.pi * f * T(1.1)) * np.sin(np.pi * np.clip(T(1.1) / 1.1, 0, 1)) ** 2 * .22, .05)
    comb = noise(1.0); dl = int(.0042 * SR); y = comb.copy()
    for i in range(dl, len(y)): y[i] += .82 * y[i - dl]
    place(x, sos(y, 'band', [500, 3000]) * env_exp(1.0, .3, .05) * .05, .1)   # ghostly phasing tail
    finish('fxShadowBurst', room(sos(x, 'low', 2600), .4, .45))

# ================= 人劍合一 =================
def unity_gather():
    d = .6; t = T(d); x = np.zeros(int(d * SR))
    f = 110 * 2 ** (t / d)                                         # energy rising an octave
    hum = sum(np.sin(2 * np.pi * np.cumsum(f * m) / SR) / m for m in (1, 2, 3, 4)) * (t / d) ** 1.5 * .35
    place(x, sos(hum, 'low', 1800), 0)
    place(x, whoosh(d, 900, 5200, 'rev', 2.0, .55), 0)            # air drawn in
    place(x, np.sin(2 * np.pi * 2140 * t) * (t / d) ** 3 * .07, 0)   # blade starting to sing
    finish('fxUnityGather', room(x, .3, .3), peak=.7)

def unity_strike():
    d = 2.2; t = T(d); x = np.zeros(int(d * SR))
    place(x, whoosh(.2, 4200, 500, 'swell', 1.1, .8), 0)           # the sword-energy cleaving down
    place(x, thump(1.2, 70, 26, .4, 1.0), .14)                     # huge low impact
    place(x, lowsweep(noise(1.3), 1800, 90) * env_exp(1.3, .35, .01) * .7, .14)   # golden shockwave rolling outward
    place(x, sos(brown(1.6), 'low', 120) * env_exp(1.6, .55, .03) * .6, .14)      # ground/air rumble
    n = 1.9; tt = T(n)                                            # majestic power-chord swell (D2-A2-D3-A3), brass-like, no ringing
    chord = np.zeros_like(tt)
    for f, a in ((73.4, 1), (110, .8), (146.8, .6), (220, .35)):
        for det in (-.004, 0, .004):
            ph = 2 * np.pi * np.cumsum(np.full_like(tt, f * (1 + det))) / SR
            chord += a * (2 * ((ph / (2 * np.pi)) % 1) - 1) / 3      # saw stack
    bright = np.minimum(1, tt / .25)                               # brass "bloom": filter opens then closes
    out = np.zeros_like(chord); B = 512; zi = np.zeros((1, 2))
    for i in range(0, len(chord), B):
        k = i / SR; fc = 300 + 1500 * min(1, k / .25) * np.exp(-max(0, k - .25) / .6)
        sec = signal.butter(2, fc, 'low', fs=SR, output='sos'); seg, zi = signal.sosfilt(sec, chord[i:i + B], zi=zi); out[i:i + B] = seg
    chord = out * np.minimum(1, tt / .06) ** 1.5 * np.exp(-np.clip(tt - .35, 0, None) / .6) * .55
    place(x, chord, .14)
    finish('fxUnityStrike', room(x, .7, .55))

# ================= 共振彈 =================
def res_charge():
    d = .45; t = T(d); x = np.zeros(int(d * SR))
    whine = fm(d, 260, 820, 1.5, .5, 3.5, 1.4) * (t / d) ** 1.2 * .45      # energy whine climbing
    trem = 1 + .6 * np.sin(2 * np.pi * np.cumsum(8 + 30 * (t / d) ** 2) / SR)  # resonance tremolo speeding up
    hum = np.sin(2 * np.pi * 110 * t) * .4 * trem * (t / d)
    place(x, sos(whine, 'low', 3500) + hum, 0)
    place(x, sos(noise(d), 'band', [1800, 5000]) * (t / d) ** 3 * .12, 0)   # crackle of charge
    finish('fxResCharge', room(x, .25, .25), peak=.7)

def res_fire():
    d = .55; t = T(d); x = np.zeros(int(d * SR))
    place(x, sos(noise(.03), 'high', 2000) * env_exp(.03, .004) * 1.0, 0)    # gun crack
    place(x, thump(.25, 150, 55, .05, .9), 0)                               # muzzle body
    place(x, knock(.08, 1200, 4000, .012, .45), .002)                       # brass mechanism
    place(x, fm(.35, 2200, 260, 2.0, 4, .5, .6) * env_exp(.35, .1, .002) * .3, .01)   # energy release zap falling
    place(x, whoosh(.3, 2600, 900, 'decay', 1.4, .35), .03)                 # round flying off
    finish('fxResFire', room(x, .3, .3))

def res_impact():
    d = 1.4; t = T(d); x = np.zeros(int(d * SR))
    place(x, thump(.45, 95, 38, .11, .9), 0)
    place(x, lowsweep(noise(.5), 2400, 250) * env_exp(.5, .1, .002) * .55, 0)
    for k, at in enumerate((0, .085, .17)):                                 # three resonance pulses = three rings
        n = .9; tt = T(n); f = 146 * (1 - .06 * k)
        vib = 1 + .015 * np.sin(2 * np.pi * 6 * tt)
        pulse = (np.sin(2 * np.pi * np.cumsum(f * vib) / SR) + .5 * np.sin(2 * np.pi * np.cumsum(f * 2.01 * vib) / SR) + .25 * np.sin(2 * np.pi * np.cumsum(f * 3.02) / SR))
        pulse *= np.minimum(1, tt / .01) * np.exp(-tt / .28) * (.55 - .13 * k)
        place(x, pulse, at)
    glass = metal_ring(1.0, 1650, parts=((1, 1), (2.3, .5), (4.1, .25)), tau=.3, beat=1.2, g=.05)   # crystal shimmer
    place(x, glass, .02)
    finish('fxResImpact', room(x, .45, .4))

def res_tick():
    d = .8; x = np.zeros(int(d * SR))
    for k, at in enumerate((0, .16)):
        tt = T(.6); f = 140
        p = (np.sin(2 * np.pi * f * tt) + .4 * np.sin(2 * np.pi * f * 2.01 * tt)) * np.minimum(1, tt / .01) * np.exp(-tt / .2) * (.5 - .18 * k)
        place(x, p, at)
    place(x, knock(.1, 300, 1200, .03, .2), 0)
    finish('fxResTick', room(x, .35, .35), peak=.55)

for f in (quake_stomp, quake_crack, quake_impact, stun, shadow_gather, shadow_burst, unity_gather, unity_strike, res_charge, res_fire, res_impact, res_tick):
    f()
