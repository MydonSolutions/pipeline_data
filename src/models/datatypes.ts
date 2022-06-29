export {
  DataType, DataType_fromObject,
  INT8, COMP_INT8,
  INT16, COMP_INT16,
  INT32, COMP_INT32,
  INT64, COMP_INT64,
  FLOAT16, COMP_FLOAT16,
  FLOAT32, COMP_FLOAT32,
  FLOAT64, COMP_FLOAT64
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
      case INT8:
        return 'INT8';
      case COMP_INT8:
        return 'COMP_INT8';
      case INT16:
        return 'INT16';
      case COMP_INT16:
        return 'COMP_INT16';
      case INT32:
        return 'INT32';
      case COMP_INT32:
        return 'COMP_INT32';
      case INT64:
        return 'INT64';
      case COMP_INT64:
        return 'COMP_INT64';
      case FLOAT16:
        return 'FLOAT16';
      case COMP_FLOAT16:
        return 'COMP_FLOAT16';
      case FLOAT32:
        return 'FLOAT32';
      case COMP_FLOAT32:
        return 'COMP_FLOAT32';
      case FLOAT64:
        return 'FLOAT64';
      case COMP_FLOAT64:
        return 'COMP_FLOAT64';
    }
    return {
      "bytesize": this.bytesize,
      "label": this.label,
    }
  }
}
function DataType_fromObject(jso:Object):DataType {
  switch (jso) {
    case 'INT8':
      return INT8;
    case 'COMP_INT8':
      return COMP_INT8;
    case 'INT16':
      return INT16;
    case 'COMP_INT16':
      return COMP_INT16;
    case 'INT32':
      return INT32;
    case 'COMP_INT32':
      return COMP_INT32;
    case 'INT64':
      return INT64;
    case 'COMP_INT64':
      return COMP_INT64;
    case 'FLOAT16':
      return FLOAT16;
    case 'COMP_FLOAT16':
      return COMP_FLOAT16;
    case 'FLOAT32':
      return FLOAT32;
    case 'COMP_FLOAT32':
      return COMP_FLOAT32;
    case 'FLOAT64':
      return FLOAT64;
    case 'COMP_FLOAT64':
      return COMP_FLOAT64;
  }

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

const INT8  = new DataType(1, 'INT8');
const COMP_INT8  = new DataType(2*1, 'COMP_INT8');

const INT16 = new DataType(2, 'INT16');
const COMP_INT16 = new DataType(2*2, 'COMP_INT16');

const INT32 = new DataType(4, 'INT32');
const COMP_INT32 = new DataType(2*4, 'COMP_INT32');

const INT64 = new DataType(8, 'INT64');
const COMP_INT64 = new DataType(2*8, 'COMP_INT64');

const FLOAT16 = new DataType(2, 'FLOAT16');
const COMP_FLOAT16 = new DataType(2*2, 'COMP_FLOAT16');

const FLOAT32 = new DataType(4, 'FLOAT32');
const COMP_FLOAT32 = new DataType(2*4, 'COMP_FLOAT32');

const FLOAT64 = new DataType(8, 'FLOAT64');
const COMP_FLOAT64 = new DataType(2*8, 'COMP_FLOAT64');
