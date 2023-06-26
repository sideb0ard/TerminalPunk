let terminalWidthInChars = 60;
const MARGIN = 30;

let currentLine = 1;
let lineHeight = 40;
let fontSize = 28;
let textWidth = 20;

let cursorX = 0;

let cursorBlinkOnTime = 40;
let cursorBlinkOffTime = 20;

const SCREEN_ENTRY_USER_TYPE = 0;
const SCREEN_ENTRY_COMPUTER_TYPE = 1;

let screenHistory = [];
let history = [];
let historyIdx = 0;

let lineBuffer = [];
let lineBufferTemp = [];

class HistoryEntry {
  constructor(type, content) {
    this.type = type;
    this.content = content;
  }
}

class Cursor {
  constructor() {
    this.cntr = 0;
    this.isBlinking = 1;
    this.nextStateChange = cursorBlinkOnTime;
  }
  display(x, y) {
    if (this.isBlinking) {
      fill(cursorColor);;
      rect(x, y, textWidth, 10);
    }
    this.cntr++;
    if (this.cntr == this.nextStateChange) {
      if (this.isBlinking) {
        this.nextStateChange = this.cntr + cursorBlinkOffTime;
      } else {
        this.nextStateChange = this.cntr + cursorBlinkOnTime;
      }
      this.isBlinking = 1 - this.isBlinking;
    }
  }
}

function refreshDisplay() {
  let historyLinesToDisplay = Math.min(screenHistory.length,
    Math.floor(height / lineHeight) - 1);

  let startIdx = 0;
  if (screenHistory.length > historyLinesToDisplay) {
    startIdx = screenHistory.length - historyLinesToDisplay;
  }

  displayScreenHistory(startIdx, screenHistory);

  let currentLineNum = historyLinesToDisplay + 1;
  if (computer.isComputing) {
    computer.displayResponse(currentLineNum);
  } else {
    displayLine(SCREEN_ENTRY_USER_TYPE, lineBuffer, currentLineNum);
    cursor.display(MARGIN + lineBuffer.length * textWidth, currentLineNum * lineHeight);
  }
}

function displayScreenHistory(startIdx, history) {
  let lineNum = 1;
  for (let i = startIdx; i < history.length; i++) {
    displayLine(history[i].type, history[i].content, lineNum++);
  }
}

function displayLine(type, line, lineNum) {
  textFont("monospace", fontSize);
  let posY = lineNum * lineHeight;
  let posXStart = 0;
  if (type === 0) {
    text(">", 0, posY);
    posXStart = MARGIN;
    fill(cursorColor);;
  } else {
    fill(computerColor);;
  }

  for (let i = 0; i < line.length; ++i) {
    let posX = posXStart + i * textWidth;
    text(line[i], posX, posY);
  }
}
