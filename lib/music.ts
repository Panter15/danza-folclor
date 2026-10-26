import * as Tone from "tone";
import { sections } from "@/content/site";

// Original soundtrack generated in the browser, inspired by the caimán cienaguero:
// llamador on the offbeat, guache, palmas, an improvising tambor alegre and a
// gaita-like voice. Drum patterns and melodies are re-chosen while it plays and the
// mix follows the section on screen, so it keeps changing instead of looping.

type Layer = "llamador" | "guache" | "palmas" | "alegre" | "gaita";
type Hit = [step: number, high: boolean, velocity: number];

// Level of each layer per section (missing = silent). The music builds as you scroll.
const mixes: Record<string, Partial<Record<Layer, number>>> = {
  top: { llamador: 0.8, guache: 0.5 },
  historia: { llamador: 1, guache: 0.7, palmas: 0.6 },
  presentaciones: { llamador: 1, guache: 1, palmas: 0.4, alegre: 1 },
  giras: { llamador: 1, guache: 1, palmas: 0.5, alegre: 1, gaita: 1 },
  trayectoria: { llamador: 0.7, guache: 0.6, alegre: 0.5, gaita: 0.6 },
  contacto: { llamador: 1, guache: 1, palmas: 0.7, alegre: 1, gaita: 1 },
};

// Tambor alegre phrases over one bar of 16 steps; a fill closes every 8th bar.
const alegrePatterns: Hit[][] = [
  [[0, false, 0.9], [3, true, 0.6], [6, false, 0.7], [8, false, 0.9], [11, true, 0.6], [14, false, 0.7]],
  [[0, false, 0.9], [2, true, 0.5], [4, false, 0.6], [7, true, 0.7], [8, false, 0.9], [12, false, 0.6], [15, true, 0.6]],
  [[0, false, 0.9], [6, true, 0.7], [8, false, 0.8], [10, true, 0.5], [11, true, 0.6], [14, false, 0.7]],
  [[0, false, 0.8], [4, true, 0.5], [8, false, 0.9], [9, true, 0.5], [12, true, 0.7], [14, true, 0.5]],
];
const alegreFill: Hit[] = [0, 2, 4, 6, 8, 9, 10, 11, 12, 13, 14, 15].map((s, i) => [s, i % 3 !== 0, 0.5 + s / 32]);

const scale = ["E4", "G4", "A4", "B4", "D5", "E5", "G5", "A5"];
const restingNotes = [2, 5]; // phrases end on A4 or E5

const rand = (n: number) => Math.floor(Math.random() * n);
const humanize = () => Math.random() * 0.012;

let master: Tone.Volume | undefined;
let gains: Record<Layer, Tone.Gain>;
let playing = false;
let pauseTimer: number | undefined;

function setMix(id: string) {
  const mix = mixes[id];
  if (!mix) return;
  for (const layer of Object.keys(gains) as Layer[]) gains[layer].gain.rampTo(mix[layer] ?? 0, 2.5);
}

function build() {
  master = new Tone.Volume(-60).toDestination();
  const room = new Tone.Reverb({ decay: 2.2, wet: 0.18 }).connect(master);
  const gain = () => new Tone.Gain(0).connect(room);
  gains = { llamador: gain(), guache: gain(), palmas: gain(), alegre: gain(), gaita: gain() };

  const llamador = new Tone.MembraneSynth({
    pitchDecay: 0.02,
    octaves: 2,
    envelope: { attack: 0.001, decay: 0.12, sustain: 0, release: 0.05 },
  }).connect(gains.llamador);
  const alegre = new Tone.MembraneSynth({
    pitchDecay: 0.03,
    octaves: 3,
    envelope: { attack: 0.001, decay: 0.25, sustain: 0, release: 0.1 },
  }).connect(gains.alegre);
  const guache = new Tone.NoiseSynth({
    noise: { type: "white" },
    envelope: { attack: 0.002, decay: 0.05, sustain: 0, release: 0.02 },
  }).connect(new Tone.Filter(6000, "highpass").connect(gains.guache));
  const palmas = new Tone.NoiseSynth({
    noise: { type: "pink" },
    envelope: { attack: 0.001, decay: 0.09, sustain: 0, release: 0.03 },
  }).connect(new Tone.Filter(1400, "bandpass").connect(gains.palmas));
  const gaita = new Tone.Synth({
    portamento: 0.03,
    oscillator: { type: "triangle" },
    envelope: { attack: 0.04, decay: 0.1, sustain: 0.7, release: 0.3 },
  }).connect(new Tone.Vibrato(5.5, 0.08).connect(gains.gaita));
  gaita.volume.value = -6;

  // Gaita notes waiting to be played, keyed by absolute 16th step.
  const gaitaQueue = new Map<number, [note: string, seconds: number]>();
  const sixteenth = Tone.Time("16n").toSeconds();

  // A short melodic walk through the scale that comes to rest on A or E.
  function queueGaitaPhrase(from: number) {
    let idx = 1 + rand(scale.length - 2);
    let step = from;
    const count = 3 + rand(4);
    for (let i = 0; i < count; i++) {
      const last = i === count - 1;
      if (last) idx = restingNotes[rand(restingNotes.length)];
      const len = last ? 8 : [2, 2, 4, 6][rand(4)];
      gaitaQueue.set(step, [scale[idx], len * sixteenth * 0.9]);
      idx = Math.min(scale.length - 1, Math.max(0, idx + [-2, -1, -1, 1, 1, 2][rand(6)]));
      step += len;
    }
  }

  let n = 0;
  let pattern = alegrePatterns[0];
  new Tone.Loop((time) => {
    const step = n % 16;
    const bar = Math.floor(n / 16);
    if (step === 0) {
      pattern = bar % 8 === 7 ? alegreFill : alegrePatterns[rand(alegrePatterns.length)];
      if (bar % 2 === 0 && gaitaQueue.size === 0 && Math.random() < 0.55) queueGaitaPhrase(n + 4 * rand(2));
    }
    if (step % 4 === 2) llamador.triggerAttackRelease("B2", "16n", time + humanize(), 0.8);
    if (Math.random() > 0.08) {
      guache.triggerAttackRelease("32n", time + humanize(), step % 4 === 0 ? 0.6 : 0.25 + Math.random() * 0.2);
    }
    if (step === 4 || step === 12) palmas.triggerAttackRelease("32n", time + humanize(), 0.7);
    for (const [s, high, v] of pattern) {
      if (s === step) alegre.triggerAttackRelease(high ? "D3" : "G2", "16n", time + humanize(), v * (0.8 + Math.random() * 0.2));
    }
    const note = gaitaQueue.get(n);
    if (note) {
      gaita.triggerAttackRelease(note[0], note[1], time);
      gaitaQueue.delete(n);
    }
    n++;
  }, "16n").start(0);
  Tone.getTransport().bpm.value = 96;

  // Follow the section in the middle of the screen.
  const observer = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && setMix(e.target.id)),
    { rootMargin: "-50% 0px -50% 0px" },
  );
  for (const { id } of sections) {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  }

  // Silence while the tab is in the background.
  document.addEventListener("visibilitychange", () => {
    const ctx = Tone.getContext().rawContext as AudioContext;
    if (document.hidden) ctx.suspend();
    else if (playing) ctx.resume();
  });
}

export async function startMusic() {
  await Tone.start();
  if (!master) build();
  window.clearTimeout(pauseTimer);
  playing = true;
  master!.volume.rampTo(-14, 2);
  if (Tone.getTransport().state !== "started") Tone.getTransport().start();
}

export function stopMusic() {
  playing = false;
  master?.volume.rampTo(-60, 1.2);
  pauseTimer = window.setTimeout(() => Tone.getTransport().pause(), 1300);
}
