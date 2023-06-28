let terminalWidthInChars = 60;
const MARGIN = 30;

let currentLine = 1;
let lineHeight = 40;
let fontSize = 28;
let fontWidth = 20;

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
      rect(x, y, fontWidth, 10);
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

let lineNum = 1;

function refreshDisplay() {
  let displayLenInLines = Math.floor(height / lineHeight);

  let computeEval = computer.print();
  if (computeEval.length > 0 && computer.isComputing == false) {
    console.log("YO EVSL LEN:", computeEval, computeEval.length);
    screenHistory.push(new HistoryEntry(SCREEN_ENTRY_COMPUTER_TYPE, computeEval));
    computeEval = "";
  }
  console.log(computeEval, computer.isComputing, screenHistory);

  let lineWidthChars = width / fontWidth;

  let activeLines = lineBuffer % lineWidthChars;
  if (computer.isComputing) {
    activeLines = computeEval % lineWidthChars;
  }

  let historyLinesToDisplay = Math.min(screenHistory.length,
    displayLenInLines - activeLines);

  let historyStartIdx = 0;
  if (screenHistory.length > historyLinesToDisplay) {
    historyStartIdx = screenHistory.length - historyLinesToDisplay;
  }

  lineNum = 1;
  displayScreenHistory(historyStartIdx, screenHistory);

  if (computer.isComputing) {
    displayLine(SCREEN_ENTRY_COMPUTER_TYPE, computeEval);
  } else {
    displayLine(SCREEN_ENTRY_USER_TYPE, lineBuffer);
    cursor.display(MARGIN + lineBuffer.length * fontWidth, (lineNum - 1) * lineHeight);
  }
}

function displayScreenHistory(startIdx, history) {
  for (let i = startIdx; i < history.length; i++) {
    displayLine(history[i].type, history[i].content);
  }
}

function displayLine(type, line) {
  textFont("monospace", fontSize);
  let offset = 0;
  if (type === SCREEN_ENTRY_USER_TYPE) {
    offset = MARGIN;
    text(">", 0, lineNum * lineHeight);
    fill(cursorColor);;
  } else {
    fill(computerColor);;
  }
  let posXStart = offset;

  let maxCharsPerLine = Math.floor(width / fontWidth);
  for (let i = 0; i < line.length; ++i) {
    let posX = posXStart + (i % maxCharsPerLine) * fontWidth;
    if (i % maxCharsPerLine == 0) {
      lineNum++;
    }
    let posY = lineNum * lineHeight;
    text(line[i], posX, posY);
  }
  lineNum++;

}
