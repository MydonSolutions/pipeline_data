<script lang="ts">
	export let tip = '';
	export let style = '';
	export let tip_style = '';
	tip = tip.replaceAll('\n', '</br>')

	let show:boolean = false;
	let x:number;
	let y:number;

	$: tipstyle = `${tip_style};top: ${y}px;left: ${x}px;`
	
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
	on:mouseenter={tooltipOpen}
	on:focus={()=>{}}
	on:mousemove={tooltipMove}
  on:mouseleave={tooltipClose}
	{style}
>
	<slot />
</div>

{#if show}
	<div style={tipstyle} class="tooltip">{@html tip}</div>
{/if}

<style>
	.tooltip {
		border: 1px solid #ddd;
		background: #fff;
		color: black;
		font-size: 0.8em;
		border-radius: 1px;
		position: absolute;
    text-align: center;
    justify-content: center;
	}
</style>