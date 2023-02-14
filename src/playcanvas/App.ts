import * as pc from 'playcanvas'
// import movement from './scripts/movement'
import Ball from "./Ball";
import Road from "./Road";


export default class Game {
  public app?: pc.Application
  public ball: pc.Entity
  public road: pc.Entity
  public camera: pc.Entity
  public assets: Assets
  public assetListLoader: pc.AssetListLoader

  constructor(canvas: HTMLCanvasElement, resources: Resources) {
    this.app = new pc.Application(canvas, {
      graphicsDeviceOptions: { alpha: true },
      keyboard: new pc.Keyboard(document.body),
      mouse: new pc.Mouse(document.body),
      elementInput: new pc.ElementInput(canvas),
    })
    this.sizeSettings()
    this.assets = this.createAssets(resources)
    this.assetListLoader = new pc.AssetListLoader(Object.values(this.assets), this.app.assets);
    this.addCamera()
    this.addLight()
  }

  start() {
    this.assetListLoader.load((err) => {
      if (err) {
        console.error(err)
      } else {
        this.ball = Ball.create(this.assets.ball)
        this.app.root.addChild(this.ball)

        const road1 = Road.create(this.assets.road, {x: 0, y: 0, z: 0})
        this.app.root.addChild(road1)

        const road2 = Road.create(this.assets.road, {x: 1, y: 2, z: 10})
        this.app.root.addChild(road2)

        this.app.start()
        // this.app.keyboard?.on(pc.EVENT_KEYDOWN, (e) => {
        //   console.log(e)
        // })
        //
        // let time = 0;
        // this.app.on("update", (dt) => {
        //   time += dt
        //   this.ball.rotate(0.3 * Math.sin(time * 0.5), 0.3 * Math.cos(time * 0.5), 0);
        // })
      }
    })
  }

  createAssets(resources: Resources): Assets {
    return {
      ball: new pc.Asset('ball', 'texture', {
        url: resources.ball
      }),
      road: new pc.Asset('road', 'texture', {
        url: resources.road
      }),
      // movement: new pc.Asset('movement', 'script', {
      //   url: resources.movementScript
      // })
    }
  }

  public addBall(ball) {
    this.ball = ball
    this.app.root.addChild(ball)
  }

  public onKeydown(cb) {
    this.app.keyboard?.on(pc.EVENT_KEYDOWN, cb, this)
  }

  public offKeydown() {
    this.app.keyboard?.off(pc.EVENT_KEYDOWN)
  }

  public onUpdate(cb) {
    this.app.on("update", cb)
  }

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

    this.camera.setPosition(0, 1, 5);
    this.camera.lookAt(0, 1, 5);
    // camera.rotate(0, 0, 4)
    this.camera.setLocalScale(1, 1, 1)
    this.app.root.addChild(this.camera);
  }
}

interface Assets {
  ball: pc.Asset,
  movement?: pc.Asset,
  road: pc.Asset
}

interface Resources {
  [key: string]: string
}