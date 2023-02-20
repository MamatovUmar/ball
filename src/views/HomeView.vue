<template>
<!--  <input type="number" v-model="x">-->
<!--  <input type="number" v-model="y">-->
<!--  <input type="number" v-model="z">-->
  <main>
    <canvas ref="canvas" />
  </main>
</template>

<script setup lang="ts">
import {onBeforeUnmount, onMounted, ref, watch} from 'vue'
import Game from '@/playcanvas/App.ts'
import Ball from '@/playcanvas/Ball'
import ballAsset from 'Images/Sphere.png'
import roadAsset from 'Images/road.jpg'
import collectSound from '@/assets/sounds/coin.mp3'
import preloadModules from "../playcanvas/preload-modules";

const x = ref(0)
const y = ref(0)
const z = ref(0)
const canvas = ref<HTMLCanvasElement>()
const game = ref<Game>()
const dtVal = ref(0)
const assets = {
  ball: ballAsset,
  road: roadAsset,
  movementScript: '/src/playcanvas/movementScript.ts',
  collectSound
}

const createGame = () => {
  if (!canvas) return
  game.value = new Game(canvas.value, assets)

  // game.value.start()
}

onMounted(() => {
  // preloadModules(() => {
    createGame()
  // })
})

onBeforeUnmount(() => {
  game.value?.offKeydown()
})

</script>

<style scoped lang="css">

</style>