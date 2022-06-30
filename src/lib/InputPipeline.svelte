<script lang="ts">
  import { Pipeline, Pipeline_fromObject } from "../models/pipeline";
  import InputJson from "./InputJSON.svelte";
  import pipeline_1 from "../assets/pipeline_1.json";

  export let pipeline:Pipeline; 
  let textarea_pipeline_json = pipeline_1;
  let error_message = undefined;
  pipeline_parse();
  
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