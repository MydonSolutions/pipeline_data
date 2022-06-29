import { DataType, DataType_fromObject } from "./datatypes";
import type { Device } from "./device";
import { Dataflow, getDataflowDirection } from "./dataflow";

export type {
  IModule,
}
export {
  Accumulate, Accumulate_fromObject,
  Beamform, Beamform_fromObject,
  Cast, Cast_fromObject,
  Channelize, Channelize_fromObject,
  Detect, Detect_fromObject,
  GatherTime, GatherTime_fromObject,
}

interface IModule {
  device: Device;
  ingest(dataflow:Dataflow):Dataflow;
}

class Accumulate implements IModule{
  device: Device;
  length: number;

  constructor(
    device: Device,
    length: number
  ) {
    this.device = device;
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
      "device": this.device,
      "length": this.length,
    }
  }

  /**
  * ingest: reduce the number of timesamples
  */
  public ingest(dataflow:Dataflow):Dataflow {    
    let flow = new Dataflow(
      getDataflowDirection(dataflow.direction.to, this.device),
      dataflow.datadim_in.copy(),
      dataflow.datadim_out.copy(),
      this.toString(),
      dataflow.rate
    );
    flow.datadim_out.timesamples /= this.length;
    return flow;
  }
}
function Accumulate_fromObject(jso:Object) {
  [
    'device',
    'length',
  ].forEach(prop => {
    if(!jso.hasOwnProperty(prop)) {
      throw new Error(`Accumulate from JSObject: Missing '${prop}' property (${jso}).`);
    }
  });
  return new Accumulate(
    jso['device'],
    jso['length']
  );
}

class Beamform implements IModule{
  device: Device;
  beams: number;

  constructor(
    device: Device,
    beams: number
  ) {
    this.device = device;
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
      "device": this.device,
      "beams": this.beams,
    }
  }

  /**
  * ingest: change the number of sources (from antenna to beams)
  */
  public ingest(dataflow:Dataflow):Dataflow {    
    let flow = new Dataflow(
      getDataflowDirection(dataflow.direction.to, this.device),
      dataflow.datadim_in.copy(),
      dataflow.datadim_out.copy(),
      this.toString(),
      dataflow.rate
    );
    flow.datadim_out.aspects = this.beams;
    return flow;
  }
}
function Beamform_fromObject(jso:Object) {
  [
    'device',
    'beams',
  ].forEach(prop => {
    if(!jso.hasOwnProperty(prop)) {
      throw new Error(`Beamform from JSObject: Missing '${prop}' property (${jso}).`);
    }
  });
  return new Beamform(
    jso['device'],
    jso['beams']
  );
}

class Cast implements IModule{
  device: Device;
  datatype: DataType;

  constructor(
    device: Device,
    datatype: DataType
  ) {
    this.device = device;
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
      "device": this.device,
      "datatype": this.datatype,
    }
  }

  /**
  * ingest: change the datadim_in.datatype
  */
  public ingest(dataflow:Dataflow):Dataflow {
    let flow = new Dataflow(
      getDataflowDirection(dataflow.direction.to, this.device),
      dataflow.datadim_in.copy(),
      dataflow.datadim_out.copy(),
      this.toString(),
      dataflow.rate
    );
    flow.datadim_out.datatype = this.datatype;
    return flow;
  }
}
function Cast_fromObject(jso:Object) {
  [
    'device',
    'datatype',
  ].forEach(prop => {
    if(!jso.hasOwnProperty(prop)) {
      throw new Error(`Cast from JSObject: Missing '${prop}' property (${jso}).`);
    }
  });
  return new Cast(
    jso['device'],
    DataType_fromObject(jso['datatype'])
  );
}

class Channelize implements IModule{
  device: Device;
  rate: number;

  constructor(
    device: Device,
    rate: number
  ) {
    this.device = device;
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
      "device": this.device,
      "rate": this.rate,
    }
  }

  /**
  * ingest: upchannelize by a given rate
  */
  public ingest(dataflow:Dataflow):Dataflow {
    if (dataflow.datadim_in.timesamples % this.rate != 0) {
      throw new Error(
        `Channelizer rate (${this.rate}) not a factor of timesamples (${dataflow.datadim_in.timesamples}).`
      );
    }
    
    let flow = new Dataflow(
      getDataflowDirection(dataflow.direction.to, this.device),
      dataflow.datadim_in.copy(),
      dataflow.datadim_out.copy(),
      this.toString(),
      dataflow.rate
    );
    flow.datadim_out.timesamples /= this.rate;
    flow.datadim_out.channels *= this.rate;
    return flow;
  }
}
function Channelize_fromObject(jso:Object) {
  [
    'device',
    'rate',
  ].forEach(prop => {
    if(!jso.hasOwnProperty(prop)) {
      throw new Error(`Channelize from JSObject: Missing '${prop}' property (${jso}).`);
    }
  });
  return new Channelize(
    jso['device'],
    jso['rate']
  );
}

class Detect implements IModule{
  device: Device;
  components: number;
  
  constructor(
    device: Device,
    components: number,
  ) {
    this.device = device;
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
      "device": this.device,
      "components": this.components,
    }
  }

  /**
  * ingest: collapse the polarisations
  */
  public ingest(dataflow:Dataflow):Dataflow {    
    let flow = new Dataflow(
      getDataflowDirection(dataflow.direction.to, this.device),
      dataflow.datadim_in.copy(),
      dataflow.datadim_out.copy(),
      this.toString(),
      dataflow.rate
    );
    flow.datadim_out.polarizations = this.components;
    return flow;
  }
}
function Detect_fromObject(jso:Object) {
  [
    'device',
    'components',
  ].forEach(prop => {
    if(!jso.hasOwnProperty(prop)) {
      throw new Error(`Detect from JSObject: Missing '${prop}' property (${jso}).`);
    }
  });
  return new Detect(
    jso['device'],
    jso['components']
  );
}

class GatherTime implements IModule{
  device: Device;
  length: number;

  constructor(
    device: Device,
    length: number
  ) {
    this.device = device;
    this.length = length;
  }

  /**
   * toString
   */
  public toString() {
    return  `GatherTime(${this.length})`;
  }

  /**
   * toJSON
   */
  public toJSON() {
    return {
      "module": "GatherTime",
      "device": this.device,
      "length": this.length,
    }
  }

  /**
  * ingest: reduce the number of timesamples
  */
  public ingest(dataflow:Dataflow):Dataflow {    
    let inout_ratio = dataflow.datadim_out.timesamples/this.length;
    let flow = new Dataflow(
      getDataflowDirection(dataflow.direction.to, this.device),
      dataflow.datadim_out.copy(),
      dataflow.datadim_out.copy(),
      this.toString(),
      dataflow.rate*inout_ratio
    );
    flow.datadim_out.timesamples = this.length;
    return flow;
  }
}
function GatherTime_fromObject(jso:Object) {
  [
    'device',
    'length',
  ].forEach(prop => {
    if(!jso.hasOwnProperty(prop)) {
      throw new Error(`GatherTime from JSObject: Missing '${prop}' property (${jso}).`);
    }
  });
  return new GatherTime(
    jso['device'],
    jso['length']
  );
}
