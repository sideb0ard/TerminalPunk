export const Modes = Object.freeze({
  INTRO: Symbol("intro"),
  COMMAND: Symbol("command"),
  THE_LIBRARY: Symbol("the_library"),
  NAE_KEYBOARD: Symbol("nae keyboard"),
});



export let Environment = {
  "fs": null,
  "pwd": null,
  mode: Modes.INTRO,
};
