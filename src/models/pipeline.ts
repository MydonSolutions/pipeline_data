import type { DataDimension } from "./datadimensions";
import {
  Accumulate, Accumulate_fromObject,
  Beamform, Beamform_fromObject,
  Cast, Cast_fromObject,
  Channelize, Channelize_fromObject,
  Detect, Detect_fromObject,
  IModule
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
    label: string
  ) {
    this.modules = modules;
    this.label = label;
    this.error = undefined;
  }

  /**
   * copy
   */
  public copy() {
    return new Pipeline(
      this.modules,
      this.label,
    );
  }

  /**
    * ingest
    */
  public ingest(
    datadim:DataDimension
  ):DataDimension[] {
    this.error = undefined;

    let dataflow:DataDimension[] = [datadim];
    this.modules.forEach(module => {
      try {
        datadim = module.ingest(datadim);
      } catch (error:any) {
        console.log(error)
        this.error = error;
        return []
      }
      dataflow = [...dataflow, datadim];
    });
    return dataflow;
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
      default:
        throw new Error("Unrecognised Module!");
        break;
    }
  });
  return new Pipeline(modules, jso['label']);
}