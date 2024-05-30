let vibrato_amount = 0.5;
let vibrato_speed = 70;

//Pre-calculate the WaveShaper curves so that we can reuse them.
let pulseCurve = new Float32Array(256);
for (var i = 0; i < 128; i++) {
  pulseCurve[i] = -1;
  pulseCurve[i + 128] = 1;
}
let constantOneCurve = new Float32Array(2);
constantOneCurve[0] = 1;
constantOneCurve[1] = 1;

export class PunkSynth {
  constructor(p5) {
    console.log("YO PYUNK SYNTH!", p5);
    this.p5 = p5;

    this.amp_gain = 0.4;
    this.amp_sustain = 0.7;
    this.amp_sustain_time = 0;
    this.amp_attack = 0.1;
    this.amp_release = 0.1;

    // https://github.com/pendragon-andyh/WebAudio-PulseOscillator/blob/master/example-synth.html#L207
    const context = this.p5.getAudioContext();
    context.createPulseOscillator = function() {

      let node = this.createOscillator();
      node.type = "sawtooth";

      let pulse_shaper = context.createWaveShaper();
      pulse_shaper.curve = pulseCurve;
      node.connect(pulse_shaper);

      let width_gain = context.createGain();
      width_gain.gain.value = 0;
      node.width = width_gain.gain;
      width_gain.connect(pulse_shaper);

      let constant_one_shaper = this.createWaveShaper();
      constant_one_shaper.curve = constantOneCurve;
      node.connect(constant_one_shaper);
      constant_one_shaper.connect(width_gain);

      node.connect = function() {
        pulse_shaper.connect.apply(pulse_shaper, arguments);
        return node;
      }

      node.disconnect = function() {
        pulse_shaper.disconnect.apply(pulse_shaper, arguments);
        return node;
      }

      return node;
    }

    this.pulse_time = 0.5;
    console.log("PUNK SYNTH CREATED!", this.p5);
  }

  CreateNote(freq) {
    console.log("CREATENOtE");
    const context = this.p5.getAudioContext();
    const amp = context.createGain();
    amp.gain.value = 0;
    amp.connect(context.destination);

    const osc = context.createPulseOscillator();
    osc.frequency.value = freq;
    osc.connect(amp);

    console.log("OSC:", osc);

    const amp_gain = this.amp_gain;
    const amp_attack = this.amp_attack;
    const amp_release = this.amp_release;
    let amp_sustain_time = this.amp_sustain_time;
    const amp_sustain = this.amp_sustain;

    return {
      start: function(startTime) {
        console.log("NOTEON THIS", this);
        startTime = startTime || context.currenTime;
        osc.start(startTime);
        //lfo.start(startTime);
        amp_sustain_time = startTime + amp_attack + amp_release;
        console.log("VALZ:", amp_sustain_time, amp_attack, amp_release);
        amp.gain.linearRampToValueAtTime(amp_gain, startTime + amp_attack);
        amp.gain.linearRampToValueAtTime(amp_gain * amp_sustain, amp_sustain_time);
      },
      stop: function(releaseTime) {
        console.log("NOTEOFFFF");
        releaseTime = releaseTime || context.currentTime;

        let stopTime = Math.max(releaseTime, amp_sustain_time) + amp_release;
        osc.stop(stopTime);

      }
    }
  }

  NoteOn(freq, time) {
    console.log("NOTON", time);
    const context = this.p5.getAudioContext();
    if (context.state === "suspended") {
      context.resume();
    }

    let osc = this.CreateNote(freq);
    osc.start(time);
    osc.stop(time + 0.5);

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
    this.play_button.position(10, 150);
    this.play_button.mousePressed(() => this.StartLoop());
    this.stop_button = this.p5.createButton('Stop');
    this.stop_button.position(100, 150);
    this.stop_button.mousePressed(() => this.StopLoop());
    this.Hide();
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

  Display() {
    if (!this.started) {
      this.stop_button.show();
      this.play_button.show();
      this.started = true;
    }
  }
  Hide() {
    this.stop_button.hide();
    this.play_button.hide();
    this.started = false;
  }
}
