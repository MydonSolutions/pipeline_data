<script lang="ts">
  import type { Pipeline } from "src/models/pipeline";
  import type { DataDimension } from "../models/datadimensions";

  export let pipeline:Pipeline = undefined;
  export let datadim:DataDimension = undefined;
  $: dataflow = pipeline.ingest(datadim);

  function round_decimals(num:number, decimals:number):number {
    return Math.round(num * 10**decimals)/10**decimals
  }

  function byte_string(bytes:number):string {
    if (bytes < 1e3) {
      return `${bytes} Bytes`;
    } else if (bytes < 1e6) {
      return `${(round_decimals(bytes, 6)/1e3).toFixed(3)} KBytes`;
    } else if (bytes < 1e9) {
      return `${(round_decimals(bytes, 6)/1e6).toFixed(6)} MBytes`;
    } else if (bytes < 1e12) {
      return `${(round_decimals(bytes, 6)/1e9).toFixed(6)} GBytes`;
    } else if (bytes < 1e16) {
      return `${(round_decimals(bytes, 6)/1e12).toFixed(6)} TBytes`;
    }
  }
</script>

<div>
  {#if pipeline != undefined && pipeline.error != undefined}
    {pipeline.error}
  {:else}
    <ul>
      {#each dataflow as data, i}
        <li>
          <br/>
          #{i}: {#if i ==0}
            Input
          {:else}
            {pipeline.modules[i-1]}
          {/if}
          <br/>
          aspects: {data.aspects},
          channels: {data.channels},
          timesamples: {data.timesamples},
          polarizations: {data.polarizations},
          datatype: {data.datatype.label}
          <br/>
          {byte_string(data.bytesize())}
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
</style>
