import * as pc from "playcanvas";

export interface Coordinates {
  x: number
  y: number
  z: number
}

export interface Props {
  [key: string]: Coordinates
}

export interface Assets {
  ball: pc.Asset,
  movement?: pc.Asset,
  road: pc.Asset
}

export interface Resources {
  [key: string]: string
}
