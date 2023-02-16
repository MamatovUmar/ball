import * as pc from 'playcanvas'

export default class Movement {
  public script
  public entity: pc.Entity

  constructor(speed = 0.1) {
    this.script = pc.createScript('movement')
    this.script.attributes.add('speed', {
      type: 'number',
      default: speed,
      min: 0.05,
      max: 0.5,
      precision: 2,
      description: 'Controls the movement speed'
    })
    this.script.force = new pc.Vec3()
  }

  public get force() {
    return this.script.force
  }

  public get speed() {
    return 0.1
  }
}