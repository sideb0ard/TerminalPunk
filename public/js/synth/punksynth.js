let vibrato_amount = 0.5;
let vibrato_speed = 70;

export class PunkSynth {
  constructor(p5) {
    console.log("YO PYUNK SYNTH!", p5);
    this.p5 = p5;

    this.text = "TEST TEXT";

    this.audio_context = p5.getAudioContext();
    this.master_volume = this.audio_context.createGain();
    this.master_volume.connect(this.audio_context.destination);
    this.master_volume.gain.setValueAtTime(0.2, 0);

    console.log("PUNK SYNTH CREATED!", this.p5);
    //this.oscillator;
  }

  NoteOn() {
    if (this.audio_context.state === "suspended") {
      this.audio_context.resume();
    }
    console.log("START");
    const context = this.audio_context;

    const osc = context.createOscillator();
    const note_gain = context.createGain();
    const lfo = context.createOscillator();
    const lfo_gain = context.createGain();

    note_gain.gain.setValueAtTime(0, 0);
    note_gain.gain.linearRampToValueAtTime(0.8, context.currentTime + 0.3);
    note_gain.gain.setValueAtTime(0.8, context.currentTime + 1 - 0.3);
    note_gain.gain.linearRampToValueAtTime(0, context.currentTime + 1);

    lfo.frequency.setValueAtTime(vibrato_speed, 0);
    lfo.connect(lfo_gain);
    lfo.start(0);
    lfo.stop(context.currentTime + 1);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, 0);
    osc.start(0);
    osc.stop(context.currentTime + 1);
    osc.connect(note_gain);

    note_gain.connect(this.master_volume);

  }
}



export class DspController {
  constructor(p5, synth) {
    this.p5 = p5;
    this.synth = synth;
    this.play_button = this.p5.createButton('Play');

    this.play_button.mousePressed(() => this.synth.NoteOn());
  }

  Display() {
    this.play_button.position(10, 150);
  }
}
