import * as pc from 'playcanvas'
import { createMaterial } from './utilst'

export default class Barrier {
  public entity: pc.Entity
  public material: pc.StandardMaterial
  public color: pc.Color

  constructor() {
    this.entity = new pc.Entity()
    this.color = new pc.Color(237,0,0)
    this.material = createMaterial(this.color)
    this.render()
    this.addRigidBody()
    this.addCollision()
    this.entity.setPosition(-1.005, 0.1, 0)
    this.entity.setLocalScale(0.01, 0.1, 10)
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
      halfExtents: new pc.Vec3(0.005, 2, 5)
    })
  }
}