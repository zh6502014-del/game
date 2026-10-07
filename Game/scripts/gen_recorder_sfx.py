"""Procedural field-recorder sounds for the repaired crystal recorder (STORY-RECORDER).
Everything is synthesized from physical ingredients (switch/relay transients, resonant bodies, motor spin-up with
wow & flutter, tape hiss, oxide crackle, a small room), so no sample is copied from anywhere. 44.1 kHz mono.
Run: python3 gen_recorder.py <outdir>   (writes recorder-on/play/cut as .wav; convert to mp3 with ffmpeg)."""
import sys,numpy as np
from scipy import signal
from scipy.io import wavfile
SR=44100
rng=np.random.default_rng(31)
def t_(d):return np.arange(int(d*SR))/SR
def lp(x,f,o=2):return signal.sosfilt(signal.butter(o,f,'low',fs=SR,output='sos'),x)
def hp(x,f,o=2):return signal.sosfilt(signal.butter(o,f,'high',fs=SR,output='sos'),x)
def bp(x,a,b,o=2):return signal.sosfilt(signal.butter(o,[a,b],'band',fs=SR,output='sos'),x)
def pink(n):
    w=rng.standard_normal(n)
    b=[0.049922035,-0.095993537,0.050612699,-0.004408786];a=[1,-2.494956002,2.017265875,-0.522189400]
    return signal.lfilter(b,a,w)*4
def place(buf,x,at,g=1.0):
    i=int(at*SR);j=min(len(buf),i+len(x))
    if i<len(buf):buf[i:j]+=x[:j-i]*g
def env_exp(n,tau):return np.exp(-np.arange(n)/SR/tau)
def switch_click(strength=1.0,bright=1.0):
    """plastic/steel switch: a sharp noise tick plus two damped body resonances"""
    n=int(.04*SR);x=hp(rng.standard_normal(n),1800*bright)*env_exp(n,.0018)
    for f,tau,g in((2300*bright,.006,.7),(4100*bright,.004,.35),(900,.012,.4)):
        x=x+g*np.sin(2*np.pi*f*t_(.04))*env_exp(n,tau)
    return x*strength
def clunk(strength=1.0,f0=95):
    """heavy mechanism seating: low thud + muffled noise"""
    n=int(.18*SR);tt=t_(.18)
    thud=np.sin(2*np.pi*(f0+40*np.exp(-tt/.02))*tt)*env_exp(n,.05)
    body=lp(rng.standard_normal(n),600)*env_exp(n,.025)*.8
    return (thud+body)*strength
def motor(dur,f_start,f_end,spin,level=1.0,wow=True,fade_out=0.0):
    tt=t_(dur);n=len(tt)
    f=f_end+(f_start-f_end)*np.exp(-tt/spin)
    if wow:f=f*(1+.006*np.sin(2*np.pi*1.3*tt+.7)+.0025*np.sin(2*np.pi*6.1*tt)+.0015*rng.standard_normal(n).cumsum()/np.sqrt(n)*0)
    ph=2*np.pi*np.cumsum(f)/SR
    x=sum(np.sin(h*ph)/h**1.3 for h in(1,2,3,4,6))   # rich hum (belt + rotor)
    x=lp(x,700)*.55
    buzz=bp(rng.standard_normal(n),1800,3200)*(.3+.7*np.abs(np.sin(ph*.5)))*.14   # brush noise follows speed
    whine=np.sin(np.cumsum(2*np.pi*(f*22))/SR)*.035*(f/np.max(f))    # gear whine
    x=(x+buzz+whine)*level
    a=np.minimum(1,tt/.06)
    if fade_out:a=a*np.clip((dur-tt)/fade_out,0,1)
    return x*a
def hiss(dur,level,tilt=1.0):
    n=int(dur*SR);x=pink(n)*.5+hp(rng.standard_normal(n),3000)*.5*tilt
    return bp(x,300,9000)*level
def crackle(dur,rate,level):
    n=int(dur*SR);out=np.zeros(n)
    for at in np.cumsum(rng.exponential(1/rate,int(dur*rate*2)+4)):
        if at>=dur-.03:break
        m=int(rng.uniform(.0008,.004)*SR);p=hp(rng.standard_normal(m),1500)*env_exp(m,rng.uniform(.0004,.0016))
        place(out,p,at,rng.uniform(.25,1.0)*level*(1+3*(rng.random()<.07)))
    return out
def room(x,wet=.14,rt=.16):
    n=int(rt*SR);ir=lp(rng.standard_normal(n),3500)*env_exp(n,rt/5);ir[:int(.003*SR)]=0;ir/=np.sqrt((ir**2).sum())
    w=signal.fftconvolve(x,ir)[:len(x)]
    return x*(1-wet*.5)+w*wet*1.6
def lofi(x,lo=90,hi=7600,drive=1.6):
    x=bp(x,lo,hi,2);x=np.tanh(x*drive)/np.tanh(drive)
    return x
def finish(x,peak=.8,fade=.01):
    x=x-np.mean(x);x=x/(np.max(np.abs(x))+1e-9)*peak
    n=int(fade*SR);x[:n]*=np.linspace(0,1,n);x[-n:]*=np.linspace(1,0,n)
    return (x*32767).astype(np.int16)

def make_on():
    d=1.55;b=np.zeros(int(d*SR))
    place(b,switch_click(1.0),.02);place(b,switch_click(.55,.8),.075)      # power slide: down then seat
    mt=motor(1.35,16,52,.22,.34);place(b,mt,.12)                         # motor spins up with wow
    place(b,clunk(.9),.62)                                              # tape engages the head
    place(b,switch_click(.5,.7),.66)
    h=hiss(1.0,.3)*np.minimum(1,t_(1.0)/.35);place(b,h,.62)           # hiss comes up once tape is moving
    place(b,crackle(.9,16,.55),.66)
    return finish(lofi(room(b)),.82)
def make_play():
    d=1.9;b=np.zeros(int(d*SR))
    place(b,switch_click(.75,.9),.0)                                    # play key
    place(b,clunk(.35,120),.03)
    mt=motor(1.8,50,50,.01,.2,fade_out=.55);place(b,mt,.05)
    h=hiss(1.8,.3)*np.minimum(1,t_(1.8)/.08)*np.clip((1.8-t_(1.8))/.7,0,1);place(b,h,.05)
    place(b,crackle(1.7,22,.5)*np.clip((1.7-t_(1.7))/.5,0,1),.1)
    return finish(lofi(room(b,.1,.12)),.7)
def make_cut():
    d=1.8;b=np.zeros(int(d*SR))
    # the voice tears: a burst of static with a sweeping resonance and AM stutter
    n=int(.62*SR);tt=t_(.62)
    sweep=signal.sosfilt(signal.butter(2,[1200,2600],'band',fs=SR,output='sos'),rng.standard_normal(n))
    gate=(rng.random(int(.62*50)+2)>.35).astype(float);gate=np.interp(tt,np.arange(len(gate))/50,gate)
    gate=lp(gate,60,1)
    stat=(hp(rng.standard_normal(n),700)*.7+sweep*1.2)*(.35+.65*gate)*np.exp(-tt/.5)
    place(b,stat,.0,.9)
    place(b,crackle(.8,70,.9),.0)
    place(b,switch_click(.8,.9),.0)
    # reels run down: motor pitch falls, hiss thins out
    mt=motor(1.2,52,11,.32,.28,fade_out=.5);place(b,mt,.28)
    h=hiss(1.1,.3)*np.clip((1.1-t_(1.1))/.9,0,1);place(b,h,.2)
    place(b,clunk(.8,80),1.28);place(b,switch_click(.7,.8),1.31)           # stop key drops
    return finish(lofi(room(b,.12,.14),drive=2.0),.85)
if __name__=='__main__':
    out=sys.argv[1]
    for name,fn in(('recorder-on',make_on),('recorder-play',make_play),('recorder-cut',make_cut)):
        x=fn();wavfile.write(f'{out}/{name}.wav',SR,x);print(name,len(x)/SR,'s')
