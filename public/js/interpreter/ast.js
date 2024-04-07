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

class LsStatement extends Statement {
  constructor(token) {
    super(token);
    this.target_;
  }

  String() {
    console.log(this.token_.literal + " " + this.target_);
  }
}


class CdStatement extends Statement {
  constructor(token) {
    super(token);
    this.dir_;
  }

  String() {
    console.log(this.token_.literal + " " + this.dir_);
  }
}

class PwdStatement extends Statement {
  constructor(token) {
    super(token);
  }

  String() {
    console.log(this.token_.literal);
  }
}


class ExpressionStatement extends Statement {
  constructor(token) {
    super(token);
    this.expression_;
  }

  String() {
    console.log(this.token_.literal + " " + this.expression_.String());
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

class NumberLiteral extends Expression {
  constructor(token, value) {
    super(token);
    this.value_ = Number(value);
  }
  String() {
    console.log(this.token_.literal + " " + this.value_);
  }
}

class PrefixExpression extends Expression {
  constructor(token, operator) {
    super(token);
    this.operator_ = operator;
    this.right_;
  }
  String() {
    console.log("(" + this.operator_ + " " + this.right_.String() + ")");
  }
}

class InfixExpression extends Expression {
  constructor(token, operator, left) {
    super(token);
    this.operator_ = operator;
    this.left_ = left;
    this.right_;
  }
  String() {
    //console.log("(" + this.left_.String() + " " + this.operator_ + " " + this.right_.String() + ")");
    console.log("(" + this.left_.String() + " " + this.operator_ + " " + this.right_.String() + ")");
  }
}

class Boolean extends Expression {
  constructor(token, value) {
    super(token);
    this.value_ = value;
  }
  String() {
    console.log("bool:" + this.value_.toString());
  }
}

/////////////////////////////////////////////////////////////////////
class Program extends Node {
  constructor(token) {
    super(token);
    this.statements_ = [];
  }

  String() {
    this.statements_.forEach((s) => {
      s.String();
    });
  }
}

export {
  Boolean,
  CdStatement,
  Expression,
  ExpressionStatement,
  Identifier,
  InfixExpression,
  NumberLiteral,
  LetStatement,
  LsStatement,
  PwdStatement,
  Node,
  PrefixExpression,
  Program,
  ReturnStatement,
  Statement,
};
