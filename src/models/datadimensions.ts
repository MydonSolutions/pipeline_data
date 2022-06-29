import { DataType, DataType_fromObject } from "./datatypes";
export { DataDimension, DataDimension_fromObject }

class DataDimension {
  aspects: number;
  channels: number;
  timesamples: number;
  polarizations: number;
  datatype: DataType;

  constructor(
    aspects: number,
    channels: number,
    timesamples: number,
    polarizations: number,
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
      this.aspects,
      this.channels,
      this.timesamples,
      this.polarizations,
      this.datatype.copy(),
    );
  }

  /**
    * bytesize: compute the number of bytes of this data
    */
  public bytesize():number {
    return this.aspects *
      this.channels *
      this.timesamples *
      this.polarizations *
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
    jso['aspects'],
    jso['channels'],
    jso['timesamples'],
    jso['polarizations'],
    DataType_fromObject(jso['datatype'])
  );
}