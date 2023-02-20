import * as pc from 'playcanvas'
import { createAssetMaterial } from './utilst'

const DEFAULT_SPEED = 2

export default class Ball {
  public entity: pc.Entity
  private material: pc.StandardMaterial
  public speed: number = DEFAULT_SPEED
  public sideSpeed: number = DEFAULT_SPEED / 3
  public force: pc.Vec3

  constructor(asset: pc.Asset, speed?: number) {
    this.force = new pc.Vec3()
    this.material = createAssetMaterial(asset)
    this.entity = new pc.Entity()
    if (speed) {
      this.speed = speed
      this.sideSpeed = speed / 3
    }
    this.create()
  }

  public create() {
    this.addRigidBody()
    this.addRender()
    this.addCollision()

    this.entity.setPosition(0, 1, 0)
    this.entity.setLocalScale(0.3, 0.3, 0.3)
  }

  public move() {
    this.entity.rigidbody.applyImpulse(this.force)
  }

  public get velocity() {
    return this.entity.rigidbody.linearVelocity
  }

  private addCollision() {
    this.entity.addComponent('collision', {
      type: "sphere",
      radius: 0.15
    })
  }

  private addRigidBody() {
    this.entity.addComponent('rigidbody', {
      type: pc.BODYTYPE_DYNAMIC,
      mass: 0.5,
      restitution: 0.5
    })
  }

  private addRender() {
    this.entity.addComponent('render', {
      type: 'sphere',
      material: this.material
    })
  }

  public get getPosition() {
    return this.entity.getPosition()
  }
}