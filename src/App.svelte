<script lang="ts">
  import {
    Accumulate,
    Beamform,
    Cast,
    Channelize,
    Detect
  } from "./models/modules";
  import { COMP_FLOAT16, COMP_FLOAT32, COMP_INT8, DataType_fromObject } from "./models/datatypes";
  import { DataDimension, DataDimension_fromObject } from "./models/datadimensions";
  import Pipeline from "./lib/Pipeline.svelte";
import InputJson from "./lib/InputJSON.svelte";

  let pipeline = [
    new Cast(COMP_FLOAT32),
    new Channelize(4),
    new Beamform(8),
    new Cast(COMP_FLOAT16),
  ]

  let textarea_datadim_json:string = JSON.stringify(
    new DataDimension(
      20,
      768,
      8192,
      2,
      COMP_INT8
    ),
    null,
    2
  );
  
  $: datadim = DataDimension_fromObject(JSON.parse(textarea_datadim_json));
</script>

<main>
  <h1>Pipeline Dataflow View</h1>
  <div class="inputs">
    <InputJson title="Input DataDimension" bind:value={textarea_datadim_json}/>
  </div>
  <Pipeline {pipeline} {datadim}/>
</main>

<style>
  :root {
    font-family: Roboto;
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
