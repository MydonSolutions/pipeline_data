import { DataType, DataType_fromObject } from "./datatypes";
import type { DataDimension } from "./datadimensions";
export type {
  IModule,
}
export {
  Accumulate, Accumulate_fromObject,
  Beamform, Beamform_fromObject,
  Cast, Cast_fromObject,
  Channelize, Channelize_fromObject,
  Detect, Detect_fromObject,
}

interface IModule {
  ingest(datadim:DataDimension):DataDimension;
}

class Accumulate implements IModule{
  length: number;

  constructor(
    length: number
  ) {
    this.length = length;
  }

  /**
   * toString
   */
  public toString() {
    return  `Accumulate(${this.length})`;
  }

  /**
   * toJSON
   */
  public toJSON() {
    return {
      "module": "Accumulate",
      "length": this.length
    }
  }

  /**
  * ingest: reduce the number of timesamples
  */
  public ingest(datadim:DataDimension):DataDimension {    
    let outdim = datadim.copy();
    outdim.timesamples /= this.length;
    return outdim;
  }
}
function Accumulate_fromObject(jso:Object) {
  [
    'length',
  ].forEach(prop => {
    if(!jso.hasOwnProperty(prop)) {
      throw new Error(`Accumulate from JSObject: Missing '${prop}' property (${jso}).`);
    }
  });
  return new Accumulate(jso['length'])
}

class Beamform implements IModule{
  beams: number;

  constructor(
    beams: number
  ) {
    this.beams = beams;
  }

  /**
   * toString
   */
  public toString() {
    return  `Beamform(${this.beams})`;
  }

  /**
   * toJSON
   */
  public toJSON() {
    return {
      "module": "Beamform",
      "beams": this.beams
    }
  }

  /**
  * ingest: change the number of sources (from antenna to beams)
  */
  public ingest(datadim:DataDimension):DataDimension {    
    let outdim = datadim.copy();
    outdim.aspects = this.beams;
    return outdim;
  }
}
function Beamform_fromObject(jso:Object) {
  [
    'beams',
  ].forEach(prop => {
    if(!jso.hasOwnProperty(prop)) {
      throw new Error(`Beamform from JSObject: Missing '${prop}' property (${jso}).`);
    }
  });
  return new Beamform(jso['beams'])
}

class Cast implements IModule{
  datatype: DataType;

  constructor(
    datatype: DataType
  ) {
    this.datatype = datatype;
  }

  /**
   * toString
   */
  public toString() {
    return  `Cast(${this.datatype.label})`;
  }

  /**
   * toJSON
   */
  public toJSON() {
    return {
      "module": "Cast",
      "datatype": this.datatype
    }
  }

  /**
  * ingest: change the DataDimension.datatype
  */
  public ingest(datadim:DataDimension):DataDimension {
    let outdim = datadim.copy();
    outdim.datatype = this.datatype;
    return outdim;
  }
}
function Cast_fromObject(jso:Object) {
  [
    'datatype',
  ].forEach(prop => {
    if(!jso.hasOwnProperty(prop)) {
      throw new Error(`Cast from JSObject: Missing '${prop}' property (${jso}).`);
    }
  });
  return new Cast(DataType_fromObject(jso['datatype']))
}

class Channelize implements IModule{
  rate: number;

  constructor(
    rate: number
  ) {
    this.rate = rate;
  }

  /**
   * toString
   */
  public toString() {
    return  `Channelize(${this.rate})`;
  }

  /**
   * toJSON
   */
  public toJSON() {
    return {
      "module": "Channelize",
      "rate": this.rate
    }
  }

  /**
  * ingest: upchannelize by a given rate
  */
  public ingest(datadim:DataDimension):DataDimension {
    if (datadim.timesamples % this.rate != 0) {
      throw new Error(
        `Channelizer rate (${this.rate}) not a factor of timesamples (${datadim.timesamples}).`
      );
    }
    
    let outdim = datadim.copy();
    outdim.timesamples /= this.rate;
    outdim.channels *= this.rate;
    return outdim;
  }
}
function Channelize_fromObject(jso:Object) {
  [
    'rate',
  ].forEach(prop => {
    if(!jso.hasOwnProperty(prop)) {
      throw new Error(`Channelize from JSObject: Missing '${prop}' property (${jso}).`);
    }
  });
  return new Channelize(jso['rate'])
}

class Detect implements IModule{
  components: number;
  
  constructor(
    components: number
  ) {
    this.components = components;
  }

  /**
   * toString
   */
  public toString() {
    return  `Detect(${this.components})`;
  }

  /**
   * toJSON
   */
  public toJSON() {
    return {
      "module": "Detect",
      "components": this.components
    }
  }

  /**
  * ingest: collapse the polarisations
  */
  public ingest(datadim:DataDimension):DataDimension {    
    let outdim = datadim.copy();
    outdim.polarizations = this.components;
    return outdim;
  }
}
function Detect_fromObject(jso:Object) {
  [
    'components',
  ].forEach(prop => {
    if(!jso.hasOwnProperty(prop)) {
      throw new Error(`Detect from JSObject: Missing '${prop}' property (${jso}).`);
    }
  });
  return new Detect(jso['components'])
}