let terminal_width_in_chars = 60;
let margin = 30;

let current_line = 1;
let line_height = 40;
let font_size = 28;
let text_width = 20;

let cursor_x = 0;

let cursor_blink_on_time = 40;
let cursor_blink_off_time = 20;

const screen_entry_user_type = 0;
const screen_entry_computer_type = 1;

let screen_history = [];
let history = [];
let history_idx = 0;

let line_buffer = [];
let line_buffer_temp = [];

class HistoryEntry {
  constructor(type, content) {
    this.type = type;
    this.content = content;
  }
}

class Cursor {
  constructor() {
    this.cntr = 0;
    this.is_blinking = 1;
    this.next_state_change = cursor_blink_on_time;
  }
  display(x, y) {
    if (this.is_blinking) {
      fill(cursor_color);;
      rect(x, y, text_width, 10);
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
  let history_lines_to_display = Math.min(screen_history.length,
    Math.floor(height / line_height) - 1);

  let start_idx = 0;
  if (screen_history.length > history_lines_to_display) {
    start_idx = screen_history.length - history_lines_to_display;
  }

  display_screen_history(start_idx, screen_history);

  let current_line_num = history_lines_to_display + 1;
  if (computer.is_computing) {
    computer.DisplayResponse(current_line_num);
  } else {
    display_line(screen_entry_user_type, line_buffer, current_line_num);
    cursor.display(margin + line_buffer.length * text_width, current_line_num * line_height);
  }
}

function display_screen_history(start_idx, history) {
  let line_num = 1;
  for (let i = start_idx; i < history.length; i++) {
    display_line(history[i].type, history[i].content, line_num++);
  }
}

function display_line(type, line, line_num) {
  textFont("monospace", font_size);
  fill(cursor_color);;
  let pos_y = line_num * line_height;
  let pos_x_start = 0;
  if (type === 0) {
    text(">", 0, pos_y);
    pos_x_start = margin;
  }

  for (let i = 0; i < line.length; ++i) {
    let pos_x = pos_x_start + i * text_width;
    text(line[i], pos_x, pos_y);
  }
}
