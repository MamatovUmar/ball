import * as pc from 'playcanvas'
import { load, createAssets } from './utilst'
import { Coordinates, Assets, Resources } from './types'
import Ball from "./Ball";
import Road from "./Road";
import Camera from "./Camera";
import Coin from "./Coin";


export default class Game {
  public app: pc.Application
  public ball: any
  public camera: Camera
  public assets: Assets
  private roadStartPosition = { x: 0, y: 0, z: 0 }
  private roadCount: number = 0
  private roads: pc.Entity[] = []
  private firstPos = 0

  constructor(canvas: HTMLCanvasElement, resources: Resources) {

    this.app = new pc.Application(canvas, {
      graphicsDeviceOptions: { alpha: true },
      keyboard: new pc.Keyboard(document.body),
      mouse: new pc.Mouse(document.body),
      elementInput: new pc.ElementInput(canvas),
    })

    this.assets = createAssets(resources)
    this.sizeSettings()
    this.start()
  }

  start() {
    load(this.assets, this.app.assets, (err) => {
      if (err) {
        console.error(err)
        return false
      }
      this.app.start()
      this.addCamera()
      this.addLight(90, 0, 0)
      this.addLight(0, 90, 0)
      this.addBall()

      this.addNewRoad()
      this.addNewRoad()
      this.addNewRoad()

      this.onKeydown()
      this.onUpdate()
    })
  }

  addCoin(position: Coordinates) {
    const coin = new Coin(this.app, position, this.assets.collectSound)
    this.app.root.addChild(coin.entity)
  }

  addCoins(startPosition: number) {
    const rand = this.getRndInteger(-8, 8)
    for (let i = 0; i < 7; i++) {
      this.addCoin({ x: rand, y: 0.15, z: startPosition - i })
    }
  }

  getRndInteger(min, max) {
    return (Math.floor(Math.random() * (max - min + 1) ) + min) / 10
  }

  addNewRoad() {
    const position: Coordinates = {
      x: this.roadStartPosition.x,
      y: this.roadStartPosition.y,
      z: this.roadStartPosition.z - this.roadCount * 10
    }

    const road = new Road(this.app, this.assets, { position })
    this.roads.push(road.entity)
    this.app.root.addChild(road.entity)
    this.roadCount++
    this.addCoins(position.z - 2)
  }

  addBall() {
    this.ball = new Ball(this.assets.ball)
    this.app.root.addChild(this.ball.entity)
  }

  public onKeydown() {
    this.app.keyboard?.on(pc.EVENT_KEYDOWN, (e) => {
      let x = 0
      let z = 0

      if (e.key === 87 && this.ball.velocity.z > -this.ball.speed) {
        z = -this.ball.speed;
      }

      if (e.key === 83 && this.ball.velocity.z < this.ball.speed) {
        z = this.ball.speed;
      }

      if (e.key === 65 && this.ball.velocity.x > -this.ball.sideSpeed) {
        x = -this.ball.sideSpeed;
      }

      if (e.key === 68 && this.ball.velocity.x < this.ball.sideSpeed) {
        x = this.ball.sideSpeed;
      }

      this.ball.force.z = z
      this.ball.force.x = x

      this.ball.move()
    })
  }

  public offKeydown() {
    this.app.keyboard?.off(pc.EVENT_KEYDOWN)
  }

  public onUpdate() {
    this.app.on("update", (dt) => {
      const pos = this.ball.getPosition
      this.camera.changePosition({ x: 0, y: 1, z: pos.z + 1.5 })
      // this.camera.entity.translate(new pc.Vec3(pos.x, 0.3, 0))
      this.camera.entity.lookAt(new pc.Vec3(0, 0, pos.z - 1))

      if(Math.abs(this.ball.getPosition.z) > this.firstPos + 10) {
        this.addNewRoad()
        this.destroyFirstRoad()
        this.firstPos += 10
      }
    })
  }

  sizeSettings() {
    if (!this.app) return

    this.app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW)
    this.app.setCanvasResolution(pc.RESOLUTION_AUTO)
    window.addEventListener('resize', (e) => {
      this.app.resizeCanvas( 500, 500)
    })
  }

  destroyFirstRoad() {
    if (this.roads.length > 3) {
      const f = this.roads.shift()
      const pos = f.getPosition()
      // @ts-ignore
      const coins = this.app.root.find('name', 'Coin')
      coins.forEach((e: pc.Entity) => {
        const p = e.getPosition()
        if (p.z > pos.z) {
          e.destroy()
        }
      })
      f.destroy()
    }

  }

  public addLight(x: number, y: number, z: number) {
    const light = new pc.Entity("light")
    light.addComponent("light")
    light.setEulerAngles(x, y, z)
    this.app.root.addChild(light)
  }

  public addCamera() {
    this.camera = new Camera()
    this.app.root.addChild(this.camera.entity)
  }
}

