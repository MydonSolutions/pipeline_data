<script lang="ts">
  import { Pipeline, Pipeline_fromObject } from "../models/pipeline";
  import InputJson from "./InputJSON.svelte";
  import _pipelines from "../assets/pipelines.json";

  export let pipeline:Pipeline; 
  const pipelines:Object[] = _pipelines;
  let error_message = undefined;
  let pipeline_jso:string;

  function set_pipeline_json(jso:object){
    // set if json of pipelines differs,
    //  so that unimpactful changes in the InputJSON
    //  aren't overridden useless assigns to `pipeline`
    if(JSON.stringify(jso) != pipeline_jso){
      pipeline = Pipeline_fromObject(jso);
      pipeline_jso = JSON.stringify(jso);
    }
  }
  
  function pipeline_parse(event?:CustomEvent) {
    try {
      set_pipeline_json(event.detail);
      error_message = undefined;
    } catch (error: any) {
      error_message = error;
    }
  }
  set_pipeline_json(pipelines[0]);
</script>

<main>
  <div class="button-tray">
    {#each pipelines as _, i}
    <button on:click={()=>{set_pipeline_json(pipelines[i])}}>#{i+1}</button>
    {/each}
  </div>
  <div class="json">
    <InputJson 
      title="Pipeline"
      value={JSON.stringify(pipeline, null, 2)}
      on:parse={pipeline_parse}
    />
    {#if error_message != undefined}
      <div>
        {error_message}
      </div>
    {/if}
  </div>
</main>

<style>
  main {
    width: 100%;
    height: 100%;
    display: flex;
  }
  div.json {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  div.button-tray {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }
</style>