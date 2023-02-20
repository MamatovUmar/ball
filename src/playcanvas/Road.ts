import * as pc from 'playcanvas'
import { createAssetMaterial } from './utilst'
import { Coordinates, Props } from "./types";
import Barrier from "./Barrier";

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

  constructor(asset: pc.Asset, props: Partial<Props>) {
    this.position = props?.position ?? DEFAULT_POSITION
    this.scale = props?.scale ?? DEFAULT_SCALE
    this.rotate = props?.rotate ?? DEFAULT_ROTATE
    this.entity = new pc.Entity()
    this.leftBarrier = new Barrier({ x: -0.5, y: 0.2, z: 0 })
    this.rightBarrier = new Barrier({ x: 0.5, y: 0.2, z: 0 })
    this.entity.addChild(this.leftBarrier.entity)
    this.entity.addChild(this.rightBarrier.entity)
    this.material = createAssetMaterial(asset)

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