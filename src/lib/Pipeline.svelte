<script lang="ts">
  import type { DataDimension } from "../models/datadimensions";
  import type { IModule } from "../models/modules";

  function pipeline_dataflow(
    pipeline:IModule[],
    datadim:DataDimension
  ):DataDimension[] {
    let dataflow:DataDimension[] = [datadim];
    for (let index = 0; index < pipeline.length; index++) {
      const module = pipeline[index];
      datadim = module.ingest(datadim);
      dataflow = [...dataflow, datadim];
    }
    return dataflow;
  }

  export let pipeline:IModule[] = [];
  export let datadim:DataDimension = undefined;
  $: dataflow = pipeline_dataflow(pipeline, datadim);
</script>

<ul>
  {#each dataflow as data, i}
    <li>
      <br/>
      #{i}: {#if i ==0}
        Input
      {:else}
        {pipeline[i-1]}
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

<style>
</style>
