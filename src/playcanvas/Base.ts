import { createMaterial } from "./utilst";
import * as pc from "playcanvas";

export default class Base {
  public entity: pc.Entity
  public material: pc.StandardMaterial

  constructor() {
    this.entity = new pc.Entity()
    this.material = createMaterial(pc.Color.BLUE)
  }

  render(options: object) {
    this.entity.addComponent('render', options)
  }

  addRigidBody(options: object) {
    this.entity.addComponent('rigidbody', options)
  }

  addCollision(options: object) {
    this.entity.addComponent('collision', options)
  }

  getRndInteger(min, max) {
    return (Math.floor(Math.random() * (max - min + 1) ) + min) / 10
  }
}