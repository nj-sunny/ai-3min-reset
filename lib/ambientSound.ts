let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let nodes: (OscillatorNode | AudioBufferSourceNode)[] = [];
let breathLfo: OscillatorNode | null = null;

function createNoiseBuffer(context: AudioContext): AudioBuffer {
  const bufferSize = context.sampleRate * 2;
  const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
  const data = buffer.getChannelData(0);
  let lastOut = 0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    // brown-ish noise via simple integration, kept soft
    lastOut = (lastOut + 0.02 * white) / 1.02;
    data[i] = lastOut * 3.5;
  }
  return buffer;
}

export function startAmbientSound() {
  if (ctx) return; // already running
  const AudioContextCtor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  ctx = new AudioContextCtor();

  masterGain = ctx.createGain();
  masterGain.gain.value = 0;
  masterGain.connect(ctx.destination);
  masterGain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 2);

  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 800;
  filter.connect(masterGain);

  // soft pad chord
  const freqs = [196, 246.94, 293.66]; // G3, B3, D4 - warm major chord
  nodes = freqs.map((freq) => {
    const osc = ctx!.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;
    const gain = ctx!.createGain();
    gain.gain.value = 0.33;
    osc.connect(gain);
    gain.connect(filter);
    osc.start();
    return osc;
  });

  // gentle breathing swell on the filter cutoff, ~4s in / 6s out cycle
  breathLfo = ctx.createOscillator();
  breathLfo.type = "sine";
  breathLfo.frequency.value = 1 / 10;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 250;
  breathLfo.connect(lfoGain);
  lfoGain.connect(filter.frequency);
  breathLfo.start();

  // soft air texture
  const noise = ctx.createBufferSource();
  noise.buffer = createNoiseBuffer(ctx);
  noise.loop = true;
  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = "bandpass";
  noiseFilter.frequency.value = 600;
  const noiseGain = ctx.createGain();
  noiseGain.gain.value = 0.05;
  noise.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(masterGain);
  noise.start();
  nodes.push(noise);
}

export function stopAmbientSound() {
  if (!ctx || !masterGain) return;
  const context = ctx;
  const gain = masterGain;
  gain.gain.linearRampToValueAtTime(0, context.currentTime + 0.8);
  setTimeout(() => {
    nodes.forEach((n) => {
      try {
        n.stop();
      } catch {
        // already stopped
      }
    });
    breathLfo?.stop();
    context.close();
  }, 900);
  ctx = null;
  masterGain = null;
  nodes = [];
  breathLfo = null;
}

export function isAmbientSoundRunning(): boolean {
  return ctx !== null;
}

export function suspendAmbientSound() {
  if (ctx && ctx.state === "running") ctx.suspend();
}

export function resumeAmbientSound() {
  if (ctx && ctx.state === "suspended") ctx.resume();
}
