import "./style.css";
import { Game } from "./game";

const config = { width: 10, height: 25, root: "app" };

const game = new Game(config);

game.init();
game.start();
