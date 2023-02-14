import * as pc from 'playcanvas'

export default class Base {
  protected createMaterial(color: pc.Color) {
    const material = new pc.StandardMaterial()
    material.diffuse = color
    material.update()
    return material
  }

  protected createAssetMaterial(asset: pc.Asset) {
    const material = new pc.StandardMaterial()
    material.diffuseMap = asset.resource
    material.update()
    return material
  }
}