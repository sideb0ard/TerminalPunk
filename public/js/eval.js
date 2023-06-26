// const intro = "Your eyes open... your mind expodes with input - you find yourself inhabiting a humanoid cybernetic body, standing in a rowdy bar, the music a throbbing bass pulse, rattling your metallic core. The elephant headed barman asks what your having...";
const your_name = "Iron Dollar Adamson";
const intro = "Your name is " + your_name;

class Computer {
  constructor() {
    this.is_computing = true;
    this.input_line = "";
    this.response_line = intro;
    this.response_idx = 0;
    this.next_frame_incr = 0;
  }

  DisplayResponse(line_num) {
    if (frameCount > this.next_frame_incr) {
      this.response_idx++;
      if (this.response_idx >= this.response_line.length) {
        this.is_computing = false;

        screen_history.push(new HistoryEntry(1, this.response_line));
        history_idx = history.length;
      }
      this.next_frame_incr = frameCount + random(13);

    }

    textFont("monospace", font_size);
    fill(cursor_color);;
    let pos_y = line_num * line_height;
    let pos_x_start = 0;

    for (let i = 0; i < this.response_idx; ++i) {
      let pos_x = pos_x_start + i * text_width;
      text(this.response_line[i], pos_x, pos_y);
    }
  }

  Eval(input_line) {
    this.input_line = input_line.slice();
    screen_history.push(new HistoryEntry(0, this.input_line));
    if (this.input_line.length > 0) {
      history.push(this.input_line);
      this.is_computing = true;
      this.response_line = "how may i help?";
      this.response_idx = 0;
    }
  }
}
