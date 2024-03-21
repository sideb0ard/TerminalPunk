import * as ast from "./ast.js";
import * as pobject from "./objects.js";


function Eval(node) {
  if (node instanceof ast.Program) {
    console.log("INSTACNE OF PROGRAM");
    return EvalStatements(node.statements_);
  } else if (node instanceof ast.ExpressionStatement) {
    console.log("INSTACNE OF EXPRERSSSION STATEMENT");
    return Eval(node.expression_);
  } else if (node instanceof ast.NumberLiteral) {
    console.log("INSTACNE OF NUMBER", node);
    return new pobject.Number(node.value_);
  } else if (node instanceof ast.Boolean) {
    console.log("INSTACNE OF BOOLEAN");
    return new pobject.Boolean(node.value_);
  } else if (node instanceof ast.LsStatement) {
    console.log("INSTACNE OF LS");
    return new pobject.Null();
  } else if (node instanceof ast.CdStatement) {
    console.log("INSTACNE OF CD");
    return new pobject.Null();
  } else if (node instanceof ast.PrefixExpression) {
    console.log("INSTACNE OF PREFGIX");
    let right = Eval(node.right_);
    return EvalPrefixExpression(node.operator_, right)
  } else if (node instanceof ast.InfixExpression) {
    console.log("INSTACNE OF INFX");
    let left = Eval(node.left_);
    let right = Eval(node.right_);
    return EvalInfixExpression(node.operator_, left, right)
  } else {
    console.log("INSTACNE OF MNOTHING I KNOW ABOUT");
    return new pobject.Null();
  }
}

function EvalStatements(statements) {
  console.log("STATMENTS R:", statements);
  let result = new pobject.Null();

  statements.forEach((s) => {
    console.log("states:", s);
    result = Eval(s);
  });

  console.log("REURNEIING RESU>T:", result);
  return result;
}

function EvalPrefixExpression(operator, right) {
  console.log("EVAL PREFIXX:", operator, right);
  switch (operator) {
    case '!':
      return EvalBangOperator(right);
    case '-':
      return EvalMinusOperator(right);
    default:
      return new pobject.Null();
  }
}

function EvalInfixExpression(operator, left, right) {
  console.log("EVAL INFIXXXX:", operator, left, right);
  if (left.type_ == pobject.NUMBER_OBJECT && right.type_ == pobject.NUMBER_OBJECT) {
    return EvalNumberInfixExpression(operator, left, right);
  } else {
    return new pobject.Null();
  }
}

function EvalBangOperator(right) {
  console.log("EVAL BANG!", right);
  if (right.type_ == pobject.BOOLEAN_OBJECT) {
    if (right.value_ == false) {
      console.log("YO FALSE");
      return new pobject.Boolean(true);
    } else {
      console.log("YO ELSEEEE");
      return new pobject.Boolean(false);
    }
  } else {
    return new pobject.Boolean(false);
  }
}

function EvalMinusOperator(right) {
  console.log("EVAL MINUS!", right);
  if (right.type_ == pobject.NUMBER_OBJECT) {
    return new pobject.Number(-right.value_);
  } else {
    return new pobject.Null();
  }
}

function EvalNumberInfixExpression(operator, left, right) {
  switch (operator) {
    case '+':
      return new pobject.Number(left.value_ + right.value_);
    case '-':
      return new pobject.Number(left.value_ - right.value_);
    case '*':
      return new pobject.Number(left.value_ * right.value_);
    case '/':
      return new pobject.Number(left.value_ / right.value_);
    default:
      return new pobject.Null();
  }
}


export {
  Eval,
};
