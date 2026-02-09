import "./style.css";
import { SYSTEM } from "@rcade/plugin-input-classic";
import player from "./player";
import app from "./appPhase";
import { setGameLoop, SCREEN } from "./canvas";
import bulletManager from "./bullets/BulletManager";
import PatternSequence from "./PatternSequence";

const GAME_OVER_SCREEN_TIME = 3000;
const SCORE_RATE = 100; // lower is faster
let patternSequence = new PatternSequence();

setGameLoop(({ context, getFrameTimeNormalizedNum, frameTime }) => {
  const normalizedUnit = getFrameTimeNormalizedNum(1);

  context.font = "16px system-ui";

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
    player.updatePosition(normalizedUnit);

    const newPatterns = patternSequence.getPatternsPassedTime(
      app.getPhaseTime(),
    );

    newPatterns.forEach((p) => bulletManager.addPattern(p));

    bulletManager.updatePatterns(
      frameTime,
      normalizedUnit,
      player.getPosition(),
    );
    bulletManager.deletePatternsMarkedForDeletion();
    bulletManager.draw(context);

    const closestBulletDist = bulletManager.getShortestBulletDistance(
      player.getPosition(),
    );

    if (closestBulletDist !== null) {
      app.scoreAdd(
        (Math.max(0, 50 - closestBulletDist) * normalizedUnit) / SCORE_RATE,
      );
      if (closestBulletDist <= 0) {
        app.setPhaseGameOver(false);
      }
    }

    if (patternSequence.getComplete() && bulletManager.getPatternCount() <= 0) {
      app.setPhaseGameOver(true);
    }

    player.draw(context);
  } else if (app.isPhaseGameOver()) {
    bulletManager.draw(context);
    if (app.getAllowPlayerControl()) {
      player.updatePosition(normalizedUnit);
    }
    player.draw(context);

    context.fillStyle = "#09FF00";
    context.textAlign = "center";
    context.fillText("game over", SCREEN.WIDTH_CENTER, SCREEN.HEIGHT_CENTER);

    if (app.getPhaseTime() >= GAME_OVER_SCREEN_TIME) {
      app.setPhaseStartGame();
    }
  }

  app.increasePhaseTime(frameTime);
  context.fillStyle = "#09FF00";
  context.textAlign = "left";
  context.fillText(
    `frame time: ${frameTime}, phase time: ${app.getPhaseTime()}`,
    2,
    SCREEN.HEIGHT - 2,
  );

  if (app.isPhasePlaying() || app.isPhaseGameOver()) {
    context.fillStyle = "#fff";
    context.textAlign = "left";
    context.fillText(`score: ${app.getScore()}`, 8, 16);
  }
});
