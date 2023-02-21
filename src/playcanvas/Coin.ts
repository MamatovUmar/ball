import * as pc from 'playcanvas'
import { createMaterial } from "./utilst";
import { Coordinates } from "./types";

export default class Coin {
  public entity: pc.Entity
  private material: pc.StandardMaterial
  private color: pc.Color
  private app: pc.Application
  public position: Coordinates
  public sound: pc.Asset

  constructor(app: pc.Application, position: Coordinates, sound: pc.Asset) {
    this.app = app
    this.entity = new pc.Entity()
    this.color = new pc.Color(0.8, 0.9, 0.4)
    this.position = position
    this.sound = sound

    this.material = createMaterial(this.color)
    this.material.useMetalness = true
    this.material.metalness = 0.1
    this.material.update()
    this.create()
  }

  create() {
    this.addRender()
    this.entity.setPosition(this.position.x, this.position.y, this.position.z)
    this.entity.setLocalScale(0.15, 0.02, 0.15)
    this.entity.rotate(90, 0, 0)
    this.entity.name = 'Coin'
    this.addCollision()
    this.addSound()
    this.addListeners()
  }

  private addListeners() {
    this.entity.collision.on('triggerenter', () => {
      this.entity.sound.play('beep')
      this.entity.setPosition(0, -2, 0)
      setTimeout(() => {
        this.entity.destroy()
      }, 500)
    })

    this.app.on('update', (dt: number) => {
      this.entity.rotate(dt, 200 * dt, dt)
    })
  }

  private addSound() {
    this.entity.addComponent('sound')
    this.entity.sound.addSlot('beep', {
      asset: this.sound.id
    })
  }

  private addCollision() {
    this.entity.addComponent('collision', {
      type: "cylinder",
      radius: 0.075,
      height: 0.01,
      halfExtents: new pc.Vec3(0.0075, 0.01, 0.0075)
    })
  }

  private addRender() {
    this.entity.addComponent('render', {
      name: 'coin',
      type: 'cylinder',
      material: this.material
    })
  }
}