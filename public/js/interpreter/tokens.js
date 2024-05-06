export class Token {
  constructor(token_type, literal) {
    this.token_type = token_type;
    this.literal = literal;
  }
}

export const PROGRAM = "PROGRAM";
export const ILLEGAL = "ILLEGAL";
export const EOF = "EOF";
export const IDENT = "IDENT";
export const NUMBER = "NUMBER";
export const STRING = "STRING";

export const ASSIGN = "=";
export const ADD = "+";
export const MINUS = "-";
export const BANG = "!";
export const NOT = "~";
export const ASTERISK = "*";
export const SLASH = "/";

export const LT = "<";
export const GT = ">";
export const EQ = "==";
export const NOT_EQ = "!=";

export const SEMICOLON = ";";
export const COMMA = ",";
export const PERIOD = ".";

export const LPAREN = "(";
export const RPAREN = ")";
export const LBRACE = "{";
export const RBRACE = "}";

export const TRUE = "true";
export const FALSE = "false";

export const LET = "let";
export const PWD = "pwd";
export const CD = "cd";
export const LS = "ls";
export const CAT = "cat";
export const WHO = "who";
export const PS = "ps";
export const HELP = "help";
export const RETURN = "return";

export const KEYWORDS = new Map([
  ["let", LET],
  ["pwd", PWD],
  ["cd", CD],
  ["cat", CAT],
  ["more", CAT],
  ["less", CAT],
  ["ls", LS],
  ["who", WHO],
  ["ps", PS],
  ["return", RETURN],
  ["help", HELP],
  ["true", TRUE],
  ["false", FALSE],
]);
