export const Modes = Object.freeze({
  INTRO: Symbol("intro"),
  COMMAND: Symbol("command"),
});



export let Environment = {
  "fs": null,
  "pwd": null,
  mode: Modes.INTRO,
};
