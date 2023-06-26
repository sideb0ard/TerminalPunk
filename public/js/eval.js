// const intro = "Your eyes open... your mind expodes with input - you find yourself inhabiting a humanoid cybernetic body, standing in a rowdy bar, the music a throbbing bass pulse, rattling your metallic core. The elephant headed barman asks what your having...";
const yourName = "Iron Dollar Adamson";
const intro = "Your name is " + yourName;

class Computer {
  constructor() {
    this.isComputing = true;
    this.inputLine = "";
    this.responseLine = intro;
    this.responseIdx = 0;
    this.nextFrameIncr = 0;
  }

  displayResponse(lineNum) {
    if (frameCount > this.nextFrameIncr) {
      this.responseIdx++;
      if (this.responseIdx >= this.responseLine.length) {
        this.isComputing = false;

        screenHistory.push(new HistoryEntry(1, this.responseLine));
        historyIdx = history.length;
      }
      this.nextFrameIncr = frameCount + random(13);

    }

    textFont("monospace", fontSize);
    fill(computerColor);;
    let posY = lineNum * lineHeight;
    let posXStart = 0;

    for (let i = 0; i < this.responseIdx; ++i) {
      let posX = posXStart + i * textWidth;
      text(this.responseLine[i], posX, posY);
    }
  }

  eval(inputLine) {
    this.inputLine = inputLine.slice();
    screenHistory.push(new HistoryEntry(0, this.inputLine));
    if (this.inputLine.length > 0) {
      history.push(this.inputLine);
      this.isComputing = true;
      this.responseLine = "does not compute.";
      this.responseIdx = 0;
    }
  }
}
