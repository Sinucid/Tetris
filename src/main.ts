import "./style.css";
import { Game } from "./game";

const config = {
  width: 10,
  height: 25,
  root: "app",
  baseSpeed: 1000,
  scorePerLine: 100,
  scorePerLevel: 1000,
};

const game = new Game(config);

game.init();
