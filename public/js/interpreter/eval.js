import * as ast from "./ast.js";
import * as pobject from "./objects.js";

import {
  Environment,
  Modes
} from "../environment.js"

function Eval(env, node) {
  if (node instanceof ast.Program) {
    return EvalStatements(env, node.statements_);
  } else if (node instanceof ast.ExpressionStatement) {
    return Eval(env, node.expression_);
  } else if (node instanceof ast.NumberLiteral) {
    return new pobject.Number(node.value_);
  } else if (node instanceof ast.Boolean) {
    return new pobject.Boolean(node.value_);
  } else if (node instanceof ast.LsStatement) {
    return EvalLsStatement(env, node);
  } else if (node instanceof ast.HelpStatement) {
    return EvalHelpStatement(env, node);
  } else if (node instanceof ast.CatStatement) {
    return EvalCatStatement(env, node);
  } else if (node instanceof ast.PwdStatement) {
    if (env && env.pwd) {
      let str = new pobject.String();
      str.Append(env.pwd);
      return str;
    }
    return new pobject.Null();
  } else if (node instanceof ast.CdStatement) {
    return EvalCdStatement(env, node);
  } else if (node instanceof ast.PrefixExpression) {
    console.log("INSTACNE OF PREFGIX");
    let right = Eval(env, node.right_);
    return EvalPrefixExpression(node.operator_, right)
  } else if (node instanceof ast.InfixExpression) {
    console.log("INSTACNE OF INFX");
    let left = Eval(env, node.left_);
    let right = Eval(env, node.right_);
    return EvalInfixExpression(node.operator_, left, right)
  } else {
    console.log("INSTACNE OF MNOTHING I KNOW ABOUT");
    return new pobject.Null();
  }
}

function EvalStatements(env, statements) {
  let result = new pobject.Null();

  statements.forEach((s) => {
    result = Eval(env, s);
  });

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

function EvalLsStatement(env, node) {
  console.log("NODETARG:", node.target_);
  if (env && env.fs) {
    let str = new pobject.String();
    let target = "";
    if (node.target_) {
      if (node.target_.value_.startsWith("/")) {
        target = node.target_.value_;
      } else {
        if (env.pwd == "/") {
          target = env.pwd + node.target_.value_;
        } else {
          target = env.pwd + "/" + node.target_.value_;
        }
        console.log("ELSE DISNAE START WITH SLASH PWD:", env.pwd, "TARGET:", target);
      }
    } else {
      target = env.pwd;
    }
    str.Append(env.fs.ListContents(target));
    return str;
  }
  return new pobject.Null();
}

function EvalHelpStatement(env, node) {
  let str = new pobject.String();
  str.Append("Navigate this UNIX filesystem via standard shell commands to unravel the mystery of Terminal Punk!");
  return str;
}

function EvalCatStatement(env, node) {
  if (env && env.fs) {
    let str = new pobject.String();
    let target = "";
    if (node.target_) {
      if (node.target_.value_.startsWith("/")) {
        target = node.target_.value_;
      } else {
        target = env.pwd + "/" + node.target_.value_;
      }
    } else {
      target = env.pwd;
    }
    str.Append(env.fs.CatFile(target));
    return str;
  }
  return new pobject.Null();
}


function EvalCdStatement(env, node) {
  console.log("YO EVAL CDDDD", node);
  if (env && env.fs) {
    let str = new pobject.String();
    let target = "";
    if (node.target_) {
      if (node.target_.value_.startsWith("/")) {
        target = node.target_.value_;
      } else {
        if (env.pwd === "/") {
          target = env.pwd + node.target_.value_;
        } else {
          target = env.pwd + "/" + node.target_.value_;
        }
      }
    } else {
      target = env.pwd;
    }
    let dir = env.fs.GetDir(target);
    if (dir) {
      console.log(dir);
      env.pwd = dir.GetFullPath();
      if (dir.action == "THE_LIBRARY") {
        console.log("GOT DA ACTION");
        env.mode = Modes.THE_LIBRARY;
      }
      if (dir.action == "WAVES") {
        console.log("GOT DA ACTION");
        env.mode = Modes.WAVES;
      }
      if (dir.action == "DSP") {
        console.log("GOT DA ACTION");
        env.mode = Modes.DSP;
      }
    }
    console.log("NEW ENV!", env.pwd);
  }
  return new pobject.Null();
}

export {
  Eval,
};
