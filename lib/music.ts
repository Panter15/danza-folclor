import * as Tone from "tone";
import { sections } from "@/content/site";

// Original soundtrack generated in the browser, in the style of the caimán
// cienaguero (not a copy of any recording): llamador on the offbeat, guache,
// palmas, tambor alegre and a gaita-like voice. It is written as a song, a
// 16-bar cycle (melody, drum break, melody again) over a steady groove, and the
// mix follows the section on screen.
// shortcut: the melody is an original stand-in; swap `melody` for the real one
// once the group's musicians provide it.

type Layer = "llamador" | "guache" | "palmas" | "alegre" | "gaita";
type Hit = [step: number, high: boolean, velocity: number];
type Note = [step: number, note: string, steps: number];

// Level of each layer per section (missing = silent). Drums build as you scroll;
// the melody is there from the start so the tune is recognisable.
const mixes: Record<string, Partial<Record<Layer, number>>> = {
  // The reference is drum-driven with little melody, so the drums lead and the gaita stays light.
  top: { llamador: 0.8, guache: 0.6, alegre: 0.6, gaita: 0.4 },
  historia: { llamador: 1, guache: 0.8, palmas: 0.6, alegre: 0.8, gaita: 0.4 },
  presentaciones: { llamador: 1, guache: 1, palmas: 0.5, alegre: 1, gaita: 0.5 },
  giras: { llamador: 1, guache: 1, palmas: 0.6, alegre: 1, gaita: 0.6 },
  trayectoria: { llamador: 0.7, guache: 0.6, alegre: 0.6, gaita: 0.5 },
  contacto: { llamador: 1, guache: 1, palmas: 0.7, alegre: 1, gaita: 0.6 },
};

// Groove measured from a reference recording of the song (onset strength folded onto
// the beat grid): low drum on every beat plus a pickup on the last 16th of each
// pair of beats, lighter high strokes just after the beat. Then a variation closing
// each 4-bar phrase and a fill before the cycle restarts.
const groove: Hit[] = [
  [0, false, 0.9], [1, true, 0.45], [4, false, 0.9], [5, true, 0.45], [7, false, 0.6],
  [8, false, 0.9], [9, true, 0.45], [12, false, 0.9], [13, true, 0.45], [15, false, 0.6],
];
const phraseEnd: Hit[] = [
  [0, false, 0.9], [1, true, 0.45], [4, false, 0.9], [5, true, 0.45], [7, false, 0.6],
  [8, false, 0.9], [10, true, 0.6], [11, true, 0.6], [12, false, 0.9], [14, true, 0.7], [15, true, 0.8],
];
const fill: Hit[] = [0, 2, 4, 6, 8, 9, 10, 11, 12, 13, 14, 15].map((s, i) => [s, i % 3 !== 0, 0.5 + s / 32]);

// 8-bar gaita tune in steps from the start of the cycle: call (bars 1–2),
// answer (3–4), a higher second phrase (5–6) and the way home (7–8).
const melody: Note[] = [
  [0, "E5", 4], [4, "D5", 2], [6, "C5", 2], [8, "A4", 6],
  [16, "C5", 2], [18, "D5", 2], [20, "E5", 4], [24, "G5", 4], [28, "E5", 4],
  [32, "D5", 4], [36, "C5", 2], [38, "A4", 2], [40, "G4", 6],
  [48, "A4", 2], [50, "C5", 2], [52, "A4", 12],
  [64, "A5", 4], [68, "G5", 2], [70, "E5", 2], [72, "G5", 4], [76, "A5", 4],
  [80, "G5", 2], [82, "E5", 2], [84, "D5", 4], [88, "E5", 8],
  [96, "C5", 2], [98, "D5", 2], [100, "E5", 4], [104, "D5", 2], [106, "C5", 2], [108, "A4", 4],
  [112, "G4", 4], [116, "A4", 12],
];
// The cycle: tune (bars 0–7), drums only (8–11), call and answer again (12–15).
const tune = new Map(melody.map(([s, note, len]) => [s, [note, len] as const]));
const reprise = new Map(melody.filter(([s]) => s < 64).map(([s, note, len]) => [s + 192, [note, len] as const]));

const humanize = () => Math.random() * 0.01; // a few ms, so it feels played, not quantised

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

  const sixteenth = Tone.Time("16n").toSeconds();
  // Guache accents as measured: strong on the beat, medium on the offbeat, light in between.
  const guacheVelocity = [0.6, 0.12, 0.27, 0.08];

  let n = 0;
  new Tone.Loop((time) => {
    const step = n % 16;
    const bar = Math.floor(n / 16) % 16;
    const cycleStep = n % 256;
    const pattern = bar === 15 ? fill : bar % 4 === 3 ? phraseEnd : groove;

    // Drums tuned to E, G# and B, the E major colour the reference's drums ring in.
    if (step % 4 === 2) llamador.triggerAttackRelease("B2", "16n", time + humanize(), 0.8);
    guache.triggerAttackRelease("32n", time + humanize(), guacheVelocity[step % 4]);
    if (step === 4 || step === 12) palmas.triggerAttackRelease("32n", time + humanize(), 0.7);
    for (const [s, high, v] of pattern) {
      if (s === step) alegre.triggerAttackRelease(high ? "G#2" : "E2", "16n", time + humanize(), v);
    }
    const note = tune.get(cycleStep) ?? reprise.get(cycleStep);
    // The tune is written in C/A pentatonic; +4 semitones puts it in E major with the drums.
    if (note) gaita.triggerAttackRelease(Tone.Frequency(note[0]).transpose(4).toNote(), note[1] * sixteenth * 0.92, time);
    n++;
  }, "16n").start(0);
  Tone.getTransport().bpm.value = 144; // measured from the reference recording

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
