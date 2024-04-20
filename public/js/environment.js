export const Modes = Object.freeze({
  COMMAND: Symbol("command"),
  THE_LIBRARY: Symbol("the_library"),
  NAE_KEYBOARD: Symbol("nae keyboard"),
});



export let Environment = {
  "fs": null,
  "pwd": null,
  "user_name": "willy",
  mode: Modes.COMMAND,
};
