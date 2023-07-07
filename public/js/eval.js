const intro = "Your eyes open... your mind explodes with input - you find yourself inhabiting a humanoid cybernetic body, standing in a rowdy bar, the music a throbbing bass pulse, rattling your metallic core. The heavily pierced elephant-headed barman asks what you're having...";
// const yourName = "Iron Dollar Adamson";
// const intro = "Your name is " + yourName;

const drinks = ["whiskey", "beer", "wine", "coke", "oil", "tea", "coffee", "piss", "water"];

function barConversation(line) {
  var words = line.split(" ");
  print(":WURDS:", words);
  for (const word of words) {
    print("WORD:", word);
    print("DRUNKS:", drinks);
    if (drinks.includes(word)) {
      return "Barman slides a greasy glass of " + word + " along the bar to you.";
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
  }

  read(inputLine) {
    this.inputLine = inputLine.slice();
    this.isComputing = true;
    if (this.inputLine.length > 0) {
      this.responseLine = barConversation(this.inputLine);
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
