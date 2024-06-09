import {
  Terminal
} from "./terminal.js";

export default function sketch(p) {

  p.terminal;
  p.hiddenInput;
  p.backg = 0;
  p.img;

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
  p.mousePressed = () => {
    p.terminal.mousePressed();
  }
  p.mouseReleased = () => {
    p.terminal.mouseReleased();
  }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    p.terminal.ResizeDisplay(p.windowWidth, p.windowHeight)
  }
}
