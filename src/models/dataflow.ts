import type { DataDimension } from "./datadimensions";
import { Device } from "./device";

export {
  IOPair,
  Dataflow,
  DataflowInOut,
  DataflowID,
  getDataflowDirection,
}

class IOPair<T> {
  in: T
  out: T
  constructor (
    input: T,
    output: T
  ) {
    this.in = input;
    this.out = output;
  }
  
  /**
   * toString
   */
   public toString() {
    return `${this.in}->${this.out}`;
  }

  /**
   * copy
   */
  public copy() {
    return new IOPair<T>(this.in, this.out);
  }
}


const DataflowDirections = {
  RAM: new IOPair<Device>(Device.CPU, Device.CPU),
  VRAM: new IOPair<Device>(Device.GPU, Device.GPU),
  PCI_H2D: new IOPair<Device>(Device.CPU, Device.GPU),
  PCI_D2H: new IOPair<Device>(Device.GPU, Device.CPU),
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
  label: string
  devices: IOPair<Device>
  datadims: IOPair<DataDimension>
  ids: IOPair<DataflowID>
  rates: IOPair<number>

  constructor(
    label: string,
    devices: IOPair<Device>,
    datadims: IOPair<DataDimension>,
    ids: IOPair<DataflowID>,
    rates: IOPair<number>,
  ) {
    this.label = label;
    this.devices = devices;
    this.datadims = datadims;
    this.ids = ids;
    this.rates = rates;
  }

  /**
   * copy
   */
  public copy() {
    return new Dataflow(
      this.label,
      this.devices.copy(),
      this.datadims.copy(),
      this.ids.copy(),
      this.rates,
    );
  }
}

// Supporting constructor for module ingest
function DataflowInOut(
  label: string,
  devices: IOPair<Device>,
  datadim: DataDimension,
  id: DataflowID,
  rate: number,
):Dataflow {
  return new Dataflow(
    label,
    devices,
    new IOPair<DataDimension>(
      datadim,
      datadim.copy(),
    ),
    new IOPair<DataflowID>(
      id,
      id.copy(),
    ),
    new IOPair<number>(
      rate,
      rate,
    ),
  );
}