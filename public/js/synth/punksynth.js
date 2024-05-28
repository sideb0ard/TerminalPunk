let vibrato_amount = 0.5;
let vibrato_speed = 70;

export class PunkSynth {
  constructor(p5) {
    console.log("YO PYUNK SYNTH!", p5);
    this.p5 = p5;

    this.pulse_time = 0.5;
    console.log("PUNK SYNTH CREATED!", this.p5);
  }

  NoteOn(freq, time) {
    const context = this.p5.getAudioContext();
    if (context.state === "suspended") {
      context.resume();
    }

    const osc = new OscillatorNode(context, {
      type: "square",
      frequency: freq,
    });

    const att_rel = new GainNode(context);
    att_rel.gain.cancelScheduledValues(time);
    att_rel.gain.setValueAtTime(0, time);
    att_rel.gain.linearRampToValueAtTime(0.5, time + 0.2);
    att_rel.gain.linearRampToValueAtTime(0, time + this.pulse_time - 0.2);

    //const amp = new GainNode(context, {
    //  value: 1,
    //});

    // const lfo = new OscillatorNode(context, {
    //   type: "sine",
    //   frequency: 10,
    // });

    //lfo.connect(amp.gain);
    osc.connect(att_rel); // .connect(context.destination);
    att_rel.connect(context.destination);
    //osc.frequency.setTargetAtTime(freq + 200, time, time + 0.2);
    //lfo.start();
    osc.start(time);
    osc.stop(time + this.pulse_time);
  }

  Lazer() {
    const context = this.p5.getAudioContext();
    if (context.state === "suspended") {
      context.resume();
    }
    let time = context.currentTime;

    const osc = new OscillatorNode(context, {
      type: "square",
      frequency: 500,
    });

    const att_rel = new GainNode(context);
    att_rel.gain.cancelScheduledValues(time);
    att_rel.gain.setValueAtTime(0, time);
    att_rel.gain.linearRampToValueAtTime(0.5, time + 0.4);
    att_rel.gain.linearRampToValueAtTime(0, time + this.pulse_time - 0.4);

    osc.connect(att_rel);
    att_rel.connect(context.destination);
    osc.frequency.setTargetAtTime(200, time, time + 0.3);
    osc.start(time);
    osc.stop(time + this.pulse_time);

  }
}


const lookahead = 25.0; // How frequently to call scheduling function (in milliseconds)
const schedule_ahead_time = 0.1; // How far ahead to schedule audio (sec)

export class StepSequencer {
  constructor(p5, synth) {
    this.p5 = p5;
    this.synth = synth;
    this.play_button = this.p5.createButton('Play');
    //this.play_button.position(10, 150);
    this.play_button.mousePressed(() => this.StartLoop());
    this.stop_button = this.p5.createButton('Stop');
    //this.stop_button.position(100, 150);
    this.stop_button.mousePressed(() => this.StopLoop());
    this.melody1 = [138.591, 146.832, 164.814, 184.997, 146.832, 184.997, 0, 174.614, 138.591, 174.614, 0, 164.814, 130.813, 164.814, 0, 123.471];
    this.melody2 = [138.591, 146.832, 164.814, 184.997, 146.832, 184.997, 246.942, 220, 184.997, 146.832, 184.997, 220, 0, 0, 0, 123.471];
    this.melodies = [this.melody1, this.melody2];
    this.mx = 0;

    this.tempo = 300.0;
    this.current_step = 0;
    this.next_step_time = 0.0;
    this.notes_in_the_queue = [];

    this.timer_id = 0;
  }

  NextStep() {
    const seconds_per_beat = 60.0 / this.tempo;
    this.next_step_time += seconds_per_beat;
    let melody = this.melodies[this.mx];
    this.current_step = (this.current_step + 1) % melody.length;
    if (this.current_step === 0) {
      this.mx = (this.mx + 1) % this.melodies.length;
    }
  }

  ScheduleStep(step_number, time) {
    let melody = this.melodies[this.mx];
    if (melody[step_number]) {
      this.synth.NoteOn(melody[step_number], time);
    }
  }

  Scheduler() {
    let context = this.p5.getAudioContext();
    while (this.next_step_time < context.currentTime + schedule_ahead_time) {
      this.ScheduleStep(this.current_step, this.next_step_time);
      this.NextStep();
    }
    this.time_id = setTimeout(this.Scheduler.bind(this), lookahead);
  }

  StartLoop() {
    let context = this.p5.getAudioContext();
    this.current_step = 0;
    this.next_step_time = context.currentTime;
    this.Scheduler();
  }

  StopLoop() {
    clearTimeout(this.time_id);
  }

  Display() {}
}
