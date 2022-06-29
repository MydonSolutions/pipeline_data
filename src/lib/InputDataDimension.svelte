<script lang="ts">
  import { COMP_INT8 } from "../models/datatypes";
  import { DataDimension, DataDimension_fromObject } from "../models/datadimensions";
  import InputJson from "./InputJSON.svelte";

  export let datadim:DataDimension = new DataDimension(
    20,
    768,
    8192,
    2,
    COMP_INT8
  );

  let textarea_datadim_json = datadim;
  
  let error_message = undefined;
  function datadim_parse() {
    try {
      datadim = DataDimension_fromObject(textarea_datadim_json);
      error_message = undefined;
    } catch (error: any) {
      error_message = error;
    }
  }
</script>

<main>
  <InputJson title="Input DataDimension" bind:value={textarea_datadim_json} on:parse={datadim_parse}/>
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