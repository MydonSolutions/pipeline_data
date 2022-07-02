export {Numeric}

class Numeric {
  expression: string
  value: number
  static regex = /^[\d+-/*e()]+$/;

  constructor(expression:string|number) {
    if(typeof expression == 'number') {
      this.value = expression;
      this.expression = expression.toString();
    }
    else if(typeof expression == 'string') {
      if(expression.match(Numeric.regex) != null) {
        this.value = eval(expression);
        this.expression = expression;
      }
    }
    if(!this.value && this.value != 0) {
      throw new Error(`Error: "${expression}" is not Numeric: ${Numeric.regex}.`);
    }
  }

  /**
   * toString
   */
  public toString() {
    return this.value.toString();
  }

  /**
   * toJSON
   */
  public toJSON() {
    return this.expression;
  }

  /**
   * copy
   */
  public copy() {
    return new Numeric(this.expression);
  }
}
