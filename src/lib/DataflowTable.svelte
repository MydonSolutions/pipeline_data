<script lang="ts">
  import type { Dataflow } from "../models/dataflow";
  import Tooltip from "./Tooltip.svelte";

  export let dataflows:Dataflow[];

  function round_decimals(num:number, decimals:number):number {
    return Math.round(num * 10**decimals)/10**decimals
  }

  function byte_string(bytes:number):string {
    if (bytes < 1e3) {
      return `${bytes} Bytes`;
    } else if (bytes < 1e6) {
      return `${(round_decimals(bytes, 3)/1e3).toFixed(3)} KB`;
    } else if (bytes < 1e9) {
      return `${(round_decimals(bytes, 3)/1e6).toFixed(3)} MB`;
    } else if (bytes < 1e12) {
      return `${(round_decimals(bytes, 3)/1e9).toFixed(3)} GB`;
    } else if (bytes < 1e16) {
      return `${(round_decimals(bytes, 3)/1e12).toFixed(3)} TB`;
    }
  }
</script>


<div class="dataflow">

  <div class="header" style="grid-column: 2;">
    Stage
  </div>
  <div class="header" style="grid-column: 3;">
    Stage Egress Bytes
  </div>
  <div class="header" style="grid-column: 4;">
    <Tooltip tip="(ASPECTS, CHANNELS, TIMESAMPLES, POLARIZATIONS, DATATYPE)">
      Stage Data Dimension
    </Tooltip>
  </div>
  <div class="header" style="grid-column: 5;">
    I/O Ratio (Relative)
  </div>
  <div class="header" style="grid-column: 6;">
    Throughput
  </div>

  {#each dataflows as flow, i}
    <div style="grid-column: 1;">
      #{i}:
    </div>
    <div style="grid-column: 2;">
      {flow.label}
    </div>
    <div style="grid-column: 3;" class={flow.direction.to}>
      <Tooltip tip={flow.direction.to}>
        {byte_string(flow.datadim_out.bytesize())}
        {#if i > 0}
          (x{round_decimals(flow.datadim_out.bytesize()/dataflows[i-1].datadim_out.bytesize(), 6)})
        {/if}
      </Tooltip>
    </div>
    <div style="grid-column: 4;">
      ({flow.datadim_out.aspects},
        {flow.datadim_out.channels},
        {flow.datadim_out.timesamples},
        {flow.datadim_out.polarizations},
        {flow.datadim_out.datatype.label})
    </div>
    <div style="grid-column: 5;">
      @ {flow.rate}
      {#if i > 0}
        (x{flow.rate/dataflows[i-1].rate})
      {/if}
    </div>
    <div style="grid-column: 6;">
      {byte_string(flow.rate*flow.datadim_out.bytesize())}
    </div>
  {/each}
</div>


<style>
  div.dataflow {
    display: grid;
    row-gap: 5px;
    margin-bottom: 10px;
  }
  div.header {
    border-bottom: 2px solid white;
    margin: 3px;
  }
  div.CPU {
    color: coral;
  }
  div.GPU {
    color: teal;
  }
</style>