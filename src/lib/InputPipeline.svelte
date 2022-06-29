<script lang="ts">
  import {
    Beamform,
    Cast,
    Channelize,
    GatherTime,
    LoopChannel,
  } from "../models/modules";
  import { CF16, CF32 } from "../models/datatypes";
  import { Pipeline, Pipeline_fromObject } from "../models/pipeline";
  import InputJson from "./InputJSON.svelte";
  import { Device } from "../models/device";

  export let pipeline:Pipeline = new Pipeline(
    [
      new GatherTime(Device.CPU, 262144),
      new LoopChannel(Device.CPU, 1),
      new Cast(Device.GPU, CF32),
      new Channelize(Device.GPU, 262144),
      new LoopChannel(Device.GPU, 32),
      new Beamform(Device.GPU, 8),
      new Cast(Device.GPU, CF16),
    ],
    "Demo",
    Device.CPU,
    1
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