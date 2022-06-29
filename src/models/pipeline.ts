import type { DataDimension } from "./datadimensions";
import { Dataflow, getDataflowDirection } from "./dataflow";
import type { Device } from "./device";
import {
  IModule,
  Accumulate_fromObject,
  Beamform_fromObject,
  Cast_fromObject,
  Channelize_fromObject,
  Detect_fromObject,
  GatherTime_fromObject,
} from "./modules";

export {
  Pipeline, Pipeline_fromObject
}

class Pipeline {
  modules: IModule[];
  label: string;
  device: Device;
  error: Error;

  constructor(
    modules: IModule[],
    label: string,
    device: Device,
  ) {
    this.modules = modules;
    this.label = label;
    this.device = device;
    this.error = undefined;
  }

  /**
   * transfer
   */
  private transfer(to:Device, dataflow:Dataflow):Dataflow {
    return new Dataflow(
      getDataflowDirection(dataflow.direction.to, to),
      dataflow.datadim_out.copy(),
      dataflow.datadim_out.copy(),
      `Transfer(${dataflow.direction.to}->${to})`,
      dataflow.rate
    );
  }

  /**
    * ingest
    */
  public ingest(
    datadim:DataDimension,
  ):Dataflow[] {
    this.error = undefined;

    let dataflow = new Dataflow(
      getDataflowDirection(this.device, this.device),
      undefined,
      datadim,
      "Input",
      1.0
    );
    let dataflows:Dataflow[] = [dataflow];
    
    try {
      this.modules.forEach(module => {
        if(module.device != dataflow.direction.to) {
          dataflow = this.transfer(module.device, dataflow);
          dataflows = [
            ...dataflows,
            dataflow.copy()
          ];
          dataflow.direction.to = module.device;
        }
  
        dataflow = module.ingest(dataflow);
  
        dataflows = [
          ...dataflows,
          dataflow
        ];
      });
    } catch(error:any) {
      console.log(error)
      this.error = error;
    }
    
    if(this.device != dataflow.direction.to) {
      dataflow = this.transfer(this.device, dataflow);
      dataflows = [
        ...dataflows,
        dataflow
      ];
    }
     
    return dataflows;
 }
}
function Pipeline_fromObject(jso:Object):Pipeline {
  [
    'modules',
    'label',
    'device',
  ].forEach(prop => {
    if(!jso.hasOwnProperty(prop)) {
      throw new Error(`DataType from JSObject: Missing '${prop}' property (${jso}).`);
    }
  });

  let modules:IModule[] = [];
  jso['modules'].forEach(module => {
    switch (module['module']) {
      case 'Accumulate':
        modules = [...modules, Accumulate_fromObject(module)];
        break;
      case 'Beamform':
        modules = [...modules, Beamform_fromObject(module)];
        break;
      case 'Cast':
        modules = [...modules, Cast_fromObject(module)];
        break;
      case 'Channelize':
        modules = [...modules, Channelize_fromObject(module)];
        break;
      case 'Detect':
        modules = [...modules, Detect_fromObject(module)];
        break;
      case 'GatherTime':
        modules = [...modules, GatherTime_fromObject(module)];
        break;
      default:
        throw new Error("Unrecognised Module!");
        break;
    }
  });
  return new Pipeline(modules, jso['label'], jso['device']);
}