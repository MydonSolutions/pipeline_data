<script lang="ts">
  import type { DataDimension } from "./models/datadimensions";
  import type { Pipeline as Pipeline_t } from "./models/pipeline";
  import Dataflow from "./lib/Dataflow.svelte";
  import InputPipeline from "./lib/InputPipeline.svelte";
  import InputDataDimension from "./lib/InputDataDimension.svelte";

  let pipeline: Pipeline_t;
  let datadim: DataDimension;
</script>

<main>
  <h1>Pipeline Dataflow View</h1>
  <div class="inputs">
    <InputPipeline bind:pipeline/>
    <InputDataDimension bind:datadim/>
  </div>
  <Dataflow {pipeline} {datadim}/>
</main>

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
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

  div.inputs {
    width:100%;
    height:250px;
    display:flex;
    justify-content: space-around;
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
