import type { DataDimension } from "./datadimensions";
import { Device } from "./device";

export {
  Dataflow,
  getDataflowDirection
}
export type {
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

const DataflowDirections = {
  RAM: new DataflowDirection(Device.CPU, Device.CPU),
  VRAM: new DataflowDirection(Device.GPU, Device.GPU),
  PCI_H2D: new DataflowDirection(Device.CPU, Device.GPU),
  PCI_D2H: new DataflowDirection(Device.GPU, Device.CPU),
}

function getDataflowDirection(from:Device, to:Device) {
  if (from == to) {
    switch (from) {
      case Device.CPU:
        return DataflowDirections.RAM;
      case Device.GPU:
        return DataflowDirections.VRAM;
    }
  }
  else if (from != to) {
    switch (from) {
      case Device.CPU:
        return DataflowDirections.PCI_H2D;
      case Device.GPU:
        return DataflowDirections.PCI_D2H;
    }
  }
}

class Dataflow {
  direction: DataflowDirection
  datadim_in: DataDimension
  datadim_out: DataDimension
  label: string
  rate: number

  constructor(
    direction: DataflowDirection,
    datadim_in: DataDimension,
    datadim_out: DataDimension,
    label: string,
    rate: number,
  ) {
    this.direction = direction;
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
      this.direction,
      this.datadim_in.copy(),
      this.datadim_out.copy(),
      this.label,
      this.rate,
    );
  }
}