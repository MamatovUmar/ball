import {Assets, Resources} from "./types";
import {createAssets} from "./utilst";

export default class Base {
  public assets?: Assets

  constructor(resources?: Resources) {
    this.assets = createAssets(resources)
  }
}