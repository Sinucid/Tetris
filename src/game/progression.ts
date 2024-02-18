export class GameProgression {
  calcSpeed(base: number, level: number): number {
    return base * 0.96 ** (level - 1);
  }

  calcLevel(base: number, total: number): number {
    return Math.floor(total / base) + 1;
  }
}
