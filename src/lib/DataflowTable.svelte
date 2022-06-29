<script lang="ts">
  import type { Dataflow } from "../models/dataflow";

  export let dataflows:Dataflow[];

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
    I/O Ratio
  </div>

  {#each dataflows as flow, i}
    <div style="grid-column: 1;">
      #{i}:
    </div>
    <div style="grid-column: 2;">
      {flow.label}
    </div>
    <div style="grid-column: 3;">
      {byte_string(flow.datadim_out.bytesize())} ({flow.direction.to})
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


<style>
  div.dataflow {
    display: grid;
    row-gap: 5px;
    margin-bottom: 10px;
  }
</style>