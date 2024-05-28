export const Modes = Object.freeze({
  COMMAND: Symbol("command"),
  DSP: Symbol("dsp"),
  THE_LIBRARY: Symbol("the_library"),
  NAE_KEYBOARD: Symbol("nae keyboard"),
});




export let Environment = {
  "fs": null,
  "pwd": null,
  "user_name": "agent",
  mode: Modes.COMMAND,
  //mode: Modes.DSP,
};
