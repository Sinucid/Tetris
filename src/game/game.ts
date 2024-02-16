import { Field } from "../fieldMap";
import { ConfigModel, FieldMap, ShapeMatrix } from "../models";
import { FieldRenderer } from "./field";
import { Player, PlayerShape, shapes } from "../player";
import { Actions, Control } from "../control";
import { getMeasurements } from "../utils";

export class Game {
  protected loopRef?: number;
  protected control?: Control;
  protected field?: FieldMap;
  protected renderer?: FieldRenderer;
  protected player: Player | null = null;
  protected speed = 1000;
  protected inProgress = false;

  constructor(protected config: ConfigModel) {}

  init(): void {
    this.field = new Field(this.config).getMap();
    this.renderer = new FieldRenderer();

    const template = this.renderer.createField(this.field);

    document.getElementById(this.config.root)!.innerHTML = template;

    this.control = new Control(this.handleControls.bind(this));
  }

  start(): void {
    this.inProgress = true;
    this.resetPlayer();
    this.triggerLoop();
  }

  protected triggerLoop(): void {
    if (!this.inProgress) return;
    if (this.loopRef) clearTimeout(this.loopRef);
    this.loopRef = setTimeout(() => {
      this.moveDown(false);
    }, this.speed);
  }

  protected handleControls(action: Actions, released: boolean): void {
    if (!this.inProgress) return;

    switch (action) {
      case Actions.MoveLeft:
        this.moveLeft(released);
        break;
      case Actions.MoveRight:
        this.moveRight(released);
        break;
      case Actions.MoveDown:
        this.moveDown(released);
        break;
      case Actions.Rotate:
        this.rotate(released);
        break;
    }
  }

  protected moveLeft(released: boolean): void {
    if (released) return;
    if (!this.player) return;

    const x = this.player.x - 1;

    if (this.isOverlapping({x})) return;

    this.triggerLoop();

    this.updatePlayer({x});
  }

  protected moveRight(released: boolean): void {
    if (released) return;
    if (!this.player) return;

    const x = this.player.x + 1;

    if (this.isOverlapping({x})) return;

    this.triggerLoop();

    this.updatePlayer({x});
  }

  protected moveDown(released: boolean): void {
    if(released) return;

    if (!this.player) return;

    const y = this.player.y + 1;

    if (this.isOverlapping({y})) {
      this.commitState();
      return;
    }

    this.triggerLoop();

    this.updatePlayer({y});
  }

  protected rotate(released: boolean): void {
    if (released) return;
    if (!this.player) return;

    const shape = this.player.rotate();

    if (this.isOverlapping({shape})) return;

    this.triggerLoop();

    this.updatePlayer({shape});
  }

  protected resetPlayer(): void {
    if (this.player) {
      this.player.update({shape: this.getRandomShape()});
    } else {
      this.player = new Player(this.getRandomShape());
    }

    const { width, height } = getMeasurements(this.player!.shape);

    this.player!.update({ 
      x: Math.floor(this.config.width / 2 - width / 2), 
      y: -height + 1
    });

    //check for end game
    //TODO: extract to the separate method
    if (this.isOverlapping({})) {
      this.inProgress = false;
      clearTimeout(this.loopRef);
      console.log("Game Over");
      return;
    }
    
    this.updateRender();
  }

  protected getRandomShape(): ShapeMatrix {
    const randomShape = Math.ceil(
      Math.random() * Object.keys(shapes).length,
    ) as keyof typeof shapes;

    return shapes[randomShape];
  }

  protected get mergedField(): FieldMap {
    const map = this.field!.map(function (arr) {
      return arr.slice();
    });
    const { shape, x, y } = this.player!;

    shape.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell && y + i >= 0) {
          map[y + i][x + j] = cell;
        }
      });
    });

    return map;
  }

  protected updatePlayer(mutation: Partial<PlayerShape>): void {
    this.player!.update(mutation);
    this.updateRender();
  }

  protected updateRender(): void {
    this.renderer!.updateFields(this.mergedField);
  }

  protected commitState(): void {
    this.field = this.mergedField;
    this.processCompletedLines();
    this.resetPlayer();
    this.triggerLoop();
  }

  protected processCompletedLines(): void {
    const notCompletedLines = this.field!.filter((row) => row.some((cell) => !cell));

    if (this.field?.length !== notCompletedLines.length) {
      const diff = this.field!.length - notCompletedLines.length;

      this.field = [
        ...Array(diff).fill(null).map(() => Array(this.config.width).fill(0)),
        ...notCompletedLines,
      ];
    }
  }

  protected isOverlapping({shape, x, y}: Partial<PlayerShape>): boolean {
    const _shape = shape ?? this.player!.shape;
    const _x = x ?? this.player!.x;
    const _y = y ?? this.player!.y;
    
    const { width, height } = getMeasurements(_shape);

    if (_x < 0 || 
        _x + width > this.config.width || 
        _y + height > this.config.height) {
      return true;
    }

    return _shape.some((row, i) => row.some((cell, j) => 
      !!(this.field![_y + i]?.[_x + j] && cell)
    ));
  }
}
