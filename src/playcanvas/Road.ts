import * as pc from 'playcanvas'
import Base from "./Base";

class Road extends Base {
  constructor() {
    super()
  }

  create(asset: pc.Asset, position: Position) {
    const road = new pc.Entity()
    const material = this.createAssetMaterial(asset)

    road.addComponent('render', {
      type: 'box',
      material
    })

    road.addComponent('collision', {
      type: 'box',
      halfExtents: new pc.Vec3(1, 0.05, 5)
    })

    road.addComponent('rigidBody', {
      type: 'static'
    })

    road.setPosition(position.x, position.y, position.z)
    road.setLocalScale(2, 0.1, 10)
    road.rotate(10, 0, 0)
    return road
  }
}

export default new Road()

interface Position {
  x: number
  y: number
  z: number
}