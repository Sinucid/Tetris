export enum ShapeType {
  I = 1,
  J = 2,
  L = 3,
  O = 4,
  S = 5,
  T = 6,
  Z = 7,
}

export type ShapeMatrix = ShapeType[][];
export const shapesMapping = Object.values(ShapeType);

export type ShapeMeasurements = {
  x: number;
  y: number;
};
