<script lang="ts">
	export let tip = '';
	let show:boolean = false;
	let x:number;
	let y:number;
	
	function tooltipOpen(event:MouseEvent) {
		show = true;
		x = event.pageX + 5;
		y = event.pageY + 5;
	}
	function tooltipMove(event:MouseEvent) {
		x = event.pageX + 5;
		y = event.pageY + 5;
	}
	function tooltipClose() {
		show = false;
	}
</script>

<div
	on:click={tooltipOpen}
	on:focus={()=>{}}
	on:mousemove={tooltipMove}
  on:mouseleave={tooltipClose}
>
	<slot />
</div>

{#if show}
	<div style="top: {y}px; left: {x}px;" class="tooltip">{tip}</div>
{/if}

<style>
	.tooltip {
		border: 1px solid #ddd;
		background: #fff;
		border-radius: 1px;
		position: absolute;
    text-align: center;
    justify-content: center;
	}
</style>