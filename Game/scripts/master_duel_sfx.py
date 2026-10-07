"""Master the DUEL-SFX-062 wavs: trim tail below -60 dB, set each cue's max momentary loudness (EBU R128, measured by ffmpeg)
to its tier target at the default in-game level, keep true peak <= -1 dBTP, encode mono MP3 (libmp3lame q2).
Run: python3 scripts/master_duel_sfx.py <rawdir> <outdir>"""
import sys, os, re, subprocess, json, numpy as np
from scipy.io import wavfile
DEFAULT_VOL = .8          # AUDIO_DEFAULTS for every duel cue in game.js
# Target max momentary loudness *as heard* (LUFS) — same tiers as AUDIO-MIX-061.
TARGET = dict(swingBlade=-27, swingHeavy=-27, swingShadow=-28, shot=-21, swingSpirit=-25,
              hitBlade=-19.5, hitHeavy=-18.5, hitShadow=-19.5, hitBullet=-19.5, hitCrit=-17, hitSpirit=-17,
              counter=-18.5, blockShield=-20, ward=-24, evade=-23, burn=-23.5, shieldUp=-21,
              castClass=-26, castSpirit=-20, castDomain=-19, domainHeal=-21, nightfall=-20.5)
def measure(path):
    r = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', path, '-af', 'ebur128=peak=true:metadata=1,ametadata=print:key=lavfi.r128.M',
                        '-f', 'null', '-'], capture_output=True, text=True)
    m = [float(v) for v in re.findall(r'lavfi\.r128\.M=(-?[\d.]+)', r.stdout + r.stderr) if float(v) > -120]
    tp = re.findall(r'Peak:\s+(-?[\d.]+|-inf) dBFS', r.stderr)
    return max(m), float(tp[-1]) if tp and tp[-1] != '-inf' else -99
def main(raw, out):
    os.makedirs(out, exist_ok=True); report = {}
    for name, target in TARGET.items():
        sr, x = wavfile.read(os.path.join(raw, name + '.wav')); x = x.astype(np.float64) / 32767
        env = np.abs(x); thr = 10 ** (-60 / 20) * env.max(); idx = np.where(env > thr)[0]
        x = x[:idx[-1] + int(.03 * sr)]; f = int(.02 * sr); x[-f:] *= np.linspace(1, 0, f)
        tmp = f'/tmp/_m_{name}.wav'; wavfile.write(tmp, sr, (x * 32767).astype(np.int16))
        mmax, _ = measure(tmp)
        file_target = target - 20 * np.log10(DEFAULT_VOL)
        g = 10 ** ((file_target - mmax) / 20); y = x * g
        for _ in range(3):   # soft knee above 0.55 (max 0.85 = -1.4 dBFS), then re-trim gain toward the loudness target
            a = np.abs(y); y = np.where(a < .55, y, np.sign(y) * (.55 + .3 * np.tanh((a - .55) / .3)))
            wavfile.write(tmp, sr, (np.clip(y, -1, 1) * 32767).astype(np.int16)); m2, _ = measure(tmp)
            if abs(m2 - file_target) < .3: break
            y = y * 10 ** ((file_target - m2) / 20)
        wavfile.write(tmp, sr, (np.clip(y, -1, 1) * 32767).astype(np.int16))
        dst = os.path.join(out, name + '.mp3')
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', tmp, '-ac', '1', '-ar', '48000', '-c:a', 'libmp3lame', '-q:a', '2', dst], check=True)
        mm, tp = measure(dst)
        report[name] = dict(seconds=round(len(y) / sr, 2), file_Mmax=round(mm, 1), heard_Mmax=round(mm + 20 * np.log10(DEFAULT_VOL), 1),
                            target=target, truePeak=tp, kib=round(os.path.getsize(dst) / 1024, 1))
        print(name, report[name])
    json.dump(report, open(os.path.join(out, 'loudness-report.json'), 'w'), indent=1)
if __name__ == '__main__': main(sys.argv[1], sys.argv[2])
