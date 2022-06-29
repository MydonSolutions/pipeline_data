<script lang="ts">
  import {
    Accumulate, Accumulate_fromObject,
    Beamform, Beamform_fromObject,
    Cast, Cast_fromObject,
    Channelize, Channelize_fromObject,
    Detect, Detect_fromObject,
    IModule
  } from "./models/modules";
  import { COMP_FLOAT16, COMP_FLOAT32, COMP_INT8 } from "./models/datatypes";
  import { DataDimension, DataDimension_fromObject } from "./models/datadimensions";
  import Pipeline from "./lib/Pipeline.svelte";
  import InputJson from "./lib/InputJSON.svelte";

  function Pipeline_fromObject(jsos:Object[]):IModule[] {
    let pipeline:IModule[] = [];
    jsos.forEach(module => {
      switch (module['module']) {
        case 'Accumulate':
          pipeline = [...pipeline, Accumulate_fromObject(module)];
          break;
        case 'Beamform':
          pipeline = [...pipeline, Beamform_fromObject(module)];
          break;
        case 'Cast':
          pipeline = [...pipeline, Cast_fromObject(module)];
          break;
        case 'Channelize':
          pipeline = [...pipeline, Channelize_fromObject(module)];
          break;
        case 'Detect':
          pipeline = [...pipeline, Detect_fromObject(module)];
          break;
        default:
          throw new Error("Unrecognised Module!");
          break;
      }
    });
    return pipeline;
  }

  let textarea_pipeline_json:IModule[] = JSON.parse(JSON.stringify(
    [
      new Cast(COMP_FLOAT32),
      new Channelize(4),
      new Beamform(8),
      new Cast(COMP_FLOAT16),
    ],
    null,
    2
  ));
  $: pipeline = Pipeline_fromObject(textarea_pipeline_json);

  let textarea_datadim_json:DataDimension = new DataDimension(
    20,
    768,
    8192,
    2,
    COMP_INT8
  );
  $: datadim = DataDimension_fromObject(textarea_datadim_json);
</script>

<main>
  <h1>Pipeline Dataflow View</h1>
  <div class="inputs">
    <InputJson title="Pipeline" bind:value={textarea_pipeline_json}/>
    <InputJson title="Input DataDimension" bind:value={textarea_datadim_json}/>
  </div>
  <Pipeline {pipeline} {datadim}/>
</main>

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: black;
    color: white;
  }

  main {
    text-align: center;
    padding: 1em;
    margin: 0 auto;
  }

  h1 {
    color: white;
    text-transform: uppercase;
    font-size: 4rem;
    font-weight: 100;
    line-height: 1.1;
    margin: 2rem auto;
    max-width: 14rem;
  }

  div.inputs {
    width:100%;
    height:250px;
    display:flex;
    justify-content: space-around;
  }

  @media (min-width: 480px) {
    h1 {
      max-width: none;
    }

    p {
      max-width: none;
    }
  }
</style>
