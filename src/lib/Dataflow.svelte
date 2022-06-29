<script lang="ts">
  import type { Dataflow } from "../models/dataflow";
  import type { Pipeline } from "../models/pipeline";
  import type { DataDimension } from "../models/datadimensions";
  import DataflowTable from "./DataflowTable.svelte";

  export let pipeline:Pipeline = undefined;
  export let datadim:DataDimension = undefined;
  $: dataflows = pipeline == undefined ? [] : pipeline.ingest(datadim);

  function dataflowsBytestats(dataflows:Dataflow[]) {
    let bytestats = {
      "buses":{
        "PCI": 0.0,
      },
      "relative_throughput":{
        "CPU": 0.0,
        "GPU": 0.0,
      },
      "timeinvariant": {
        "CPU": 0.0,
        "GPU": 0.0,
      }
    }
    dataflows.forEach(flow => {
      if(flow.datadim_out != undefined){
        bytestats['timeinvariant'][flow.direction.to] += flow.datadim_out.bytesize();
        bytestats['relative_throughput'][flow.direction.to] += flow.datadim_out.bytesize()*flow.rate;
        if(flow.direction.to != flow.direction.from){
          bytestats['buses']['PCI'] += flow.datadim_out.bytesize()*flow.rate;
        }
      }
    });
    return bytestats;
  }
  $: dataflow_bytestats = dataflowsBytestats(dataflows);

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
  <DataflowTable {dataflows}/>
  {#if pipeline != undefined && pipeline.error != undefined}
    <div class="error">
      {pipeline.error}
    </div>
  {/if}
  <div class="dataflow_stats">
    <div style="grid-column: 1;">
      Time Invariant
    </div>
    <div style="grid-column: 2;">
      Throughput
    </div>

    <div style="grid-column: 1;">
      CPU: {byte_string(dataflow_bytestats.timeinvariant.CPU)}<br/>
      GPU: {byte_string(dataflow_bytestats.timeinvariant.GPU)}<br/>
    </div>
    <div style="grid-column: 2;">
      CPU: {byte_string(dataflow_bytestats.relative_throughput.CPU)}<br/>
      GPU: {byte_string(dataflow_bytestats.relative_throughput.GPU)}<br/>
      PCI: {byte_string(dataflow_bytestats.buses.PCI)}<br/>
    </div>
  </div>
</div>

<style>
  div.error {
    color: red;
    margin-bottom: 10px;
  }
  div.dataflow_stats {
    display: grid;
    row-gap: 5px;
    margin-bottom: 10px;
  }
</style>
