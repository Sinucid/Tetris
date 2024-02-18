export const controlEvent = "game.control";

export enum Actions {
  MoveLeft = 1,
  MoveRight = 2,
  MoveDown = 3,
  Rotate = 4,
}
export const actionsMapping = Object.values(Actions);

export type Handler = (code: Actions) => void;

export class Control {
  constructor(protected handler: Handler) {
    window.addEventListener("keydown", this.handleKey.bind(this));
  }

  protected handleKey(e: KeyboardEvent): void {
    switch (e.key) {
      case "ArrowLeft":
        this.handler(Actions.MoveLeft);
        break;
      case "ArrowRight":
        this.handler(Actions.MoveRight);
        break;
      case "ArrowDown":
        this.handler(Actions.MoveDown);
        break;
      case "ArrowUp":
        this.handler(Actions.Rotate);
        break;
    }
  }
}
