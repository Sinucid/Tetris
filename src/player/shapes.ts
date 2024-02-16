import { ShapeType } from "../models/shape";

const I = ShapeType.I;
const J = ShapeType.J;
const L = ShapeType.L;
const O = ShapeType.O;
const S = ShapeType.S;
const T = ShapeType.T;
const Z = ShapeType.Z;

export const shapes = {
  [ShapeType.I]: [[I], [I], [I], [I]],
  [ShapeType.J]: [
    [J, 0, 0],
    [J, J, J],
  ],
  [ShapeType.L]: [
    [0, 0, L],
    [L, L, L],
  ],
  [ShapeType.O]: [
    [O, O],
    [O, O],
  ],
  [ShapeType.S]: [
    [0, S, S],
    [S, S, 0],
  ],
  [ShapeType.T]: [
    [0, T, 0],
    [T, T, T],
  ],
  [ShapeType.Z]: [
    [Z, Z, 0],
    [0, Z, Z],
  ],
};
