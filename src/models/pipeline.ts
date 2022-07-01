import type { DataDimension } from "./datadimensions";
import { Dataflow, getDataflowDirection } from "./dataflow";
import type { Device } from "./device";
import {
  IModule,
  Integrate_fromObject,
  Beamform_fromObject,
  Cast_fromObject,
  Channelize_fromObject,
  Detect_fromObject,
  Gather_fromObject,
  LoopChannel_fromObject,
} from "./modules";

export {
  Pipeline, Pipeline_fromObject
}

class Pipeline {
  label: string;
  device: Device;
  ingestrate: number;
  modules: IModule[];
  error: Error;

  constructor(
    modules: IModule[],
    label: string,
    device: Device,
    ingestrate: number,
  ) {
    this.modules = modules;
    this.label = label;
    this.device = device;
    this.ingestrate = ingestrate;
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
      this.ingestrate
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
    'ingestrate',
  ].forEach(prop => {
    if(!jso.hasOwnProperty(prop)) {
      throw new Error(`DataType from JSObject: Missing '${prop}' property (${jso}).`);
    }
  });

  let modules:IModule[] = [];
  jso['modules'].forEach(module => {
    let module_obj = null;
    let identifier = null;
    if (typeof module == 'string') {
      identifier = module.split('(')[0];
    }
    else {
      // Assume JSObject, with module string field.
      identifier = module['module'];
    }
    switch (identifier) {
      case 'Integrate':
        module_obj = Integrate_fromObject(module);
        break;
      case 'Beamform':
        module_obj = Beamform_fromObject(module);
        break;
      case 'Cast':
        module_obj = Cast_fromObject(module);
        break;
      case 'Channelize':
        module_obj = Channelize_fromObject(module);
        break;
      case 'Detect':
        module_obj = Detect_fromObject(module);
        break;
      case 'Gather':
        module_obj = Gather_fromObject(module);
        break;
      case 'LoopChannel':
        module_obj = LoopChannel_fromObject(module);
        break;
      default:
        break;
    }
    if(module_obj == null) {
      throw new Error(`Unrecognised Module: ${module}`);
    }
    modules = [...modules, module_obj];
  });
  return new Pipeline(modules, jso['label'], jso['device'], jso['ingestrate']);
}