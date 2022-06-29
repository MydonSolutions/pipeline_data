<script lang="ts">
  import {
  Beamform,
  Cast,
  Channelize,
} from "../models/modules";
  import { COMP_FLOAT16, COMP_FLOAT32 } from "../models/datatypes";
  import { Pipeline, Pipeline_fromObject } from "../models/pipeline";
  import InputJson from "./InputJSON.svelte";

  export let pipeline:Pipeline = new Pipeline(
    [
      new Cast(COMP_FLOAT32),
      new Channelize(4),
      new Beamform(8),
      new Cast(COMP_FLOAT16),
    ],
    "Demo"
  );

  let textarea_pipeline_json = JSON.parse(JSON.stringify(pipeline));
  
  let error_message = undefined;
  function pipeline_parse() {
    try {
      pipeline = Pipeline_fromObject(textarea_pipeline_json);
      error_message = undefined;
    } catch (error: any) {
      error_message = error;
    }
  }
</script>

<main>
  <InputJson title="Pipeline" bind:value={textarea_pipeline_json} on:parse={pipeline_parse}/>
  {#if error_message != undefined}
    <div>
      {error_message}
    </div>
  {/if}
</main>

<style>
  main {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
</style>