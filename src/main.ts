import "./style.css";
import { SYSTEM } from "@rcade/plugin-input-classic";
import player from "./player";
import app from "./appPhase";
import { setGameLoop, SCREEN } from "./canvas";
import bulletManager from "./bullets/BulletManager";
import PatternSequence from "./PatternSequence";

const GAME_OVER_SCREEN_TIME = 3000;

const PLAYER_SPEED = 3; // integer value for traveling at 45 degree angle

let patternSequence = new PatternSequence();

setGameLoop(({ context, getFrameTimeNormalizedNum, frameTime }) => {
  app.increasePhaseTime(frameTime);
  context.fillStyle = "#09FF00";
  context.textAlign = "left";
  context.fillText(
    `frame time: ${frameTime}, phase time: ${app.getPhaseTime()}`,
    8,
    8,
  );
  if (app.isPhaseStartGame()) {
    context.fillStyle = "#09FF00";
    context.textAlign = "center";
    context.fillText(
      "Press Player 1 Start",
      SCREEN.WIDTH_CENTER,
      SCREEN.HEIGHT * 0.3,
    );

    player.setPosition({ x: SCREEN.WIDTH_CENTER, y: SCREEN.HEIGHT_CENTER });

    if (SYSTEM.ONE_PLAYER) {
      bulletManager.clear();
      patternSequence = new PatternSequence();
      app.setPhasePlaying();
    }

    player.draw(context);
  } else if (app.isPhasePlaying()) {
    player.updatePosition(
      getFrameTimeNormalizedNum(Math.sqrt(Math.pow(PLAYER_SPEED, 2) / 2)),
    );

    const newPatterns = patternSequence.getPatternsPassedTime(
      app.getPhaseTime(),
    );

    newPatterns.forEach((p) => bulletManager.addPattern(p));

    bulletManager.updatePatterns(
      frameTime,
      getFrameTimeNormalizedNum(1),
      player.getPosition(),
    );
    bulletManager.draw(context);

    if (bulletManager.bulletCollisionAt(player.getPosition())) {
      app.setPhaseGameOver();
    }

    player.draw(context);

    context.fillStyle = "#fff";
    context.textAlign = "left";
    context.fillText(`bullets: ${bulletManager.getBulletCount()}`, 8, 16);
  } else if (app.isPhaseGameOver()) {
    bulletManager.draw(context);

    context.fillStyle = "#fff";
    context.textAlign = "left";
    context.fillText(`bullets: ${bulletManager.getBulletCount()}`, 8, 16);

    player.draw(context);

    context.fillStyle = "#09FF00";
    context.textAlign = "center";
    context.fillText("game over", SCREEN.WIDTH_CENTER, SCREEN.HEIGHT_CENTER);

    if (app.getPhaseTime() >= GAME_OVER_SCREEN_TIME) {
      app.setPhaseStartGame();
    }
  }
});
