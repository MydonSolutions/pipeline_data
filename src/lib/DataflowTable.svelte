<script lang="ts">
  import type { Dataflow } from "../models/dataflow";
  import { byte_string, ratio_string } from "./string_helpers";
  import Tooltip from "./Tooltip.svelte";

  export let dataflows:Dataflow[];
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
    <div style="grid-column: 1; text-align: end; padding-right: 0.5em; border-right: 1px solid #ffffff22">
      {#if flow.label.startsWith('Loop')}
        +
      {:else if flow.label.startsWith('Pool')}
        -
      {:else}
        #
      {/if}
      {flow.ids.in.toString()}:
    </div>
    <div style="grid-column: 2; text-align: start; padding-left: {0.25 + 0.75*(flow.ids.in.length()-1)}em;">
      {flow.label}
    </div>
    <div style="grid-column: 3;" class={flow.devices.out}>
      <Tooltip tip={flow.devices.out}>
        {byte_string(flow.datadims.out.bytesize())}
        {#if flow.rates.in != flow.rates.out}
          ({ratio_string(flow.datadims.out.bytesize()/dataflows[i-1].datadims.out.bytesize())})
        {/if}
      </Tooltip>
    </div>
    <div style="grid-column: 4;">
      ({flow.datadims.out.aspects},
        {flow.datadims.out.channels},
        {flow.datadims.out.timesamples},
        {flow.datadims.out.polarizations},
        {flow.datadims.out.datatype.label})
    </div>
    <div style="grid-column: 5;">
      {ratio_string(flow.rates.out)}
      {#if i > 0 && flow.rates.out != dataflows[i-1].rates.out}
        ({ratio_string(flow.rates.out/dataflows[i-1].rates.out)})
      {/if}
    </div>
    <div style="grid-column: 6;">
      {byte_string(flow.rates.out*flow.datadims.out.bytesize())}
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