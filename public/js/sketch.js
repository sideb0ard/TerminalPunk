import {
  Terminal
} from "./terminal.js";

export default function sketch(p) {

  p.terminal;
  p.hiddenInput;
  p.backg = 0;

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.terminal = new Terminal(p);
  }

  p.draw = () => {
    p.background(p.backg);
    p.terminal.RefreshDisplay();
  }

  p.keyPressed = () => {
    p.terminal.KeyPressed(p.keyCode, p.key);
  }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  }
}
