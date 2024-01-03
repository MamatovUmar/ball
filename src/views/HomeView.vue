<template>
  <main class="hide-scroll">
    <canvas ref="canvas" />
  </main>
</template>

<script setup lang="ts">
import {onBeforeUnmount, onMounted, ref} from 'vue'
import Game from '@/playcanvas/App.ts'
import ballAsset from 'Images/Sphere.png'
import roadAsset from 'Images/road.jpg'
import collectSound from '@/assets/sounds/coin.mp3'

const x = ref(0)
const y = ref(0)
const z = ref(0)
const canvas = ref<HTMLCanvasElement>()
const game = ref<Game>()
const assets = {
  ball: ballAsset,
  road: roadAsset,
  movementScript: '/src/playcanvas/movementScript.ts',
  collectSound,
  courier: '/src/assets/fonts/courier.json'
}

const createGame = () => {
  if (!canvas) return
  game.value = new Game(canvas.value, assets)
}

onMounted(() => {
  createGame()
})

onBeforeUnmount(() => {
  game.value?.offKeydown()
})

</script>

<style scoped lang="css">
.hide-scroll {
  overflow: hidden;
}
</style>