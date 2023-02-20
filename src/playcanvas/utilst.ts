import * as pc from "playcanvas";
import {Props, Coordinates, Resources, Assets} from './types'
import {app} from "playcanvas";

const DEFAULT_POSITION: Coordinates = { x: 0, y: 0, z: 0 }
const DEFAULT_SCALE: Coordinates = { x: 2, y: 0.1, z: 10 }
const DEFAULT_ROTATE: Coordinates = { x: 0, y: 0, z: 0 }

export const createAssetMaterial = (asset: pc.Asset) => {
  const material = new pc.StandardMaterial()
  material.diffuseMap = asset.resource
  material.update()
  return material
}

export const createMaterial = (color: pc.Color) => {
  const material = new pc.StandardMaterial()
  material.diffuse = color
  material.update()
  return material
}

export const createBall = (asset: pc.Asset) => {
  const ball = new pc.Entity()
  const material = createAssetMaterial(asset)

  ball.addComponent('rigidbody', {
    type: pc.BODYTYPE_DYNAMIC,
    mass: 0.5,
    restitution: 0.5
  })

  ball.addComponent('render', {
    type: 'sphere',
    material
  })

  ball.setPosition(0, 1, 2)
  ball.setLocalScale(0.3, 0.3, 0.3)

  ball.addComponent('collision', {
    type: "sphere",
    radius: 0.15
  })

  // ball.addComponent('script')
  // ball.script.create('movement')

  return ball
}

export const createRoad = (asset: pc.Asset, props: Partial<Props>) => {
  const position = props?.position ?? DEFAULT_POSITION
  const scale = props?.scale ?? DEFAULT_SCALE
  const rotate = props?.rotate ?? DEFAULT_ROTATE

  const road = new pc.Entity()
  const material = createAssetMaterial(asset)

  road.addComponent('render', {
    type: 'box',
    material
  })

  road.addComponent('rigidbody', {
    type: 'static'
  })

  road.addComponent('collision', {
    type: 'box',
    halfExtents: new pc.Vec3(1, 0.05, 5)
  })

  road.setPosition(position.x, position.y, position.z)
  road.setLocalScale(scale.x, scale.y, scale.z)
  road.rotate(rotate.x, rotate.y, rotate.z)
  return road
}

export const load = (assets, appAssets, cb) => {
  pc.WasmModule.setConfig('Ammo', {
    glueUrl: '/lib/ammo/ammo.wasm.js',
    wasmUrl: '/lib/ammo/ammo.wasm.wasm',
    fallbackUrl: '/lib/ammo/ammo.js'
  });

  pc.WasmModule.getInstance('Ammo', () => {
    // @ts-ignore
    const assetsLoader = new pc.AssetListLoader(Object.values(assets), appAssets)
    assetsLoader.load(cb)
  })
}

export const createAssets = (resources: Resources): Assets => ({
  ball: new pc.Asset('ball', 'texture', {
    url: resources.ball
  }),
  road: new pc.Asset('road', 'texture', {
    url: resources.road
  }),
  collectSound: new pc.Asset('collect', 'audio', {
    url: resources.collectSound
  })
})

export const movement = (speed = 0.1) => {
  const MovementScript = pc.createScript('movement')
  MovementScript.attributes.add('speed', {
    type: 'number',
    default: speed,
    min: 0.05,
    max: 0.5,
    precision: 2,
    description: 'Controls the movement speed'
  })

  MovementScript.prototype.initialize = function() {
    this.force = new pc.Vec3();
  }

  return MovementScript
}