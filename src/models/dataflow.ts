import type { DataDimension } from "./datadimensions";
import type { Device } from "./device";

export {
  Dataflow,
  DataflowDirection
}

class DataflowDirection {
  from: Device
  to: Device

  constructor (
    from: Device,
    to: Device,
  ) {
    this.from = from;
    this.to = to;
  }

  /**
   * toString
   */
  public toString() {
    return `${this.from}->${this.to}`;
  }
}

class Dataflow {
  device: Device
  datadim_in: DataDimension
  datadim_out: DataDimension
  rate: number
  label: string

  constructor(
    device: Device,
    datadim_in: DataDimension,
    datadim_out: DataDimension,
    label: string,
    rate: number,
  ) {
    this.device = device;
    this.datadim_in = datadim_in;
    this.datadim_out = datadim_out;
    this.label = label;
    this.rate = rate;
  }

  /**
   * copy
   */
  public copy() {
    return new Dataflow(
      this.device,
      this.datadim_in.copy(),
      this.datadim_out.copy(),
      this.label,
      this.rate,
    );
  }
}