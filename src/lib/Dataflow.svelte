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
      "devices": {
        "CPU": 0.0,
        "GPU": 0.0,
        "PCI_H2D": 0.0,
        "PCI_D2H": 0.0,
      }
    }
    dataflows.forEach(flow => {
      bytestats['devices'][flow.device] += flow.datadim_out.bytesize();
      if (flow.device == Device.CPU || flow.device == Device.GPU) {
        bytestats['devices'][flow.device] += flow.datadim_in.bytesize();
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
  <div class="dataflow">

    <div style="grid-column: 1;">
    </div>
    <div style="grid-column: 2;">
      Stage
    </div>
    <div style="grid-column: 3;">
      Ingest Bytes
    </div>
    <div style="grid-column: 4;">
      (ASPECTS, CHANNELS, TIMESAMPLES, POLARIZATIONS, DATATYPE)
    </div>
    <div style="grid-column: 5;">
      Ingest Rate
    </div>

    {#each dataflow as flow, i}
      <div style="grid-column: 1;">
        #{i}:
      </div>
      <div style="grid-column: 2;">
        {flow.label}
      </div>
      <div style="grid-column: 3;">
        {byte_string(flow.datadim_out.bytesize())} ({flow.device})
      </div>
      <div style="grid-column: 4;">
        ({flow.datadim_out.aspects},
          {flow.datadim_out.channels},
          {flow.datadim_out.timesamples},
          {flow.datadim_out.polarizations},
          {flow.datadim_out.datatype.label}
        )
      </div>
      <div style="grid-column: 5;">
        @ {flow.rate}
      </div>
    {/each}
  </div>
  {#if pipeline != undefined && pipeline.error != undefined}
    <div class="error">
      {pipeline.error}
    </div>
  {/if}
  <div class="dataflow_stats">
    PCI_H2D: {byte_string(dataflow_bytestats.devices.PCI_H2D)}<br/>
    PCI_D2H: {byte_string(dataflow_bytestats.devices.PCI_D2H)}<br/>
    CPU: {byte_string(dataflow_bytestats.devices.CPU)}<br/>
    GPU: {byte_string(dataflow_bytestats.devices.GPU)}<br/>
  </div>
</div>

<style>
  div.dataflow {
    display: grid;
    row-gap: 5px;
    margin-bottom: 10px;
  }
  div.error {
    color: red;
    margin-bottom: 10px;
  }

</style>
