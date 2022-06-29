import type { DataDimension } from "./datadimensions";
import { Dataflow, DataflowDirection } from "./dataflow";
import { Device } from "./device";
import {
  Accumulate_fromObject,
  Beamform_fromObject,
  Cast_fromObject,
  Channelize_fromObject,
  Detect_fromObject,
  TimeGather_fromObject,
  IModule,
} from "./modules";

export {
  Pipeline, Pipeline_fromObject
}

class Pipeline {
  modules: IModule[];
  label: string;
  error: Error;

  constructor(
    modules: IModule[],
    label: string,
  ) {
    this.modules = modules;
    this.label = label;
    this.error = undefined;
  }

  /**
    * ingest
    */
  public ingest(
    datadim:DataDimension
  ):Dataflow[] {
    let dataflow = new Dataflow(
      new DataflowDirection(Device.CPU, Device.CPU),
      datadim,
      "Input",
      1.0
    );
    let dataflows:Dataflow[] = [dataflow];

    this.modules.forEach(module => {
      try {
        dataflow = module.ingest(dataflow);
        this.error = undefined;
      } catch (error:any) {
        console.log(error)
        this.error = error;
        return []
      }

      dataflows = [
        ...dataflows,
        dataflow
      ];
    });
    return dataflows;
 }
}
function Pipeline_fromObject(jso:Object):Pipeline {
  [
    'modules',
    'label',
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
      case 'TimeGather':
        modules = [...modules, TimeGather_fromObject(module)];
        break;
      default:
        throw new Error("Unrecognised Module!");
        break;
    }
  });
  return new Pipeline(modules, jso['label']);
}