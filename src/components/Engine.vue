<script setup>
import { onMounted } from "vue";
import { World } from "../worlds/world";

// Force reload
if (import.meta.hot) {
    import.meta.hot.dispose( (data) => {
        import.meta.hot.invalidate();
    } )
}

onMounted(()=>{
  const world = new World();
});
</script>

<template>
  <canvas id="scene3d"></canvas>
</template>

<style scoped>
#scene3d{
  width: 100%;
  height: 100%;
  touch-action: none;
}
</style>
