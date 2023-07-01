// const intro = "Your eyes open... your mind explodes with input - you find yourself inhabiting a humanoid cybernetic body, standing in a rowdy bar, the music a throbbing bass pulse, rattling your metallic core. The heavily pierced elephant-headed barman asks what you're having...";
const yourName = "Iron Dollar Adamson";
const intro = "Your name is " + yourName;

class Computer {
  constructor() {
    this.isComputing = true;
    this.inputLine = "";
    this.responseLine = intro;
    this.responseIdx = 0;
    this.nextFrameIncr = 0;
    this.currentLine = 1;
  }

  read(inputLine) {
    this.inputLine = inputLine.slice();
    this.isComputing = true;
    if (this.inputLine.length > 0) {
      this.responseLine = "computer says no";
    } else {
      this.responseLine = "";
    }
    this.responseIdx = 0;
  }

  eval() {
    // chomp chomp chomp;
    if (this.inputline.length > 0) {
      this.responseLine = "computer says no.";
    }
  }

  // slow response ...
  print() {
    if (!this.isComputing) return "";

    if (frameCount > this.nextFrameIncr) {
      this.responseIdx++;
      if (this.responseIdx >= this.responseLine.length) {
        this.isComputing = false;
      } else {
        this.nextFrameIncr = frameCount + random(3);
      }
    }
    return this.responseLine.slice(0, this.responseIdx);
  }
}
