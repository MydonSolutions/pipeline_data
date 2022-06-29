import type { DataDimension } from "./datadimensions";
import { Device } from "./device";

export {
  Dataflow,
  DataflowDirection,
  getDataflowDirection
}

enum DataflowDirection {
  CPU2CPU = "CPU->CPU",
  CPU2GPU = "CPU->GPU",
  GPU2GPU = "GPU->GPU",
  GPU2CPU = "GPU->CPU"
}

function getDataflowDirection(from:Device, to:Device) {
  if(from == Device.CPU) {
    switch (to) {
      case Device.CPU:
        return DataflowDirection.CPU2CPU
      case Device.GPU:
        return DataflowDirection.CPU2GPU
    }
  }
  else if(from == Device.GPU) {
    switch (to) {
      case Device.GPU:
        return DataflowDirection.GPU2GPU
      case Device.CPU:
        return DataflowDirection.GPU2CPU
    }
  }
}

class Dataflow {
  direction: DataflowDirection
  datadimension: DataDimension
  label: string
  constructor(
    direction: DataflowDirection,
    datadimension: DataDimension,
    label: string,
  ) {
    this.direction = direction
    this.datadimension = datadimension
    this.label = label
  }
}