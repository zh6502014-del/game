"""Procedural roar for the abyss creatures (STORY-ROAR): a hoarse, stretched, half-human throat (glottal pulses with jitter through
vowel formants, breath noise, soft clipping) plus brittle crystal ringing. Synthesized from scratch; 44.1 kHz mono.
Run: python3 gen_roar.py <outdir>  -> abyss-roar.wav (convert to mp3 with ffmpeg)."""
import sys,numpy as np
from scipy import signal
from scipy.io import wavfile
SR=44100;rng=np.random.default_rng(77)
def t_(d):return np.arange(int(d*SR))/SR
def sos(x,kind,f,o=2):return signal.sosfilt(signal.butter(o,f,kind,fs=SR,output='sos'),x)
def res(x,f,q):
    w=2*np.pi*f/SR;r=np.exp(-w/(2*q));b=[1-r];a=[1,-2*r*np.cos(w),r*r]
    return signal.lfilter(b,a,x)
D=3.0;n=int(D*SR);tt=t_(D)
# fundamental contour: rises into the roar, then sags (a throat being stretched)
f0=62+38*np.sin(np.pi*np.clip(tt/0.7,0,1))*(tt<0.7)+ (tt>=0.7)*(100-34*np.clip((tt-.7)/2.2,0,1)**0.8)
f0=f0*(1+.025*np.sin(2*np.pi*7.3*tt)+.012*np.sin(2*np.pi*13.1*tt))
jit=np.cumsum(rng.standard_normal(n))/np.sqrt(n)*.0;f0=f0*(1+.01*sos(rng.standard_normal(n),'low',30))
def voice(detune,gain):
    ph=np.cumsum(2*np.pi*f0*detune/SR)
    pulse=sum(np.sin(h*ph)/h**.9 for h in range(1,40))     # buzzy glottal source
    pulse=pulse*(1+.5*rng.standard_normal(n)*.0)
    return pulse*gain
src=voice(1.0,1)+voice(1.012,.8)+voice(.5,.7)               # + sub octave
src+=sos(rng.standard_normal(n),'high',900)*.9*(0.4+0.6*np.abs(np.sin(2*np.pi*f0.cumsum()/SR/1.0)))  # aspirated rasp locked to the pulse
# vowel formants morph "ah" -> "oh" -> "ah"
# simple block formant bank (state kept per block via overlap)
def formant_bank(x):
    B=1024;out=np.zeros_like(x);m=np.clip(.5+.5*np.sin(2*np.pi*tt/2.4-1.2),0,1)
    for (fa,fb,bw,g) in ((720,520,130,1.0),(1150,900,160,.8),(2500,2300,300,.45),(3400,3300,400,.25)):
        zi=np.zeros((2,2))
        for i in range(0,n,B):
            fm=fa*(1-m[i])+fb*m[i]
            s=signal.butter(2,[fm-bw/2,fm+bw/2],'band',fs=SR,output='sos')
            seg,zi=signal.sosfilt(s,x[i:i+B],zi=zi)
            out[i:i+B]+=seg*g
    return out
v=formant_bank(src)
v=sos(v,'low',5200)
v=v/np.max(np.abs(v))+0.55*sos(src,'low',230,4)/np.max(np.abs(sos(src,'low',230,4)))   # chest body under the throat
# amplitude: sharp attack, ragged sustain (tremolo), long falling tail
env=np.minimum(1,tt/.09)**1.5*np.exp(-np.clip(tt-1.5,0,None)/.75)
env*=1+.28*np.sin(2*np.pi*9.5*tt+.5)*np.clip(tt/.6,0,1)
v*=env
v=np.tanh(v*3.2/np.max(np.abs(v)))                          # strained overdrive
# crystalline ringing: bright pings that follow the roar, like shards vibrating
ring=np.zeros(n)
for at in np.concatenate([[.04],np.sort(rng.uniform(.2,2.2,26))]):
    m=int(rng.uniform(.25,.6)*SR);ff=rng.uniform(2800,7200);k=np.arange(m)/SR
    p=np.sin(2*np.pi*ff*k+rng.uniform(0,6))*np.exp(-k/rng.uniform(.04,.13))*rng.uniform(.04,.16)*(1.6 if at<.1 else 1)
    i=int(at*SR);j=min(n,i+m);ring[i:j]+=p[:j-i]
breath=sos(rng.standard_normal(n),'band',[500,2200])*env*.12
x=v*.8+ring*.55+breath
# cave room
L=int(1.1*SR);ir=sos(rng.standard_normal(L),'low',3000)*np.exp(-np.arange(L)/SR/.28);ir[:int(.012*SR)]=0;ir/=np.sqrt((ir**2).sum())
w=signal.fftconvolve(x,ir)[:n]
x=x*.72+w*.55
x=sos(x,'high',40)
x/=np.max(np.abs(x));x*=.89
x[-int(.05*SR):]*=np.linspace(1,0,int(.05*SR))
wavfile.write(sys.argv[1]+'/abyss-roar.wav',SR,(x*32767).astype(np.int16))
print('rms',np.sqrt((x**2).mean()),'peak',np.abs(x).max())
