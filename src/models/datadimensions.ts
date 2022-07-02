import { Numeric } from "./numeric";
import { DataType, DataType_fromObject } from "./datatypes";
export { DataDimension, DataDimension_fromObject, regex_DataDimension}

const regex_DataDimension = /aspects|channels|timesamples|polarizations|datatype/;

class DataDimension {
  aspects: Numeric;
  channels: Numeric;
  timesamples: Numeric;
  polarizations: Numeric;
  datatype: DataType;

  constructor(
    aspects: Numeric,
    channels: Numeric,
    timesamples: Numeric,
    polarizations: Numeric,
    datatype: DataType
  ) {
    this.aspects = aspects;
    this.channels = channels;
    this.timesamples = timesamples;
    this.polarizations = polarizations;
    this.datatype = datatype;
  }

  /**
   * copy
   */
  public copy() {
    return new DataDimension(
      this.aspects.copy(),
      this.channels.copy(),
      this.timesamples.copy(),
      this.polarizations.copy(),
      this.datatype.copy(),
    );
  }

  /**
    * bytesize: compute the number of bytes of this data
    */
  public bytesize():number {
    return this.aspects.value *
      this.channels.value *
      this.timesamples.value *
      this.polarizations.value *
      this.datatype.bytesize;
  }
}
function DataDimension_fromObject(jso:Object):DataDimension {  
  [
    'aspects',
    'channels',
    'timesamples',
    'polarizations',
    'datatype',
  ].forEach(prop => {
    if(!jso.hasOwnProperty(prop)) {
      throw new Error(`DataDimension from JSObject: Missing '${prop}' property (${jso}).`);
    }
  });

  return new DataDimension(
    new Numeric(jso['aspects']),
    new Numeric(jso['channels']),
    new Numeric(jso['timesamples']),
    new Numeric(jso['polarizations']),
    DataType_fromObject(jso['datatype'])
  );
}