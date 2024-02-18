import { GameStates } from "../models";

export interface BarConfig {
  level: number;
  scores: number;
  state: GameStates;
  onStateChange: () => void;
}

export class Bar {
  createBar(config: BarConfig) {
    const bar = new DocumentFragment();
    bar.appendChild(this.createText(`Level: ${config.level}`));
    bar.appendChild(this.createText(`Scores: ${config.scores}`));
    bar.appendChild(
      this.createButton(this.getButtonText(config.state), config.onStateChange),
    );
    bar.appendChild(
      this.createText(config.state === GameStates.Paused ? "PAUSED" : ""),
    );

    return bar;
  }

  updateBar(config: BarConfig) {
    const texts = document.querySelectorAll("aside > h2");
    texts[0].textContent = `Level: ${config.level}`;
    texts[1].textContent = `Scores: ${config.scores}`;
    texts[2].textContent = this.getMessageText(config.state);
    const button = document.querySelector("aside > button");
    button!.textContent = this.getButtonText(config.state);
  }

  protected createText(text: string) {
    const element = document.createElement("h2");
    element.textContent = text;
    return element;
  }

  protected createButton(text: string, onClick: () => void) {
    const element = document.createElement("button");
    element.textContent = text;
    element.onclick = onClick;
    return element;
  }

  protected getButtonText(state: GameStates) {
    switch (state) {
      case GameStates.NotStarted:
      case GameStates.Ended:
        return "start game";
      case GameStates.InProgress:
        return "pause";
      case GameStates.Paused:
        return "continue";
    }
  }

  protected getMessageText(state: GameStates) {
    switch (state) {
      case GameStates.Paused:
        return "PAUSED";
      case GameStates.Ended:
        return "GAME OVER";
      default:
        return "";
    }
  }
}
