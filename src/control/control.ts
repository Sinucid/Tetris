export const controlEvent = "game.control";

export enum Actions {
  MoveLeft = 1,
  MoveRight = 2,
  MoveDown = 3,
  Rotate = 4,
}
export const actionsMapping = Object.values(Actions);

export type Handler = (code: Actions, released: boolean) => void;

export class Control {
  constructor(protected handler: Handler) {
    window.addEventListener("keydown", (e) => this.handleKey(e));
    window.addEventListener("keyup", (e) => this.handleKey(e, true));
  }

  protected handleKey(e: KeyboardEvent, released = false): void {
    switch (e.key) {
      case "ArrowLeft":
        this.handler(Actions.MoveLeft, released);
        break;
      case "ArrowRight":
        this.handler(Actions.MoveRight, released);
        break;
      case "ArrowDown":
        this.handler(Actions.MoveDown, released);
        break;
      case "ArrowUp":
        this.handler(Actions.Rotate, released);
        break;
    }
  }
}
