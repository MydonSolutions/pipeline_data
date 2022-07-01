<script lang="ts">
  import { Pipeline, Pipeline_fromObject } from "../models/pipeline";
  import InputJson from "./InputJSON.svelte";
  import _pipelines from "../assets/pipelines.json";

  export let pipeline:Pipeline; 
  let pipelines:Object[] = _pipelines;
  let error_message = undefined;
  let cache_jso:Object;
  let cache_json:string;

  function set_pipeline_json(jso:object){
    // set if json of pipelines differs,
    //  so that unimpactful changes in the InputJSON
    //  aren't overridden useless assigns to `pipeline`
    let json = JSON.stringify(jso);
    if(json != cache_json){
      pipeline = Pipeline_fromObject(jso);
      cache_jso = jso;
      cache_json = json;
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
    {#each pipelines as pipeline, i}
    <button on:click={()=>{set_pipeline_json(pipelines[i])}}>{pipeline['label']}</button>
    {/each}
    <button on:click={()=>{pipelines = [...pipelines, cache_jso];}}>+</button>
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