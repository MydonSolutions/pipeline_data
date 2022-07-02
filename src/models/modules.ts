import { CI8, DataType, DataType_fromObject } from "./datatypes";
import { Device, getDevice } from "./device";
import { Dataflow, DataflowInOut, getDataflowDirection } from "./dataflow";
import { regex_DataDimension } from "./datadimensions";
import { Numeric } from "./numeric";

export type {
  IModule,
}
export {
  Beamform, Beamform_fromObject,
  Cast, Cast_fromObject,
  Channelize, Channelize_fromObject,
  Detect, Detect_fromObject,
  Gather, Gather_fromObject,
  Integrate, Integrate_fromObject,
  Loop, Loop_fromObject,
  Pool,
  module_examples
}

interface IModule {
  device: Device;
  ingest(dataflow:Dataflow):Dataflow;
}

class Beamform implements IModule{
  device: Device;
  beams: Numeric;

  constructor(
    device: Device,
    beams: Numeric
  ) {
    this.device = device;
    this.beams = beams;
  }

  /**
   * toString
   */
  public toString() {
    return  `Beamform(${this.beams.value})`;
  }

  /**
   * toJSON
   */
  public toJSON() {
    return `Beamform(${this.device},${this.beams})`
    // return {
    //   "module": "Beamform",
    //   "device": this.device,
    //   "beams": this.beams,
    // }
  }

  /**
  * ingest: change the number of sources (from antenna to beams)
  */
  public ingest(dataflow:Dataflow):Dataflow {    
    let flow = DataflowInOut(
      this.toString(),
      getDataflowDirection(dataflow.devices.out, this.device),
      dataflow.datadims.out,
      dataflow.ids.out,
      dataflow.rates.out
    );
    flow.ids.out.increment();
    flow.datadims.out.aspects = this.beams;
    return flow;
  }
}
function Beamform_fromObject(jso:Object) {
  // Handle string
  if(typeof jso == 'string') {
    let parsed:string[] = jso.match(/Beamform\((CPU|GPU),(.+)\)/);
    if(parsed == null) {
      throw new Error(`Beamform parse from 'string' object failed: "${jso}".`);
    }
    return new Beamform(
      getDevice(parsed[1]),
      new Numeric(parsed[2])
    );
  }

  // Handle JSObject
  [
    'device',
    'beams',
  ].forEach(prop => {
    if(!jso.hasOwnProperty(prop)) {
      throw new Error(`Beamform from JSObject: Missing '${prop}' property (${JSON.stringify(jso, null, 2)}).`);
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
    return `Cast(${this.device},${this.datatype.toJSON()})`
    // return {
    //   "module": "Cast",
    //   "device": this.device,
    //   "datatype": this.datatype,
    // }
  }

  /**
  * ingest: change the datadims.in.datatype
  */
  public ingest(dataflow:Dataflow):Dataflow {
    let flow = DataflowInOut(
      this.toString(),
      getDataflowDirection(dataflow.devices.out, this.device),
      dataflow.datadims.out,
      dataflow.ids.out,
      dataflow.rates.out
    );
    flow.ids.out.increment();
    flow.datadims.out.datatype = this.datatype;
    return flow;
  }
}
function Cast_fromObject(jso:Object) {
  // Handle string
  if(typeof jso == 'string') {
    let parsed:string[] = jso.match(/Cast\((CPU|GPU),(.+)\)/);
    if(parsed == null) {
      throw new Error(`Cast parse from 'string' object failed: "${jso}".`);
    }
    return new Cast(
      getDevice(parsed[1]),
      DataType_fromObject(parsed[2])
    );
  }

  // Handle JSObject
  [
    'device',
    'datatype',
  ].forEach(prop => {
    if(!jso.hasOwnProperty(prop)) {
      throw new Error(`Cast from JSObject: Missing '${prop}' property (${JSON.stringify(jso, null, 2)}).`);
    }
  });
  return new Cast(
    jso['device'],
    DataType_fromObject(jso['datatype'])
  );
}

class Channelize implements IModule{
  device: Device;
  rate: Numeric;

  constructor(
    device: Device,
    rate: Numeric
  ) {
    this.device = device;
    this.rate = rate;
  }

  /**
   * toString
   */
  public toString() {
    return  `Channelize(${this.rate.value})`;
  }

  /**
   * toJSON
   */
  public toJSON() {
    return `Channelize(${this.device},${this.rate})`
    // return {
    //   "module": "Channelize",
    //   "device": this.device,
    //   "rate": this.rate,
    // }
  }

  /**
  * ingest: upchannelize by a given rate
  */
  public ingest(dataflow:Dataflow):Dataflow {
    if(dataflow.datadims.in.timesamples.value % this.rate.value != 0) {
      throw new Error(
        `Channelizer rate (${this.rate}) not a factor of timesamples (${dataflow.datadims.in.timesamples}).`
      );
    }
    
    let flow = DataflowInOut(
      this.toString(),
      getDataflowDirection(dataflow.devices.out, this.device),
      dataflow.datadims.out,
      dataflow.ids.out,
      dataflow.rates.out
    );
    flow.ids.out.increment();
    flow.datadims.out.timesamples = new Numeric(`(${flow.datadims.out.timesamples})/(${this.rate})`);
    flow.datadims.out.channels = new Numeric(`(${flow.datadims.out.channels})*(${this.rate})`);
    return flow;
  }
}
function Channelize_fromObject(jso:Object) {
  // Handle string
  if(typeof jso == 'string') {
    let parsed:string[] = jso.match(/Channelize\((CPU|GPU),(.+)\)/);
    if(parsed == null) {
      throw new Error(`Channelize parse from 'string' object failed: "${jso}".`);
    }
    return new Channelize(
      getDevice(parsed[1]),
      new Numeric(parsed[2])
    );
  }

  // Handle JSObject
  [
    'device',
    'rate',
  ].forEach(prop => {
    if(!jso.hasOwnProperty(prop)) {
      throw new Error(`Channelize from JSObject: Missing '${prop}' property (${JSON.stringify(jso, null, 2)}).`);
    }
  });
  return new Channelize(
    jso['device'],
    jso['rate']
  );
}

class Detect implements IModule{
  device: Device;
  components: Numeric;
  
  constructor(
    device: Device,
    components: Numeric,
  ) {
    this.device = device;
    this.components = components;
  }

  /**
   * toString
   */
  public toString() {
    return  `Detect(${this.components.value})`;
  }

  /**
   * toJSON
   */
  public toJSON() {
    return `Detect(${this.device},${this.components})`
    // return {
    //   "module": "Detect",
    //   "device": this.device,
    //   "components": this.components,
    // }
  }

  /**
  * ingest: collapse the polarisations
  */
  public ingest(dataflow:Dataflow):Dataflow {    
    let flow = DataflowInOut(
      this.toString(),
      getDataflowDirection(dataflow.devices.out, this.device),
      dataflow.datadims.out,
      dataflow.ids.out,
      dataflow.rates.out
    );
    flow.ids.out.increment();
    flow.datadims.out.polarizations = this.components;
    return flow;
  }
}
function Detect_fromObject(jso:Object) {
  // Handle string
  if(typeof jso == 'string') {
    let parsed:string[] = jso.match(/Detect\((CPU|GPU),(.+)\)/);
    if(parsed == null) {
      throw new Error(`Detect parse from 'string' object failed: "${jso}".`);
    }
    return new Detect(
      getDevice(parsed[1]),
      new Numeric(parsed[2])
    );
  }

  // Handle JSObject
  [
    'device',
    'components',
  ].forEach(prop => {
    if(!jso.hasOwnProperty(prop)) {
      throw new Error(`Detect from JSObject: Missing '${prop}' property (${JSON.stringify(jso, null, 2)}).`);
    }
  });
  return new Detect(
    jso['device'],
    jso['components']
  );
}

class Gather implements IModule{
  device: Device;
  dimension: string;
  length: Numeric;

  constructor(
    device: Device,
    dimension: string,
    length: Numeric
  ) {
    this.device = device;
    this.dimension = dimension;
    this.length = length;
  }

  /**
   * toString
   */
  public toString() {
    return  `Gather(${this.dimension},${this.length.value})`;
  }

  /**
   * toJSON
   */
  public toJSON() {
    return `Gather(${this.device},${this.dimension},${this.length})`
    // return {
    //   "module": "Gather",
    //   "device": this.device,
    //   "dimension": this.dimension,
    //   "length": this.length,
    // }
  }

  /**
  * ingest: gather the `length` of `dimension`
  */
  public ingest(dataflow:Dataflow):Dataflow {    
    let inout_ratio = dataflow.datadims.out[this.dimension].value/this.length.value;
    let flow = DataflowInOut(
      this.toString(),
      getDataflowDirection(dataflow.devices.out, this.device),
      dataflow.datadims.out,
      dataflow.ids.out,
      dataflow.rates.out
    );
    flow.ids.out.increment();
    flow.rates.out *= inout_ratio;
    flow.datadims.out[this.dimension].value = this.length;
    return flow;
  }
}
function Gather_fromObject(jso:Object) {
  // Handle string
  if(typeof jso == 'string') {
    let parsed:string[] = jso.match(/Gather\((CPU|GPU),(\w+),(.+)\)/);
    if(parsed == null) {
      throw new Error(`Gather parse from 'string' object failed: "${jso}".`);
    }
    if(parsed[2].match(regex_DataDimension) == null) {
      throw new Error(`Gather dimension '${parsed[2]}' does not satisfy regex: ${regex_DataDimension}.`);
    }
    return new Gather(
      getDevice(parsed[1]),
      parsed[2],
      new Numeric(parsed[3])
    );
  }

  // Handle JSObject
  [
    'device',
    'dimension',
    'length',
  ].forEach(prop => {
    if(!jso.hasOwnProperty(prop)) {
      throw new Error(`Gather from JSObject: Missing '${prop}' property (${JSON.stringify(jso, null, 2)}).`);
    }
  });
  return new Gather(
    jso['device'],
    jso['dimension'],
    jso['length']
  );
}

class Integrate implements IModule{
  device: Device;
  dimension: string;
  length: Numeric;

  constructor(
    device: Device,
    dimension: string,
    length: Numeric
  ) {
    this.device = device;
    this.dimension = dimension;
    this.length = length;
  }

  /**
   * toString
   */
  public toString() {
    return  `Integrate(${this.dimension},${this.length.value})`;
  }

  /**
   * toJSON
   */
  public toJSON() {
    return `Integrate(${this.device},${this.dimension},${this.length})`
    // return {
    //   "module": "Integrate",
    //   "device": this.device,
    //   "device": this.dimension,
    //   "length": this.length,
    // }
  }

  /**
  * ingest: reduce the number of timesamples
  */
  public ingest(dataflow:Dataflow):Dataflow {
    let inout_ratio = dataflow.datadims.out[this.dimension].value/this.length.value;
    let flow = DataflowInOut(
      this.toString(),
      getDataflowDirection(dataflow.devices.out, this.device),
      dataflow.datadims.out,
      dataflow.ids.out,
      dataflow.rates.out
    );
    flow.ids.out.increment();
    flow.rates.out *= inout_ratio;
    flow.datadims.out[this.dimension].value = inout_ratio;
    return flow;
  }
}
function Integrate_fromObject(jso:Object) {
  // Handle string
  if(typeof jso == 'string') {
    let parsed:string[] = jso.match(/Integrate\((CPU|GPU),(\w+),(.+)\)/);
    if(parsed == null) {
      throw new Error(`Integrate parse from 'string' object failed: "${jso}".`);
    }
    if(parsed[2].match(regex_DataDimension) == null) {
      throw new Error(`Gather dimension '${parsed[2]}' does not satisfy regex: ${regex_DataDimension}.`);
    }
    return new Integrate(
      getDevice(parsed[1]),
      parsed[2],
      new Numeric(parsed[3])
    );
  }

  // Handle JSObject
  [
    'device',
    'dimension',
    'length',
  ].forEach(prop => {
    if(!jso.hasOwnProperty(prop)) {
      throw new Error(`Integrate from JSObject: Missing '${prop}' property (${JSON.stringify(jso, null, 2)}).`);
    }
  });
  return new Integrate(
    jso['device'],
    jso['dimension'],
    jso['length']
  );
}

class Loop implements IModule{
  device: Device;
  dimension: string;
  rate: Numeric;
  _pool: Pool;

  constructor(
    device: Device,
    dimension: string,
    rate: Numeric
  ) {
    this.device = device;
    this.dimension = dimension;
    this.rate = rate;
    this._pool = null;
  }

  /**
   * pool
   */
  public pool():Pool {
    this._pool = new Pool(this.device, this.dimension, undefined);
    return this._pool
  }

  /**
   * toString
   */
  public toString() {
    return  `Loop(${this.dimension},${this.rate.value})`;
  }

  /**
   * toJSON
   */
  public toJSON() {
    return `Loop(${this.device},${this.dimension},${this.rate})`
    // return {
    //   "module": "Loop",
    //   "device": this.device,
    //   "dimension": this.dimension,
    //   "rate": this.rate,
    // }
  }

  /**
  * ingest: reduce the number of timesamples
  */
  public ingest(dataflow:Dataflow):Dataflow {    
    if(dataflow.datadims.out[this.dimension].value % this.rate.value != 0) {
      throw new Error(`Loop rate ${this.rate.value} is not a factor of input '${this.dimension}': ${dataflow.datadims.out[this.dimension]}.`);
    }

    let inout_ratio = dataflow.datadims.out[this.dimension].value/this.rate.value;
    let flow = DataflowInOut(
      this.toString(),
      getDataflowDirection(dataflow.devices.out, this.device),
      dataflow.datadims.out,
      dataflow.ids.out,
      dataflow.rates.out
    );
    flow.ids.out.push();
    flow.rates.out *= inout_ratio;
    flow.datadims.out[this.dimension] = this.rate;

    if(this._pool != null) {
      this._pool.inverse_rate = new Numeric(inout_ratio);
    }

    return flow;
  }
}
function Loop_fromObject(jso:Object) {
  // Handle string
  if(typeof jso == 'string') {
    let parsed:string[] = jso.match(/Loop\((CPU|GPU),(\w+),(.+)\)/);
    if(parsed == null) {
      throw new Error(`Loop parse from 'string' object failed: "${jso}".`);
    }
    if(parsed[2].match(regex_DataDimension) == null) {
      throw new Error(`Loop dimension '${parsed[2]}' does not satisfy regex: ${regex_DataDimension}.`);
    }
    return new Loop(
      getDevice(parsed[1]),
      parsed[2],
      new Numeric(parsed[3])
    );
  }

  // Handle JSObject
  [
    'device',
    'dimension',
    'rate',
  ].forEach(prop => {
    if(!jso.hasOwnProperty(prop)) {
      throw new Error(`Loop from JSObject: Missing '${prop}' property (${JSON.stringify(jso, null, 2)}).`);
    }
  });
  return new Loop(
    jso['device'],
    jso['dimension'],
    jso['rate']
  );
}
class Pool implements IModule{
  device: Device;
  dimension: string;
  inverse_rate: Numeric;

  constructor(
    device: Device,
    dimension: string,
    inverse_rate: Numeric
  ) {
    this.device = device;
    this.dimension = dimension;
    this.inverse_rate = inverse_rate;
  }

  /**
   * toString
   */
  public toString() {
    return  `Pool(${this.dimension},${this.inverse_rate.value})`;
  }

  /**
   * toJSON
   */
  public toJSON() {
    return `Pool`
    // return {
    //   "module": "Pool",
    // }
  }

  /**
  * ingest: reduce the number of timesamples
  */
  public ingest(dataflow:Dataflow):Dataflow {
    let flow = DataflowInOut(
      this.toString(),
      getDataflowDirection(dataflow.devices.out, this.device),
      dataflow.datadims.out,
      dataflow.ids.out.pop(),
      dataflow.rates.out/this.inverse_rate.value
    );
    flow.ids.out.increment();
    flow.datadims.out[this.dimension] = new Numeric(`${flow.datadims.out[this.dimension]}*${this.inverse_rate}`);
    return flow;
  }
}

const module_examples:IModule[] = [
  new Beamform(Device.GPU, new Numeric(4)),
  new Cast(Device.CPU, CI8),
  new Channelize(Device.CPU, new Numeric(4)),
  new Detect(Device.CPU, new Numeric(4)),
  new Gather(Device.CPU, "dimension", new Numeric(4)),
  new Integrate(Device.CPU, "dimension", new Numeric(4)),
  new Loop(Device.CPU, "dimension", new Numeric(4)),
  new Pool(Device.CPU, "dimension", new Numeric(4)),
];