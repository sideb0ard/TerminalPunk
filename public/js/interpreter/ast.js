import {
  Token
} from "./tokens.js"

class Node {
  constructor(token) {
    this.token_ = token;
  }
  TokenLiteral() {
    return this.token_.literal;
  }
  String() {
    console.log("Default Node Print");
  }
}

class Statement extends Node {
  constructor(token) {
    super(token);
  }
}

class Expression extends Node {
  constructor(token) {
    super(token);
  }
}

class LetStatement extends Statement {
  constructor(token) {
    super(token);
    this.name_;
    this.value_;
  }
  String() {
    console.log("let ", this.name_, " = ", this.value_);
  }
}

class Identifier extends Expression {
  constructor(token, value) {
    super(token);
    this.value_ = value;
  }
}

/////////////////////////////////////////////////////////////////////
class Root {
  constructor() {
    this.statements_ = [];
  }

  Print() {
    this.statements_.forEach((s) => {
      console.log("STTEMENT:", s);
      //s.String();
    });
  }
}

export {
  Root,
  Identifier,
  LetStatement,
  Expression,
  Statement,
  Node
};
