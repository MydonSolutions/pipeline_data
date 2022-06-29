<script lang="ts">
  import type { Dataflow } from "../models/dataflow";
  import type { Pipeline } from "../models/pipeline";
  import type { DataDimension } from "../models/datadimensions";
  import { Device } from "../models/device";

  export let pipeline:Pipeline = undefined;
  export let datadim:DataDimension = undefined;
  $: dataflow = pipeline == undefined ? [] : pipeline.ingest(datadim);

  function dataflowsBytestats(dataflows:Dataflow[]) {
    let bytestats = {
      "pcie": 0.0,
      "devices": {
        "CPU": 0.0,
        "GPU": 0.0,
      }
    }
    dataflows.forEach(flow => {
      if(flow.direction.from != flow.direction.to) {
        bytestats['pcie'] += flow.datadimension.bytesize();
      }
      if(flow.direction.to == Device.CPU) {
        bytestats['devices']['CPU'] += flow.datadimension.bytesize();
      }
      if(flow.direction.to == Device.GPU) {
        bytestats['devices']['GPU'] += flow.datadimension.bytesize();
      }
    });
    return bytestats;
  }
  $: dataflow_bytestats = dataflowsBytestats(dataflow);

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
    (aspects, channels, timesamples, polarizations, datatype)
    <div class="dataflow">
      {#each dataflow as flow, i}
        <div class="flow">
          #{i}: {flow.label}
          <br/>
          {byte_string(flow.datadimension.bytesize())} {flow.direction}
          <br/>
          ({flow.datadimension.aspects},
            {flow.datadimension.channels},
            {flow.datadimension.timesamples},
            {flow.datadimension.polarizations},
            {flow.datadimension.datatype.label}
          )
          <br/>
        </div>
      {/each}
    </div>
    <div class="dataflow_stats">
      PCIe: {byte_string(dataflow_bytestats.pcie)}
      CPU: {byte_string(dataflow_bytestats.devices.CPU)}
      GPU: {byte_string(dataflow_bytestats.devices.GPU)}
    </div>
  {/if}
</div>

<style>
  div.dataflow {
    display: flex;
    flex-direction: column;
  }

  div.flow {
    padding: 0.5%;
  }
</style>
