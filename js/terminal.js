class Cursor {
  constructor() {
    this.cntr = 0;
    this.is_blinking = 1;
    this.next_state_change = cursor_blink_on_time;
  }
  display(x, y) {
    if (this.is_blinking) {
      fill(cursor_color);;
      rect(x, y, key_width, 10);
    }
    this.cntr++;
    if (this.cntr == this.next_state_change) {
      if (this.is_blinking) {
        this.next_state_change = this.cntr + cursor_blink_off_time;
      } else {
        this.next_state_change = this.cntr + cursor_blink_on_time;
      }
      this.is_blinking = 1 - this.is_blinking;
    }
  }
}

function refresh_display() {
  display_history(history);
  let line_buffer_line_num = history.length + 1;
  display_line(line_buffer, line_buffer_line_num);
  cursor.display(margin + line_buffer.length * key_width, line_buffer_line_num * line_height);
}

function display_history(history) {
  for (let i = 0; i < history.length; i++) {
    display_line(history[i], i + 1);
  }
}

function display_line(line, line_num) {
  textFont("monospace", 25);
  fill(cursor_color);;
  textSize(32);
  let pos_y = line_num * line_height;
  text(">", 0, pos_y);

  for (let i = 0; i < line.length; ++i) {
    let pos_x = margin + i * key_width;
    text(line[i], pos_x, pos_y);
  }
}
