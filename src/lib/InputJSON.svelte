<script lang="ts">

  export let value:string = "";
  export let title:string = undefined;

</script>

<div>
  {#if title != undefined}
    {title}:
  {/if}
  <textarea bind:value/>
</div>

<style>
  div {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  
  textarea {
    width:100%;
    height:100%;
    align-self: center;
    resize: none;
  }
</style>