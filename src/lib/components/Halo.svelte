<script lang="ts">
  import { onMount } from 'svelte';
  export let intensity = 1;
  let el: HTMLElement;
  onMount(() => {
    const reduced = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    let raf=0,mx=50,my=50,dirty=false;
    const commit=()=>{el.style.setProperty('--mx',`${mx}%`);el.style.setProperty('--my',`${my}%`);el.style.setProperty('--halo-scale',String(intensity));dirty=false;};
    const onMove=(e:PointerEvent)=>{const r=el.getBoundingClientRect();
      mx=((e.clientX-r.left)/r.width)*100; my=((e.clientY-r.top)/r.height)*100;
      if(!dirty){dirty=true;raf=requestAnimationFrame(commit);}};
    el.addEventListener('pointermove',onMove,{passive:true});
    return ()=>{el.removeEventListener('pointermove',onMove); if(raf) cancelAnimationFrame(raf);}
  });
</script>
<div bind:this={el} class="halo-layer"><slot/></div>
