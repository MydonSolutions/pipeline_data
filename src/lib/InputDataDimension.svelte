<script lang="ts">
  import { CI8 } from "../models/datatypes";
  import { DataDimension, DataDimension_fromObject } from "../models/datadimensions";
  import InputJson from "./InputJSON.svelte";

  export let datadim:DataDimension = new DataDimension(
    27,
    32,
    16384,
    2,
    CI8
  );

  let datadim_json = datadim;
  
  let error_message = undefined;
  function datadim_parse(event?:CustomEvent) {
    try {
      datadim = DataDimension_fromObject(event.detail);
      datadim_json = event.detail;
      error_message = undefined;
    } catch (error: any) {
      error_message = error;
    }
  }
</script>

<main>
  <InputJson
    title="Input DataDimension"
    value={JSON.stringify(datadim_json, null, 2)}
    on:parse={datadim_parse}
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