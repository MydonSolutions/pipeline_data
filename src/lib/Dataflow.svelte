<script lang="ts">
  import type { Dataflow } from "../models/dataflow";
  import type { Pipeline } from "../models/pipeline";
  import type { DataDimension } from "../models/datadimensions";
  import DataflowTable from "./DataflowTable.svelte";
  import { byte_string} from "./string_helpers";

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
      bytestats['timeinvariant'][flow.devices.out] += flow.datadims.out.bytesize();
      bytestats['relative_throughput'][flow.devices.out] += flow.datadims.out.bytesize()*flow.rates.out;
      if(flow.devices.in != flow.devices.out){
        bytestats['buses']['PCI'] += flow.datadims.out.bytesize()*flow.rates.out;
      }
    });
    return bytestats;
  }
  $: dataflow_bytestats = dataflowsBytestats(dataflows);
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
      Time Invariant Bytes
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
