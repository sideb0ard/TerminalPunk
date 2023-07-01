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

let lineBuffer = "STARTRESR";
let lineBufferTemp = "";

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
  let lineWidthChars = width / fontWidth;

  let historyLinesToDisplay = Math.min(screenHistory.length,
    displayLenInLines - 2);


  let historyStartIdx = 0;
  if (screenHistory.length > historyLinesToDisplay) {
    historyStartIdx = screenHistory.length - historyLinesToDisplay;
  }

  lineNum = 1;
  displayScreenHistory(historyStartIdx, screenHistory);

  let computeEval;
  if (computer.isComputing) {
    computeEval = computer.print();
  }
  if (computeEval) {
    displayLine(SCREEN_ENTRY_COMPUTER_TYPE, computeEval);
    if (!computer.isComputing) {
      screenHistory.push(new HistoryEntry(SCREEN_ENTRY_COMPUTER_TYPE, computeEval));
    }
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

function displayWord(startX, posY, word) {
  for (let i = 0; i < word.length; ++i) {
    let posX = startX + i * fontWidth;
    text(word[i], posX, posY);
  }
}

function displayLine(type, line) {

  textFont("monospace", fontSize);
  let offset = 0;
  if (type === SCREEN_ENTRY_USER_TYPE) {
    fill(cursorColor);;
    text(">", 0, lineNum * lineHeight);
    offset = MARGIN;
  } else {
    fill(computerColor);;
  }
  if (line.length == 0) {
    lineNum++;
    return;
  }


  let maxCharsPerLine = Math.floor((width - offset) / fontWidth);
  let charCount = 0;
  let posX = offset;

  let wurds = line.split(" ");
  while (wurds.length) {
    let wurd = wurds.shift();
    if (wurd.length > (maxCharsPerLine - charCount)) {
      lineNum++;
      posX = offset;
      charCount = 0;
    }
    let posY = lineNum * lineHeight;
    displayWord(posX, posY, wurd);
    posX += wurd.length * fontWidth;
    charCount += wurd.length;
    if (wurds.length) {
      text(" ", posX, posY);
      posX += fontWidth;
      charCount++;
    }
  }
  lineNum++;
}
