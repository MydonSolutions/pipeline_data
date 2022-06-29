<script lang="ts">
  import type { Pipeline } from "src/models/pipeline";
  import type { DataDimension } from "../models/datadimensions";

  export let pipeline:Pipeline = undefined;
  export let datadim:DataDimension = undefined;
  $: dataflow = pipeline.ingest(datadim);
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
          {data.bytesize()} Bytes
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
</style>
