import * as pc from 'playcanvas'
import { createMaterial } from "./utilst";
import Base from "./Base";

export default class Obstacle extends Base{
  public position = new pc.Vec3(0, 1, 0)
  public scale = new pc.Vec3(0.3, 3,0.03)

  constructor() {
    super()
    this.material = createMaterial(pc.Color.GRAY)
    const rand = this.getRndInteger(-3, 3)

    this.render({
      type: 'box',
      material: this.material
    })

    this.addRigidBody({
      type: 'static'
    })

    this.addCollision({
      type: 'box',
      halfExtents: new pc.Vec3(0.3, 3,0.1)
    })

    this.entity.setLocalPosition(rand, this.position.y, 0)
    this.entity.setLocalScale(this.scale)
  }
}