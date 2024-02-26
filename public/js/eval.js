const intro = "Your eyes open... your mind explodes with input - you find yourself inhabiting a humanoid cybernetic body, standing in a rowdy bar, the music a throbbing bass pulse, rattling your metallic core. The heavily pierced elephant-headed barman asks what you're having...";
// const yourName = "Iron Dollar Adamson";
// const intro = "Your name is " + yourName;

const drinks = ["whiskey", "beer", "wine", "coke", "oil", "tea", "coffee", "piss", "water"];

function Eval(line) {
  print("Eval this:", line);
  var words = line.split(" ");
  if (words.length == 1) {
    if (words[0] === "pwd")
      return environment["location"];
  }
  if (words.length == 2) {
    if (words[0] === "cd") {
      ChDir(words[1]);
    }
  }
  return "computer says no";
};

class Computer {
  constructor() {
    this.isComputing = true;
    this.inputLine = "";
    this.responseLine = intro;
    this.responseIdx = 0;
    this.nextFrameIncr = 0;
    this.currentLine = 1;
    this.bot = new Bot();
    this.bot.isTalking = true;
  }

  read(inputLine) {
    this.inputLine = inputLine.slice();
    this.isComputing = true;
    this.bot.isTalking = true;
    if (this.inputLine.length > 0) {
      this.responseLine = Eval(this.inputLine);
    } else {
      this.responseLine = "";
    }
    this.responseIdx = 0;
  }

  display() {
    this.bot.display();
  }

  // slow response ...
  print() {
    if (!this.isComputing) return "";

    if (frameCount > this.nextFrameIncr || devMode) {
      this.responseIdx++;
      if (this.responseIdx >= this.responseLine.length) {
        this.isComputing = false;
        this.bot.isTalking = false;
      } else {
        this.nextFrameIncr = frameCount + random(3);
      }
    }
    return this.responseLine.slice(0, this.responseIdx);
  }
}
