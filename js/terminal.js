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

function display_history() {
  textFont("monospace", 25);
  fill(cursor_color);;
  textSize(32);
  text(">", 0, current_line * line_height);
  for (let i = 0; i < line_buffer.length; ++i) {
    text(line_buffer[i], margin + i * key_width, current_line * line_height);
  }
}

function display_line(line) {
  textFont("monospace", 25);
  fill(cursor_color);;
  textSize(32);
  let pos_y = current_line * line_height;
  text(">", 0, pos_y);

  for (let i = 0; i < line_buffer.length; ++i) {
    let pos_x = margin + i * key_width;
    text(line[i], pos_x, pos_y);
  }
  cursor.display(margin + line_buffer.length * key_width, pos_y);
}
