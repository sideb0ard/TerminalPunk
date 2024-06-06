import {
  BOT_DISPLAY_HEIGHT,
} from '../bot.js'

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

const SYNTH_OUTLINE_STROKE = 3;
const SYNTH_MARGIN = 5;

const SYNTH_HIGHLIGHT_COLOR = 'Lime'
const SYNTH_TEXT_COLOR = 'Chartreuse';
const SYNTH_ALT_COLOR = 'LawnGreen';

function CheckPointInsideArea(px, py, area_x, area_y, area_width, area_height) {
  if ((px >= area_x && px <= area_x + area_width) &&
    (py >= area_y && py <= area_y + area_height)) {
    return true;
  }
  return false;
}

class SynthEngine {
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
    //osc.disconnect(time + 0.7);

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

const buttonCurve = 10;

class Button {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
  Draw(p5) {
    p5.rect(this.x, this.y, this.w, this.h, buttonCurve)
  }
}

class Panel {
  constructor(num_knobs) {
    this.num_knobs = num_knobs;
    this.knobs = [];
    for (let i = 0; i < this.num_knobs; i++) {
      this.knobs.push(new Knob());
    }
  }
  Draw(p5, x, y, knob_width, knob_height) {
    let knob_diameter = Math.min(knob_width, knob_height);
    let knob_radius = knob_diameter / 2;
    for (let i = 0; i < this.num_knobs; i++) {
      this.knobs[i].Draw(p5, x + knob_radius + i * knob_width, y + knob_radius, knob_radius - SYNTH_MARGIN * 2);
    }
  }
}

class Knob {
  constructor() {
    this.angle = 0;
    this.offset_angle = 0;
    this.dragging = false;
  }

  Draw(p5, x, y, r) {
    if (this.dragging) {
      let dx = p5.mouseX - x;
      let dy = p5.mouseY - y;
      let mouse_angle = p5.atan2(dy, dx);
      this.angle = mouse_angle - this.offset_angle;
    }

    //console.log("KNOBDRAW! x:", x, " y:", y, "r:", r);

    p5.fill(0);
    p5.push();
    p5.strokeWeight(2);
    p5.translate(x, y);
    p5.rotate(this.angle);
    p5.circle(0, 0, r * 2);
    p5.line(0, 0, r, 0);
    p5.pop();
  }
}

const lookahead = 25.0; // How frequently to call scheduling function (in milliseconds)
const schedule_ahead_time = 0.1; // How far ahead to schedule audio (sec)

export class PunkSynth {
  constructor(p5) {
    this.p5 = p5;
    this.synth = new SynthEngine(p5);

    this.start_button_x = 0;
    this.start_button_y = 0;
    this.start_button_width = 100;
    this.start_button_height = 30;

    this.stop_button_x = 0;
    this.stop_button_y = 0;
    this.stop_button_width = 100;
    this.stop_button_height = 30;

    this.adsr_panel = new Panel(4);
    this.lfo_panel = new Panel(2);
    this.filter_panel = new Panel(2);
    this.panels = [this.adsr_panel, this.lfo_panel, this.filter_panel];
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

  MousePressed() {
    if (CheckPointInsideArea(this.p5.mouseX, this.p5.mouseY, this.start_button_x, this.start_button_y, this.start_button_width, this.start_button_height)) {
      this.StartLoop();
    } else if (CheckPointInsideArea(this.p5.mouseX, this.p5.mouseY, this.stop_button_x, this.stop_button_y, this.stop_button_width, this.stop_button_height)) {
      this.StopLoop();
    }
  }

  Display() {
    // outer box
    let display_height = this.p5.windowHeight - BOT_DISPLAY_HEIGHT - (SYNTH_MARGIN * 2);
    let display_width = this.p5.windowWidth - (SYNTH_MARGIN * 2);
    let outer_x = SYNTH_MARGIN;
    let outer_y = BOT_DISPLAY_HEIGHT + SYNTH_MARGIN;
    this.p5.stroke(SYNTH_HIGHLIGHT_COLOR);
    this.p5.strokeWeight(SYNTH_OUTLINE_STROKE);
    this.p5.noFill();
    this.p5.rect(outer_x, outer_y, display_width, display_height, 20);

    // top section inner box
    let top_height = display_height / 2 - (SYNTH_MARGIN * 2);
    let top_width = display_width - (SYNTH_MARGIN * 2);
    let top_x = outer_x + SYNTH_MARGIN;
    let top_y = outer_y + SYNTH_MARGIN;
    this.p5.stroke(SYNTH_ALT_COLOR);
    this.p5.strokeWeight(1);
    this.p5.rect(top_x, top_y, top_width, top_height, 20);


    // bottom section inner box
    let bottom_height = top_height; // both sections are equal size
    let bottom_width = top_width;
    let bottom_x = top_x;
    let bottom_y = top_y + top_height;
    this.p5.stroke(SYNTH_ALT_COLOR);
    this.p5.strokeWeight(1);
    this.p5.rect(bottom_x, bottom_y, bottom_width, bottom_height, 20);

    this.start_button_x = top_x + SYNTH_MARGIN;
    this.start_button_y = top_y + SYNTH_MARGIN;
    this.p5.stroke('white');
    this.p5.fill('red');
    this.p5.rect(this.start_button_x, this.start_button_y, this.start_button_width, this.start_button_height, 2);
    this.p5.fill('white');
    this.p5.textSize(23);
    this.p5.text('START', this.start_button_x + 5, this.start_button_y + 23);

    this.stop_button_x = top_x + SYNTH_MARGIN;
    this.stop_button_y = this.start_button_y + this.start_button_height + SYNTH_MARGIN;
    this.p5.stroke('white');
    this.p5.fill('OliveDrab');
    this.p5.rect(this.stop_button_x, this.stop_button_y, this.stop_button_width, this.stop_button_height, 2);
    this.p5.fill('white');
    this.p5.textSize(23);
    this.p5.text('STOP', this.stop_button_x + 15, this.stop_button_y + 23);

    let all_panels_width = top_width - this.start_button_width - SYNTH_MARGIN * 4;
    let num_knobs = 0;
    this.panels.forEach((el) => num_knobs += el.num_knobs);

    let knob_width = all_panels_width / num_knobs;

    let kx = this.start_button_x + this.start_button_width + SYNTH_MARGIN;
    let ky = this.start_button_y + SYNTH_MARGIN;
    this.panels.forEach((p) => {
      p.Draw(this.p5, kx, ky, knob_width, top_height);
      kx += p.num_knobs * knob_width;
    });
  }
}
