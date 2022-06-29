<script lang="ts">

  let error_message = undefined;

  export let value:object;
  export let title:string = undefined;
  let value_json = JSON.stringify(value, null, 2);

  function parse() {
    try {
      value = JSON.parse(value_json)
      error_message = undefined;
    } catch (error:any) {
      error_message = error;
    }
  }

</script>

<div>
  {#if title != undefined}
    {title}:
  {/if}
  <textarea bind:value={value_json} on:input={parse}/>
  {#if error_message != undefined}
    <div>
      {error_message}
    </div>
  {/if}
</div>

<style>
  div {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  
  textarea {
    width:98%;
    height:98%;
    align-self: center;
    resize: none;
  }
</style>