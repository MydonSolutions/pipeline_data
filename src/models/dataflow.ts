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
  direction: DataflowDirection
  datadimension: DataDimension
  rate: number
  label: string
  constructor(
    direction: DataflowDirection,
    datadimension: DataDimension,
    label: string,
    rate: number,
  ) {
    this.direction = direction
    this.datadimension = datadimension
    this.label = label
    this.rate = rate
  }
}