import * as PIXI from "pixi.js";
import { Application } from "pixi.js";
import { initAssets } from "./assets";
import { gsap } from "gsap";
import { CustomEase, PixiPlugin } from "gsap/all";
import Game from "./game";

export const GAME_WIDTH = 480;
export const GAME_HEIGHT = 800;

export const app = new Application({
  backgroundColor: 0x000000,
  // antialias: true,
  hello: true,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
});

app.ticker.stop();
gsap.ticker.add(() => {
  app.ticker.update();
});

async function init() {
  document.body.appendChild(app.view);

  await initAssets();

  gsap.registerPlugin(PixiPlugin, CustomEase);
  PixiPlugin.registerPIXI(PIXI);

  let game = new Game();
  app.stage.addChild(game);
  
  app.ticker.add((deltaTime) => {
    game.update(deltaTime);
  });
}

init();