import * as pc from 'playcanvas'
import { createAssetMaterial } from './utilst'
import {Assets, Coordinates, Props} from "./types";
import Barrier from "./Barrier";
import Coin from "./Coin";

const DEFAULT_POSITION: Coordinates = { x: 0, y: 0, z: 5 }
const DEFAULT_SCALE: Coordinates = { x: 2, y: 0.1, z: 10 }
const DEFAULT_ROTATE: Coordinates = { x: 0, y: 0, z: 0 }

export default class Road {
  private position: Coordinates
  private scale: Coordinates
  private rotate: Coordinates
  public entity: pc.Entity
  public material: pc.StandardMaterial
  private leftBarrier: Barrier
  private rightBarrier: Barrier
  public assets: Assets
  app: pc.Application

  constructor(app: pc.Application, assets: Assets, props: Partial<Props>) {
    this.app = app
    this.position = props?.position ?? DEFAULT_POSITION
    this.assets = assets
    this.scale = props?.scale ?? DEFAULT_SCALE
    this.rotate = props?.rotate ?? DEFAULT_ROTATE
    this.entity = new pc.Entity()
    this.leftBarrier = new Barrier({ x: -0.5, y: 0.2, z: 0 })
    this.rightBarrier = new Barrier({ x: 0.5, y: 0.2, z: 0 })
    this.entity.addChild(this.leftBarrier.entity)
    this.entity.addChild(this.rightBarrier.entity)
    this.material = createAssetMaterial(assets.road)

    this.create()
  }

  create() {
    this.addRigidBody()
    this.render()
    this.addCollision()

    this.entity.setPosition(this.position.x, this.position.y, this.position.z)
    this.entity.setLocalScale(this.scale.x, this.scale.y, this.scale.z)
    this.entity.rotate(this.rotate.x, this.rotate.y, this.rotate.z)
  }

  addCoin(position: Coordinates) {
    const coin = new Coin(this.app, position, this.assets.collectSound)
    this.entity.addChild(coin.entity)
  }

  render() {
    this.entity.addComponent('render', {
      type: 'box',
      material: this.material
    })
  }

  addRigidBody() {
    this.entity.addComponent('rigidbody', {
      type: 'static'
    })
  }

  addCollision() {
    this.entity.addComponent('collision', {
      type: 'box',
      halfExtents: new pc.Vec3(this.scale.x / 2, this.scale.y / 2, this.scale.z / 2)
    })
  }
}