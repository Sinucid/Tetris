import { ShapeMatrix, ShapeType } from "../models";
import { getMeasurements } from "../utils";

export interface PlayerShape {
  readonly shape: ShapeMatrix;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export class Player implements PlayerShape {
  constructor(
    private _shape: ShapeMatrix,
    private _x = 0,
    private _y = 0,
  ) {}

  get shape(): ShapeMatrix {
    return this._shape;
  }
  get x(): number {
    return this._x;
  }

  get y(): number {
    return this._y;
  }

  get width(): number {
    return getMeasurements(this.shape).width;
  }

  get height(): number {
    return getMeasurements(this.shape).height;
  }

  get type(): ShapeType {
    return this.shape[0].find((type) => !type)!;
  }

  rotate(): ShapeMatrix {
    return this.shape[0].map((_, index) =>
      this.shape.map((row) => row[index]).reverse(),
    );
  }

  update({shape, x, y}: Partial<PlayerShape>): void {
    if (typeof x === "number") this._x = x;
    if (typeof y === "number") this._y = y;
    if (shape) this._shape = shape;
  }
}
