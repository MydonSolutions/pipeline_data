export {
  DataType, DataType_fromObject,
  I8, CI8,
  I16, CI16,
  I32, CI32,
  I64, CI64,
  F16, CF16,
  F32, CF32,
  F64, CF64
}

class DataType {
  bytesize: number;
  label: string;

  constructor(
    bytesize: number,
    label: string
  ) {
    this.bytesize = bytesize;
    this.label = label;
  }

  /**
   * copy
   */
  public copy() {
    return new DataType(
      this.bytesize,
      this.label,
    );
  }

  /**
   * toJSON
   */
   public toJSON() {
    switch (this) {
      case I8:
        return 'I8';
      case CI8:
        return 'CI8';
      case I16:
        return 'I16';
      case CI16:
        return 'CI16';
      case I32:
        return 'I32';
      case CI32:
        return 'CI32';
      case I64:
        return 'I64';
      case CI64:
        return 'CI64';
      case F16:
        return 'F16';
      case CF16:
        return 'CF16';
      case F32:
        return 'F32';
      case CF32:
        return 'CF32';
      case F64:
        return 'F64';
      case CF64:
        return 'CF64';
    }
    return {
      "bytesize": this.bytesize,
      "label": this.label,
    }
  }
}
function DataType_fromObject(jso:Object):DataType {
  // Handle string
  if(typeof jso == 'string'){
    switch (jso) {
      case 'I8':
        return I8;
      case 'CI8':
        return CI8;
      case 'I16':
        return I16;
      case 'CI16':
        return CI16;
      case 'I32':
        return I32;
      case 'CI32':
        return CI32;
      case 'I64':
        return I64;
      case 'CI64':
        return CI64;
      case 'F16':
        return F16;
      case 'CF16':
        return CF16;
      case 'F32':
        return F32;
      case 'CF32':
        return CF32;
      case 'F64':
        return F64;
      case 'CF64':
        return CF64;
    }
    throw new Error(`DataType parse from string failed: ${jso} not predefined.`);
  }

  // Handle JSObject
  [
    'bytesize',
    'label',
  ].forEach(prop => {
    if(!jso.hasOwnProperty(prop)) {
      throw new Error(`DataType from JSObject: Missing '${prop}' property (${jso}).`);
    }
  });
  return new DataType(
    jso['bytesize'],
    jso['label']
  );
}

const I8  = new DataType(1, 'I8');
const CI8  = new DataType(2*1, 'CI8');

const I16 = new DataType(2, 'I16');
const CI16 = new DataType(2*2, 'CI16');

const I32 = new DataType(4, 'I32');
const CI32 = new DataType(2*4, 'CI32');

const I64 = new DataType(8, 'I64');
const CI64 = new DataType(2*8, 'CI64');

const F16 = new DataType(2, 'F16');
const CF16 = new DataType(2*2, 'CF16');

const F32 = new DataType(4, 'F32');
const CF32 = new DataType(2*4, 'CF32');

const F64 = new DataType(8, 'F64');
const CF64 = new DataType(2*8, 'CF64');
