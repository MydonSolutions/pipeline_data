export {
  Device, getDevice
}

enum Device {
  CPU = "CPU",
  GPU = "GPU",
}
function getDevice(device:string):Device {
  switch (device) {
    case "CPU":
      return Device.CPU;  
    case "GPU":
      return Device.GPU;  
    default:
      return undefined;
  }
}
