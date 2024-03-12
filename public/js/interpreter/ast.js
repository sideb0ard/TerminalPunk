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
    console.log(this.token_.literal + " " + this.name_, " = ", this.value_);
  }
}

class ReturnStatement extends Statement {
  constructor(token) {
    super(token);
    this.return_value_;
  }

  String() {
    console.log(this.token_.literal + " " + this.return_value_);
  }
}

class ExpressionStatement extends Statement {
  constructor(token) {
    super(token);
    this.expression_;
  }

  String() {
    console.log(this.token_.literal + " " + this.expression_);
  }
}


class Identifier extends Expression {
  constructor(token, value) {
    super(token);
    this.value_ = value;
  }
  String() {
    console.log(this.token_.literal + " " + this.value_);
  }
}

class IntegerLiteral extends Expression {
  constructor(token, value) {
    super(token);
    this.value_ = value;
  }
  String() {
    console.log(this.token_.literal + " " + this.value_);
  }
}

/////////////////////////////////////////////////////////////////////
class Root {
  constructor() {
    this.statements_ = [];
  }

  String() {
    this.statements_.forEach((s) => {
      //console.log("STTEMENT:");
      s.String();
    });
  }
}

export {
  Root,
  Identifier,
  LetStatement,
  ReturnStatement,
  Expression,
  ExpressionStatement,
  Statement,
  Node,
  IntegerLiteral
};
