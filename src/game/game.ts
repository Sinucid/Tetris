import { Field } from "../fieldMap";
import { GameConfig, FieldMap, GameStates } from "../models";
import { Player, PlayerShape } from "../player";
import { Actions, Control } from "../control";
import { getMeasurements, getRandomShape } from "../utils";
import { GameProgression } from ".";
import { Render } from "../render";

export class Game {
  protected loopRef?: number;

  protected control: Control;
  protected field: Field;
  protected render = new Render();
  protected player: Player | null = null;
  protected progression = new GameProgression();

  protected speed: number;
  protected scores = 0;
  protected level = 1;
  protected gameState = GameStates.NotStarted;

  protected get inProgress(): boolean {
    return this.gameState === GameStates.InProgress;
  }

  protected get mergedField(): FieldMap {
    const map = this.field.getMap().map(function (arr) {
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

  constructor(protected config: GameConfig) {
    this.speed = config.baseSpeed;
    this.field = new Field(this.config);
    this.control = new Control(this.handleControls.bind(this));
  }

  init(): void {
    this.render.createTemplate(this.config, this.field.getMap(), {
      level: this.level,
      scores: this.scores,
      state: this.gameState,
      onStateChange: this.handleBarClick.bind(this),
    });
  }

  start(): void {
    this.gameState = GameStates.InProgress;
    this.resetGame();
    this.triggerLoop();
  }

  protected triggerLoop(): void {
    if (!this.inProgress) return;
    if (this.loopRef) clearTimeout(this.loopRef);
    this.loopRef = setTimeout(() => {
      this.moveDown();
    }, this.speed);
  }

  protected handleControls(action: Actions): void {
    if (!this.inProgress) return;

    switch (action) {
      case Actions.MoveLeft:
        this.moveLeft();
        break;
      case Actions.MoveRight:
        this.moveRight();
        break;
      case Actions.MoveDown:
        this.moveDown();
        break;
      case Actions.Rotate:
        this.rotate();
        break;
    }
  }

  protected moveLeft(): void {
    const x = this.player!.x - 1;

    if (this.isOverlapping({ x })) return;

    this.triggerLoop();

    this.updatePlayer({ x });
  }

  protected moveRight(): void {
    const x = this.player!.x + 1;

    if (this.isOverlapping({ x })) return;

    this.triggerLoop();

    this.updatePlayer({ x });
  }

  protected moveDown(): void {
    const y = this.player!.y + 1;

    if (this.isOverlapping({ y })) {
      this.commitState();
      return;
    }

    this.triggerLoop();

    this.updatePlayer({ y });
  }

  protected rotate(): void {
    const shape = this.player!.rotate();

    if (this.isOverlapping({ shape })) return;

    this.triggerLoop();

    this.updatePlayer({ shape });
  }

  protected resetPlayer(): void {
    if (this.player) {
      this.player.update({ shape: getRandomShape() });
    } else {
      this.player = new Player(getRandomShape());
    }

    const { width, height } = getMeasurements(this.player!.shape);

    this.player!.update({
      x: Math.floor(this.config.width / 2 - width / 2),
      y: -height + 1,
    });

    //check for end game
    if (this.isOverlapping({})) {
      this.endGame();
      return;
    }

    this.updateRender();
  }

  protected updatePlayer(mutation: Partial<PlayerShape>): void {
    this.player!.update(mutation);
    this.updateRender();
  }

  protected updateRender(): void {
    this.render!.updateFields(this.mergedField);
  }

  protected updateBar(): void {
    this.render!.updateScoresBar({
      level: this.level,
      scores: this.scores,
      state: this.gameState,
      onStateChange: this.handleBarClick.bind(this),
    });
  }

  protected handleBarClick(): void {
    switch (this.gameState) {
      case GameStates.NotStarted:
      case GameStates.Ended:
        this.start();
        break;
      case GameStates.InProgress:
        this.gameState = GameStates.Paused;
        clearTimeout(this.loopRef);
        break;
      case GameStates.Paused:
        this.gameState = GameStates.InProgress;
        this.triggerLoop();
        break;
    }

    this.updateBar();
  }

  protected commitState(): void {
    this.field.setMap(this.mergedField);
    this.processCompletedLines();
    this.resetPlayer();
    this.triggerLoop();
  }

  protected endGame(): void {
    this.gameState = GameStates.Ended;
    clearTimeout(this.loopRef);

    this.updateBar();
  }

  protected resetGame(): void {
    this.scores = 0;
    this.level = 1;
    this.field.clear();
    this.resetPlayer();
  }

  protected processCompletedLines(): void {
    const currentField = this.field.getMap();
    const notCompletedLines = currentField.filter((row) =>
      row.some((cell) => !cell),
    );

    if (currentField.length !== notCompletedLines.length) {
      const lines = currentField.length - notCompletedLines.length;

      this.addScores(lines);

      this.field.setMap([
        ...Array(lines)
          .fill(null)
          .map(() => Array(this.config.width).fill(0)),
        ...notCompletedLines,
      ]);
    }
  }

  protected addScores(lines: number): void {
    this.scores += this.config.scorePerLine * lines;
    this.level = this.progression.calcLevel(
      this.config.scorePerLevel,
      this.scores,
    );
    this.speed = this.progression.calcSpeed(this.config.baseSpeed, this.level);

    this.updateBar();
  }

  protected isOverlapping({ shape, x, y }: Partial<PlayerShape>): boolean {
    const _shape = shape ?? this.player!.shape;
    const _x = x ?? this.player!.x;
    const _y = y ?? this.player!.y;

    const { width, height } = getMeasurements(_shape);

    if (
      _x < 0 ||
      _x + width > this.config.width ||
      _y + height > this.config.height
    ) {
      return true;
    }

    return _shape.some((row, i) =>
      row.some((cell, j) => !!(this.field.getMap()[_y + i]?.[_x + j] && cell)),
    );
  }
}
