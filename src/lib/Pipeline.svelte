<script lang="ts">
  import type { DataDimension } from "../models/datadimensions";
  import type { IModule } from "../models/modules";

  let error_message = undefined;

  function pipeline_dataflow(
    pipeline:IModule[],
    datadim:DataDimension
  ):DataDimension[] {
    error_message = undefined;

    let dataflow:DataDimension[] = [datadim];
    for (let index = 0; index < pipeline.length; index++) {
      const module = pipeline[index];
      try {
        datadim = module.ingest(datadim);
      } catch (error:any) {
        console.log(error)
        error_message = error;
        return []
      }
      dataflow = [...dataflow, datadim];
    }
    return dataflow;
  }

  export let pipeline:IModule[] = [];
  export let datadim:DataDimension = undefined;
  $: dataflow = pipeline_dataflow(pipeline, datadim);
</script>

<div>
  {#if error_message != undefined}
    {error_message}
  {:else}
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
  {/if}
</div>

<style>
</style>
