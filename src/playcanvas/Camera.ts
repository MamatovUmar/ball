import * as pc from 'playcanvas'

export default class Camera {
  public entity: pc.Entity
  public vec: pc.Vec3 = new pc.Vec3()

  constructor() {
    this.entity = new pc.Entity("camera")

    this.entity.addComponent("camera", {
      clearColor: new pc.Color(255, 255, 255, 0),
      farClip: 50
    })

    this.entity.setPosition(0, 2, 5)
    this.entity.lookAt(0, 1, 3)
    this.entity.rotate(0, 2, 0)
  }

  changePosition(pos) {
    this.vec.lerp(this.vec, pos, 0.1)
    this.entity.setPosition(this.vec);
  }
}