<script lang="ts">
	export let tip = '';
	let isHovered:boolean = false;
	let x:number;
	let y:number;
	
	function mouseOver(event:MouseEvent) {
		isHovered = true;
		x = event.pageX + 5;
		y = event.pageY + 5;
	}
	function mouseMove(event:MouseEvent) {
		x = event.pageX + 5;
		y = event.pageY + 5;
	}
	function mouseLeave() {
		isHovered = false;
	}
</script>

<div
	on:mouseover={mouseOver}
	on:focus={()=>{}}
  on:mouseleave={mouseLeave}
	on:mousemove={mouseMove}>
	<slot />
</div>

{#if isHovered}
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