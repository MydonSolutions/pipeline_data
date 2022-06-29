import type { DataType } from "./datatypes";
import type { DataDimension } from "./datadimensions";
export {
  Accumulate,
  Beamform,
  Cast,
  Channelize,
  Detect,
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
  * ingest: reduce the number of timesamples
  */
  public ingest(datadim:DataDimension):DataDimension {    
    let outdim = datadim.copy();
    outdim.timesamples /= this.length;
    return outdim;
  }
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
  * ingest: change the number of sources (from antenna to beams)
  */
  public ingest(datadim:DataDimension):DataDimension {    
    let outdim = datadim.copy();
    outdim.aspects = this.beams;
    return outdim;
  }
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
  * ingest: change the DataDimension.datatype
  */
  public ingest(datadim:DataDimension):DataDimension {
    let outdim = datadim.copy();
    outdim.datatype = this.datatype;
    return outdim;
  }
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
  * ingest: upchannelize by a given rate
  */
  public ingest(datadim:DataDimension):DataDimension {
    if (datadim.timesamples % this.rate != 0) {
      throw new Error("Rate not a factor of timesamples.");
    }
    
    let outdim = datadim.copy();
    outdim.timesamples /= this.rate;
    outdim.channels *= this.rate;
    return outdim;
  }
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
  * ingest: collapse the polarisations
  */
  public ingest(datadim:DataDimension):DataDimension {    
    let outdim = datadim.copy();
    outdim.polarizations = this.components;
    return outdim;
  }
}
