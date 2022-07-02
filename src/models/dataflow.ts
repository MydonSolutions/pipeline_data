import type { DataDimension } from "./datadimensions";
import { Device } from "./device";

export {
  DataflowID,
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

class DataflowID {
  parts: number[]
  constructor (
    parts: number[]
  ) {
    this.parts = parts;
  }

  /**
   * length
   */
  public length():number {
    return this.parts.length;
  }

  /**
   * toString
   */
  public toString():string {
    return this.parts.join('.');
  }

  /**
   * increment
   */
  public increment():DataflowID {
    this.parts[this.parts.length-1] += 1;
    return this;
  }

  /**
   * push
   */
  public push():DataflowID {
    this.parts.push(1);
    return this;
  }

  /**
   * pop
   */
  public pop():DataflowID {
    this.parts.pop();
    return this;
  }

  /**
   * copy
   */
  public copy():DataflowID {
    return new DataflowID(this.parts.slice());
  }
}

class Dataflow {
  direction: DataflowDirection
  datadim_in: DataDimension
  datadim_out: DataDimension
  label: string
  id: DataflowID
  rate: number

  constructor(
    direction: DataflowDirection,
    datadim_in: DataDimension,
    datadim_out: DataDimension,
    label: string,
    id: DataflowID,
    rate: number,
  ) {
    this.direction = direction;
    this.datadim_in = datadim_in;
    this.datadim_out = datadim_out;
    this.label = label;
    this.id = id;
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
      this.id.copy(),
      this.rate,
    );
  }
}