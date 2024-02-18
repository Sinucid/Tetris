import { GameConfig, FieldMap } from "../models";

export class Field {
  protected storage!: FieldMap;

  constructor(protected config: GameConfig) {
    this.clear();
  }

  getMap(): FieldMap {
    return this.storage;
  }

  setMap(map: FieldMap): void {
    this.storage = map;
  }

  clear(): void {
    this.storage = this.createMap(this.config.width, this.config.height);
  }

  protected createMap(width: number, height: number): FieldMap {
    return Array(height)
      .fill(null)
      .map(() => Array(width).fill(0));
  }
}
