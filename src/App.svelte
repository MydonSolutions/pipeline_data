<script lang="ts">
  import {
    Accumulate,
    Beamform,
    Cast,
    Channelize,
    Detect
  } from "./models/modules";
  import { COMP_FLOAT16, COMP_FLOAT32, COMP_INT8 } from "./models/datatypes";
import { DataDimension } from "./models/datadimensions";

  let pipeline = [
    new Cast(COMP_FLOAT32),
    new Channelize(4),
    new Beamform(8),
    new Cast(COMP_FLOAT16),
  ]

  let datadim = new DataDimension(
    20,
    768,
    8192,
    2,
    COMP_INT8
  )
  let dataflow = [datadim];
  for (let index = 0; index < pipeline.length; index++) {
    const module = pipeline[index];
    datadim = module.ingest(datadim);
    dataflow = [...dataflow, datadim];
  }
</script>

<main>
  <h1>Pipeline Dataflow View</h1>
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
</main>

<style>
  :root {
    font-family: Roboto;
    background-color: black;
    color: white;
  }

  main {
    text-align: center;
    padding: 1em;
    margin: 0 auto;
  }

  h1 {
    color: white;
    text-transform: uppercase;
    font-size: 4rem;
    font-weight: 100;
    line-height: 1.1;
    margin: 2rem auto;
    max-width: 14rem;
  }

  @media (min-width: 480px) {
    h1 {
      max-width: none;
    }

    p {
      max-width: none;
    }
  }
</style>
