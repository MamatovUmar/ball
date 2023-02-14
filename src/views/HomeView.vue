<template>
  <input type="number" v-model="x">
  <input type="number" v-model="y">
  <input type="number" v-model="z">
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

const x = ref(0)
const y = ref(0)
const z = ref(0)
const canvas = ref<HTMLCanvasElement>()
const game = ref<Game>()
const dtVal = ref(0)
const assets = {
  ball: ballAsset,
  road: roadAsset,
  movementScript: '/src/playcanvas/scripts/movement.ts'
}

watch([x, y, z], () => {
  console.log(x.value, y.value, z.value)
  game.value.camera.lookAt(x.value, y.value, z.value)
})

const createGame = () => {
  if (!canvas) return
  game.value = new Game(canvas.value, assets)

  game.value.start()

  game.value.onKeydown((e) => {
    switch (e.key) {
      case 87:
        console.log('top', game.value.ball.getPosition())
        game.value.ball.setPosition(dtVal.value, dtVal.value, dtVal.value)
        break
      case 83:
        console.log('down')
        break
      case 65:
        console.log('left')
        break
      case 68:
        console.log('right')
        break
    }
  })

  let time = 0
  game.value.onUpdate((dt) => {
    dtVal.value = dt
    time += dt
    game.value.ball.rotate(0.3 * Math.sin(time * 0.5), 0.3 * Math.cos(time * 0.5), 0);
  })
}

onMounted(() => {
  createGame()
})

onBeforeUnmount(() => {
  game.value?.offKeydown()
})

</script>

<style scoped lang="css">

</style>