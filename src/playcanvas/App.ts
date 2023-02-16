import * as pc from 'playcanvas'
import { createBall, createRoad, loadAmmo, createAssets, movement } from './utilst'
import { Coordinates, Assets, Resources } from './types'
import {ScriptType} from "playcanvas";
import Movement from "./Movement";


export default class Game {
  public app?: pc.Application
  public ball: pc.Entity
  public camera: pc.Entity
  public assets: Assets
  public assetListLoader: pc.AssetListLoader
  private roadStartPosition = { x: 0, y: 0, z: 0 }
  private roadCount: number = 0
  private roads: pc.Entity[] = []
  public force: pc.Vec3 = new pc.Vec3()
  public movement: Movement

  constructor(canvas: HTMLCanvasElement, resources: Resources) {

    this.app = new pc.Application(canvas, {
      graphicsDeviceOptions: { alpha: true },
      keyboard: new pc.Keyboard(document.body),
      mouse: new pc.Mouse(document.body),
      elementInput: new pc.ElementInput(canvas),
    })

    loadAmmo(() => {
      this.sizeSettings()
      this.assets = createAssets(resources)
      // @ts-ignore
      this.assetListLoader = new pc.AssetListLoader(Object.values(this.assets), this.app.assets);
      this.addCamera()
      this.addLight()
      console.log(this.app)
      this.start()
    });

  }

  start() {
    this.assetListLoader.load((err) => {
      if (err) {
        console.error(err)
      } else {
        this.app.start()
        this.movement = new Movement(1)
        this.ball = createBall(this.assets.ball)
        this.app.root.addChild(this.ball)

        this.addNewRoad()
        this.addNewRoad()
        this.addNewRoad()

        this.onKeydown()
        console.log(this.roads)
      }
    })
  }

  addNewRoad() {
    const position: Coordinates = {
      x: this.roadStartPosition.x,
      y: this.roadStartPosition.y,
      z: this.roadStartPosition.z - this.roadCount * 10
    }

    const road = createRoad(this.assets.road, { position })
    this.roads.push(road)
    this.app.root.addChild(road)
    this.roadCount++
  }

  public onKeydown() {
    this.app.keyboard?.on(pc.EVENT_KEYDOWN, (e) => {
      let forceX = 0;
      let forceZ = 0;

      switch (e.key) {
        case 87:
          console.log('top')
          forceZ -= this.movement.speed
          break
        case 83:
          console.log('down')
          forceZ += this.movement.speed
          break
        case 65:
          console.log('left')
          forceX -= this.movement.speed
          break
        case 68:
          console.log('right')
          forceX += this.movement.speed
          break
      }

      this.movement.force.x = forceX;
      this.movement.force.z = forceZ;

      if (this.force.length()) {
        const rX = Math.cos(-Math.PI * 0.5);
        const rY = Math.sin(-Math.PI * 0.5);
        this.movement.force.set(this.movement.force.x * rX - this.movement.force.z * rY, 0, this.movement.force.z * rX + this.movement.force.x * rY);

        if (this.movement.force.length() > 0.1) {
          this.movement.force.normalize().scale(0.1);
        }
      }


      // apply impulse to move the entity
      this.ball.rigidbody.applyImpulse(this.movement.force);
    })
  }

  public offKeydown() {
    this.app.keyboard?.off(pc.EVENT_KEYDOWN)
  }

  // public onUpdate() {
  //   this.app.on("update", (dt) => {
  //
  //   })
  // }

  sizeSettings() {
    if (!this.app) return

    this.app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW)
    this.app.setCanvasResolution(pc.RESOLUTION_AUTO)
    window.addEventListener('resize', (e) => {
      this.app.resizeCanvas( 500, 500)
    })
  }

  public addLight() {
    const light = new pc.Entity("light")
    light.addComponent("light")
    light.setEulerAngles(90, 0, 0)
    this.app.root.addChild(light)
  }

  public addCamera() {
    this.camera = new pc.Entity("camera");
    this.camera.addComponent("camera", {
      clearColor: new pc.Color(255, 255, 255, 0),
    });

    this.camera.setPosition(0, 2, 5);
    this.camera.lookAt(0, 1, 3);
    this.camera.rotate(0, 2, 0)
    // camera.rotate(0, 0, 4)1
    this.camera.setLocalScale(1, 1, 1)
    this.app.root.addChild(this.camera);
  }
}

