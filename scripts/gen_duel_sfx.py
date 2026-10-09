"""Procedural combat sounds for the free card duel (DUEL-SFX-062).
Everything is synthesized from physical ingredients (air whooshes, pitched body thumps, filtered noise crunches,
damped inharmonic metal partials, a small dark room), so no sample is copied from anywhere. 48 kHz mono.
House style: dark and restrained. No bright chimes, rising arpeggios or cartoon accents.
Run: python3 scripts/gen_duel_sfx.py <outdir>   (writes <name>.wav; scripts/encode below converts to mp3)."""
import sys, os, numpy as np
from scipy import signal
from scipy.io import wavfile

SR = 48000
rng = np.random.default_rng(62)

def n_(d): return int(d * SR)
def t_(d): return np.arange(n_(d)) / SR
def sos(kind, f, o=2): return signal.butter(o, f, kind, fs=SR, output='sos')
def lp(x, f, o=2): return signal.sosfilt(sos('low', f, o), x)
def hp(x, f, o=2): return signal.sosfilt(sos('high', f, o), x)
def bp(x, a, b, o=2): return signal.sosfilt(sos('band', [a, b], o), x)
def noise(d): return rng.standard_normal(n_(d))
def place(buf, x, at, g=1.0):
    # every layer ends with a 6 ms fade so a truncated envelope never leaves a click
    x = np.array(x, dtype=float); f = min(len(x), n_(.006)); x[-f:] *= np.linspace(1, 0, f)
    i = n_(at); j = min(len(buf), i + len(x)); buf[i:j] += g * x[:j - i]
def env_ad(d, a, decay, curve=1.0):
    t = t_(d); e = np.where(t < a, (t / max(a, 1e-4)) ** curve, np.exp(-(t - a) / decay)); return e
def swell(d, peak_at, decay):
    t = t_(d); return np.where(t < peak_at, (t / peak_at) ** 2, np.exp(-(t - peak_at) / decay))

def sweep_noise(d, f0, f1, q=1.4, peak_at=.6, decay=.05):
    """Air whoosh: band-pass noise whose centre glides f0 -> f1 (time-varying via short blocks)."""
    x = noise(d); out = np.zeros_like(x); blk = 256
    zi = None
    for s in range(0, len(x), blk):
        frac = s / len(x); fc = f0 * (f1 / f0) ** frac
        lo, hi = fc / (1 + 1 / q), fc * (1 + 1 / q)
        sosf = sos('band', [max(30, lo), min(SR / 2 - 100, hi)])
        if zi is None: zi = signal.sosfilt_zi(sosf) * 0
        y, zi = signal.sosfilt(sosf, x[s:s + blk], zi=zi); out[s:s + blk] = y
    return out * swell(d, d * peak_at, decay)

def thump(d, f0, f1, decay, drive=1.0):
    t = t_(d); f = f0 * (f1 / f0) ** (t / d); ph = 2 * np.pi * np.cumsum(f) / SR
    x = np.sin(ph) * env_ad(d, .003, decay)
    return np.tanh(x * drive) / np.tanh(drive)

def crunch(d, f, decay, hpf=80):
    return hp(lp(noise(d), f, 2), hpf) * env_ad(d, .001, decay)

def click(d=.004, f=3500):
    return hp(noise(d), f) * env_ad(d, .0003, .0012)

def metal(d, partials, decays, gains, damp=1.0):
    """Struck dark metal: inharmonic partials with individual decays, slightly detuned pairs for beating."""
    t = t_(d); x = np.zeros_like(t)
    for p, dc, g in zip(partials, decays, gains):
        for det in (1.0, 1.0035):
            x += g * np.sin(2 * np.pi * p * det * t + rng.uniform(0, 6.28)) * np.exp(-t / (dc * damp))
    return x * env_ad(d, .0015, 10)

def room(x, wet=.18, rt=.35, tone=2600):
    ir_n = n_(rt * 2.2); ir = rng.standard_normal(ir_n) * np.exp(-np.arange(ir_n) / SR / (rt / 6.9) * 1.0)
    ir = lp(ir, tone); ir[:n_(.012)] = 0; ir /= np.sqrt(np.sum(ir ** 2)) + 1e-9
    w = signal.fftconvolve(x, ir)[:len(x) + ir_n // 2]
    y = np.concatenate([x, np.zeros(len(w) - len(x))])
    return y + wet * w

def finish(x, fade=.02, top=11000):
    x = lp(hp(x, 35), top); x = x / (np.max(np.abs(x)) + 1e-9) * .89
    f = n_(fade); x[-f:] *= np.linspace(1, 0, f); return x

# ---------- recipes ----------
def swing_blade():
    b = np.zeros(n_(.36))
    place(b, sweep_noise(.26, 650, 2600, 1.6, .62, .035), 0, 1.0)
    place(b, sweep_noise(.26, 300, 900, 1.2, .6, .04), 0, .45)
    return finish(room(b, .12, .25))

def swing_heavy():
    b = np.zeros(n_(.42))
    place(b, sweep_noise(.30, 180, 720, 1.1, .7, .05), 0, 1.0)
    place(b, thump(.30, 70, 52, .12), .03, .25)
    return finish(room(b, .12, .3))

def swing_shadow():
    b = np.zeros(n_(.3))
    place(b, sweep_noise(.15, 1300, 3600, 2.0, .7, .025), 0, .9)
    place(b, sweep_noise(.12, 1600, 4200, 2.0, .7, .02), .07, .6)
    return finish(room(b, .14, .3, 2200), top=9000)

def shot():
    b = np.zeros(n_(.75))
    place(b, click(.004, 2500), 0, 1.0)
    place(b, bp(noise(.05), 900, 2600) * env_ad(.05, .0005, .012), 0, 1.2)
    place(b, thump(.32, 120, 42, .07, 2.2), 0, 1.3)
    place(b, crunch(.18, 1400, .04), .002, .5)
    return finish(room(b, .3, .55, 1800), top=7000)

def swing_spirit():
    b = np.zeros(n_(.55))
    place(b, sweep_noise(.40, 400, 2000, 1.3, .7, .06), 0, 1.0)
    t = t_(.4); drone = (np.sin(2 * np.pi * 73 * t) + .5 * np.sin(2 * np.pi * 110.4 * t)) * swell(.4, .3, .08)
    place(b, drone, 0, .35)
    return finish(room(b, .25, .5, 2000))

def hit_blade():
    b = np.zeros(n_(.5))
    place(b, click(.005, 3000), 0, .8)
    place(b, bp(noise(.06), 1800, 5200) * env_ad(.06, .001, .014), 0, .9)
    place(b, thump(.26, 150, 58, .07, 1.8), 0, 1.3)
    place(b, crunch(.16, 1800, .035, 200), .004, .7)
    place(b, metal(.22, [1530, 2310, 3170], [.05, .035, .025], [.12, .08, .05]), 0, 1)
    return finish(room(b, .2, .4))

def hit_heavy():
    b = np.zeros(n_(.7))
    place(b, click(.006, 1800), 0, .7)
    place(b, thump(.42, 105, 38, .12, 2.4), 0, 1.6)
    place(b, crunch(.22, 1100, .05, 90), 0, .9)
    place(b, metal(.45, [212, 347, 503, 741], [.16, .11, .08, .05], [.3, .22, .15, .08]), .002, 1)
    return finish(room(b, .22, .45, 1800), top=8000)

def hit_shadow():
    b = np.zeros(n_(.45))
    for k, at in enumerate((0, .075)):
        place(b, bp(noise(.04), 1400, 4200) * env_ad(.04, .0008, .01), at, .9 - .2 * k)
        place(b, thump(.16, 170, 80, .04, 1.6), at, .8 - .2 * k)
    place(b, crunch(.12, 1500, .03, 200), .08, .45)
    return finish(room(b, .22, .4, 2000))

def hit_bullet():
    b = np.zeros(n_(.55))
    place(b, click(.004, 2200), 0, .9)
    place(b, thump(.25, 165, 62, .06, 2.0), 0, 1.3)
    place(b, crunch(.2, 2400, .045, 300), 0, .8)
    for at, g in ((.03, .25), (.07, .18), (.12, .12)):  # debris
        place(b, bp(noise(.02), 1500, 4500) * env_ad(.02, .0005, .004), at, g)
    return finish(room(b, .2, .4, 2200))

def hit_crit():
    b = np.zeros(n_(1.1))
    place(b, click(.005, 2000), 0, 1.0)
    place(b, thump(.55, 120, 34, .16, 2.8), 0, 1.7)
    place(b, crunch(.28, 1600, .07, 100), 0, 1.0)
    for at, g in ((.03, .3), (.06, .22), (.1, .16), (.16, .1)):
        place(b, bp(noise(.025), 1300, 4000) * env_ad(.025, .0005, .005), at, g)
    fire = lp(noise(.7), 900) * swell(.7, .18, .22); fire *= 1 + .6 * (rng.random(len(fire)) > .996)
    place(b, fire, .05, .55)
    return finish(room(b, .28, .6, 1700), top=8000)

def hit_spirit():
    b = np.zeros(n_(.9))
    place(b, click(.005, 2600), 0, .8)
    place(b, thump(.45, 130, 40, .13, 2.2), 0, 1.5)
    place(b, bp(noise(.06), 1600, 4800) * env_ad(.06, .001, .016), 0, .9)
    place(b, bp(noise(.7), 500, 1500) * env_ad(.7, .02, .2), 0, .45)   # spent energy rush
    t = t_(.6); place(b, np.sin(2 * np.pi * 55 * t) * env_ad(.6, .01, .2), 0, .5)
    return finish(room(b, .3, .6, 1900))

def counter():
    b = np.zeros(n_(.7))
    place(b, sweep_noise(.12, 300, 1100, 1.2, .8, .02), 0, .5)
    place(b, click(.006, 1800), .1, .8)
    place(b, thump(.35, 120, 45, .1, 2.2), .1, 1.4)
    place(b, metal(.4, [233, 389, 562, 820], [.14, .1, .07, .05], [.3, .2, .14, .08]), .1, 1)
    place(b, crunch(.15, 1300, .04, 120), .1, .6)
    return finish(room(b, .2, .45, 1900), top=8500)

def block_shield():
    b = np.zeros(n_(.9))
    place(b, click(.004, 2000), 0, .7)
    place(b, thump(.25, 140, 70, .06, 1.6), 0, .9)
    place(b, metal(.85, [287, 463, 688, 1012, 1394], [.32, .24, .17, .11, .07], [.32, .25, .18, .1, .05]), 0, 1)
    return finish(room(b, .25, .55, 2000), top=7500)

def ward():
    b = np.zeros(n_(.6))
    place(b, thump(.3, 85, 60, .1, 1.4), 0, 1.0)
    place(b, lp(noise(.3), 700) * swell(.3, .05, .08), 0, .5)
    place(b, metal(.5, [310, 498, 733], [.2, .14, .09], [.2, .13, .07]), .01, .6)
    return finish(room(b, .22, .45, 1800), top=7000)

def evade():
    b = np.zeros(n_(.4))
    place(b, sweep_noise(.2, 2400, 900, 1.8, .45, .04), 0, 1.0)
    flap = lp(noise(.12), 1400) * env_ad(.12, .005, .03) * (1 + .6 * np.sin(2 * np.pi * 38 * t_(.12)))
    place(b, flap, .06, .45)
    return finish(room(b, .14, .3, 2200), top=9000)

def burn():
    b = np.zeros(n_(.75))
    place(b, lp(noise(.6), 1100) * swell(.6, .12, .2), 0, 1.0)
    for i in range(14):
        at = .02 + rng.uniform(0, .5)
        place(b, bp(noise(.008), 1200, 3800) * env_ad(.008, .0003, .0018), at, rng.uniform(.2, .45))
    place(b, thump(.2, 90, 60, .06), 0, .3)
    return finish(room(b, .15, .35, 1800), top=8000)

def shield_up():
    b = np.zeros(n_(.85))
    t = t_(.5); f = 62 * (96 / 62) ** (t / .5)
    body = (np.sin(2 * np.pi * np.cumsum(f) / SR) + .4 * np.sin(4 * np.pi * np.cumsum(f) / SR)) * swell(.5, .38, .06)
    place(b, body, 0, .6)
    place(b, lp(noise(.5), 600) * swell(.5, .4, .05), 0, .35)
    place(b, click(.004, 1800), .4, .6)
    place(b, metal(.42, [262, 421, 618], [.18, .12, .08], [.3, .2, .1]), .4, .9)
    return finish(room(b, .25, .5, 1900), top=7500)

def cast_class():
    b = np.zeros(n_(.55))
    t = t_(.4); place(b, (np.sin(2 * np.pi * 58 * t) + .3 * np.sin(2 * np.pi * 116 * t)) * swell(.4, .22, .08), 0, .7)
    place(b, lp(noise(.4), 500) * swell(.4, .22, .07), 0, .5)
    return finish(room(b, .22, .45, 1500), top=6000)

def cast_spirit():
    b = np.zeros(n_(1.0))
    t = t_(.75)
    place(b, (np.sin(2 * np.pi * 49 * t) + .45 * np.sin(2 * np.pi * 73.5 * t)) * swell(.75, .55, .12), 0, .7)
    place(b, sweep_noise(.75, 250, 1400, 1.0, .78, .08), 0, .7)
    place(b, thump(.25, 90, 45, .08, 1.6), .58, .7)
    return finish(room(b, .3, .7, 1700), top=7000)

def cast_domain():
    b = np.zeros(n_(1.8))
    t = t_(1.4)
    drone = (np.sin(2 * np.pi * 41 * t) + .5 * np.sin(2 * np.pi * 61.7 * t) + .25 * np.sin(2 * np.pi * 82.3 * t))
    place(b, drone * swell(1.4, .5, .45), 0, .8)
    place(b, bp(noise(1.4), 180, 650) * swell(1.4, .55, .4), 0, .6)
    place(b, thump(.4, 70, 35, .15, 1.8), .48, .8)
    return finish(room(b, .45, 1.1, 1300), top=5000)

def domain_heal():
    b = np.zeros(n_(1.0))
    inhale = bp(noise(.45), 300, 1200) * swell(.45, .4, .03)
    place(b, inhale, 0, .7)
    t = t_(.6); warm = (np.sin(2 * np.pi * 98 * t) + .4 * np.sin(2 * np.pi * 147 * t)) * env_ad(.6, .05, .2) * (1 + .15 * np.sin(2 * np.pi * 5 * t))
    place(b, warm, .38, .6)
    place(b, thump(.25, 80, 50, .07, 1.3), .38, .5)
    return finish(room(b, .35, .7, 1500), top=6000)

def nightfall():
    b = np.zeros(n_(1.7))
    place(b, sweep_noise(1.3, 1400, 180, 1.0, .25, .5), 0, .8)
    t = t_(1.3); f = 82 * (48 / 82) ** (t / 1.3)
    place(b, np.sin(2 * np.pi * np.cumsum(f) / SR) * swell(1.3, .3, .45), 0, .7)
    place(b, thump(.4, 60, 34, .15, 1.4), .05, .5)
    return finish(room(b, .4, 1.0, 1200), top=5000)

RECIPES = dict(
    swingBlade=swing_blade, swingHeavy=swing_heavy, swingShadow=swing_shadow, shot=shot, swingSpirit=swing_spirit,
    hitBlade=hit_blade, hitHeavy=hit_heavy, hitShadow=hit_shadow, hitBullet=hit_bullet, hitCrit=hit_crit, hitSpirit=hit_spirit,
    counter=counter, blockShield=block_shield, ward=ward, evade=evade, burn=burn, shieldUp=shield_up,
    castClass=cast_class, castSpirit=cast_spirit, castDomain=cast_domain, domainHeal=domain_heal, nightfall=nightfall)

if __name__ == '__main__':
    out = sys.argv[1] if len(sys.argv) > 1 else '.'
    os.makedirs(out, exist_ok=True)
    for name, fn in RECIPES.items():
        x = fn(); wavfile.write(os.path.join(out, name + '.wav'), SR, (x * 32767).astype(np.int16))
        print(name, f'{len(x)/SR:.2f}s')
