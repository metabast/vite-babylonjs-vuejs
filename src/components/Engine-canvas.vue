<script setup>
import { onMounted } from 'vue';
import { World } from '../worlds/world-matcap';

// Force reload
if ( import.meta.hot ) {
  import.meta.hot.dispose( () => {
    import.meta.hot.invalidate();
  } )
}

onMounted( ()=>{
  const world  =new World();
  console.log( world );
} );
</script>

<template>
<div id="container">
  <canvas id="scene3d"></canvas>
  <canvas id="matcapCanvas"></canvas>
  <div id="tweakpane"></div>
</div>
</template>

<style scoped>
#container{
  width: 100%;
  height: 100%;
}
#scene3d{
  width: 100%;
  height: 100%;
  touch-action: none;
}
#matcapCanvas{
  position: absolute;
  z-index: 10;
  top: 0;
  left: 0;
}
</style>
