import * as pc from 'playcanvas'
import Base from "./Base";

class Ball extends Base{
  constructor() {
    super()
  }

  create(asset: pc.Asset) {
    const ball = new pc.Entity()
    const material = this.createAssetMaterial(asset)

    ball.addComponent('render', {
      type: 'sphere',
      material
    })
    ball.addComponent('rigidBody', {
      type: 'dynamic',
      mass: 1
    })
    ball.addComponent('collision', {
      type: 'sphere',
      radius: 0.15
    })
    ball.setPosition(0, 1, 0)
    ball.setLocalScale(0.3, 0.3, 0.3)
    return ball
  }
}

export default new Ball()