import { ShapeMatrix } from "../models";

export const getMeasurements = (shape: ShapeMatrix) => {
  return { height: shape.length, width: shape[0].length };
};
