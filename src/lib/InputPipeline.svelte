<script lang="ts">
  import { Pipeline, Pipeline_fromObject } from "../models/pipeline";
  import InputJson from "./InputJSON.svelte";
  import pipeline_1 from "../assets/pipeline_1.json";
  import pipeline_2 from "../assets/pipeline_2.json";

  export let pipeline:Pipeline; 
  let error_message = undefined;
  let pipeline_jso:Object;

  function set_pipeline_json(json:Object){
    pipeline = Pipeline_fromObject(json);
    pipeline_jso = json;
  }
  
  function pipeline_parse(event?:CustomEvent) {
    try {
      set_pipeline_json(event.detail);
      error_message = undefined;
    } catch (error: any) {
      error_message = error;
    }
  }
  set_pipeline_json(pipeline_1);
</script>

<main>
  <div>
    <button on:click={()=>{set_pipeline_json(pipeline_1)}}>#1</button>
    <button on:click={()=>{set_pipeline_json(pipeline_2)}}>#2</button>
  </div>
  <InputJson 
    title="Pipeline"
    value={JSON.stringify(pipeline_jso, null, 2)}
    on:parse={pipeline_parse}
  />
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