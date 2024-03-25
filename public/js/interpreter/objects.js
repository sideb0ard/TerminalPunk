export const NUMBER_OBJECT = "NUMBER";
export const BOOLEAN_OBJECT = "BOOLEAN";
export const STRING_OBJECT = "STRING";
export const NULL_OBJECT = "NULL";

class Pobject {
  constructor(type) {
    this.type_ = type
  }
  Type() {
    return this.type_;
  }
  Inspect() {
    return this.type_.toString();
  }
}

class Number extends Pobject {
  constructor(value) {
    super(NUMBER_OBJECT);
    this.value_ = value;
  }
  Inspect() {
    return this.value_.toString();
  }
}

class Boolean extends Pobject {
  constructor(value) {
    super(BOOLEAN_OBJECT);
    this.value_ = value;
  }
  Inspect() {
    return this.value_.toString();
  }
}

class Null extends Pobject {
  constructor() {
    super(NULL_OBJECT);
  }
  Inspect() {
    return "n~ll";
  }
}

class String extends Pobject {
  constructor() {
    super(STRING_OBJECT);
    this.string_parts = [];
  }
  Append(str) {
    this.string_parts.push(str);
  }
  Inspect() {
    return this.string_parts.join(" ");
  }
}

export {
  Boolean,
  Number,
  Null,
}
