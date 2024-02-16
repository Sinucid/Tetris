import { ConfigModel, FieldMap } from "../models";

export class Field implements Field {
  protected storage: FieldMap;

  constructor(config: ConfigModel) {
    this.storage = this.createMap(config.width, config.height);
  }

  getMap(): FieldMap {
    return this.storage;
  }

  setMap(map: FieldMap): void {
    this.storage = map;
  }

  protected createMap(width: number, height: number): FieldMap {
    return Array(height)
      .fill(null)
      .map(() => Array(width).fill(0));
  }
}
