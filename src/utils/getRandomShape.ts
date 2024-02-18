import { ShapeMatrix } from "../models";
import { shapes } from "../player";

export const getRandomShape = (): ShapeMatrix => {
  const randomShape = Math.ceil(
    Math.random() * Object.keys(shapes).length,
  ) as keyof typeof shapes;

  return shapes[randomShape];
};
