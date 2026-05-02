import "./style.css";
import { SYSTEM } from "@rcade/plugin-input-classic";
import player from "./player";
import app from "./appPhase";
import { setGameLoop, SCREEN } from "./canvas";
import bulletManager from "./bullets/BulletManager";
import PatternSequence from "./PatternSequence";
import Lives, { DEAD_STATES } from "./Lives";

const GAME_OVER_SCREEN_TIME = 3000;
const SCORE_RATE = 100; // lower is faster
let patternSequence = new PatternSequence();
const player1Lives = new Lives(3);

setGameLoop(({ context, getFrameTimeNormalizedNum, frameTime }) => {
  const normalizedUnit = getFrameTimeNormalizedNum(1);

  context.font = "16px system-ui";

  if (app.isPhaseStartGame()) {
    // draw start game text
    context.globalAlpha =
      ((Math.sin(app.getPhaseTime() / 500) + 1) / 2) * 0.7 + 0.3;
    context.fillStyle = "#09FF00";
    context.textAlign = "center";
    context.fillText(
      "Press Player 1 Start",
      SCREEN.WIDTH_CENTER,
      SCREEN.HEIGHT * 0.3,
    );
    context.globalAlpha = 1;
    context.fillStyle = "#FFFFFF";

    const modPhaseTime = app.getPhaseTime() % 12000;
    if (modPhaseTime < 4000) {
      context.fillText(
        "Score rises when closer to bullets.",
        SCREEN.WIDTH_CENTER,
        SCREEN.HEIGHT * 0.5,
      );
    } else if (modPhaseTime < 8000) {
      context.fillText(
        "Touch a bullet, lose a life.",
        SCREEN.WIDTH_CENTER,
        SCREEN.HEIGHT * 0.5,
      );
    } else if (modPhaseTime < 12000) {
      context.fillText(
        "Use control stick to move.",
        SCREEN.WIDTH_CENTER,
        SCREEN.HEIGHT * 0.5,
      );
      context.fillText(
        "Hold A button to move precisely.",
        SCREEN.WIDTH_CENTER,
        SCREEN.HEIGHT * 0.6,
      );
    }

    player.setPosition({ x: SCREEN.WIDTH_CENTER, y: SCREEN.HEIGHT_CENTER });

    if (SYSTEM.ONE_PLAYER) {
      bulletManager.clear();
      patternSequence = new PatternSequence();
      app.setPhasePlaying();
      player1Lives.reset();
    }

    // player.draw(context);
  } else if (app.isPhasePlaying()) {
    if (
      player1Lives.getState() === DEAD_STATES.ALIVE ||
      player1Lives.getState() === DEAD_STATES.INTANGIBLE
    ) {
      player.updatePosition(normalizedUnit);
    }

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

    if (closestBulletDist !== null && closestBulletDist > 0) {
      app.scoreAdd(
        (Math.max(0, 50 - closestBulletDist) * normalizedUnit) / SCORE_RATE,
      );
    }

    if (patternSequence.getComplete() && bulletManager.getPatternCount() <= 0) {
      app.setPhaseGameOver(true);
    } else {
      player1Lives.advanceTime(frameTime);
      if (
        player1Lives.getState() === DEAD_STATES.ALIVE &&
        closestBulletDist !== null &&
        closestBulletDist <= 0
      ) {
        player1Lives.startDeath();
        if (player1Lives.getLives() <= 0) {
          app.setPhaseGameOver(false);
        }
      }
    }

    if (player1Lives.getState() === DEAD_STATES.ALIVE) {
      player.draw(context);
    } else if (player1Lives.getState() === DEAD_STATES.FLASH) {
      context.fillStyle = `rgba(255, 0, 0, ${player1Lives.getFlashAlpha() * 0.7})`;
      context.fillRect(0, 0, SCREEN.WIDTH, SCREEN.HEIGHT);
    } else if (player1Lives.getState() === DEAD_STATES.INTANGIBLE) {
      player.draw(context, 0.5);
    }
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
  if (import.meta.env.DEV) {
    context.fillStyle = "#09FF00";
    context.textAlign = "left";
    context.fillText(
      `frame time: ${frameTime}, phase time: ${app.getPhaseTime()}`,
      2,
      SCREEN.HEIGHT - 2,
    );
  }

  if (app.isPhasePlaying() || app.isPhaseGameOver()) {
    context.fillStyle = "#fff";
    context.textAlign = "left";
    context.fillText(
      `lives: ${player1Lives.getLives()}, score: ${app.getScore()}`,
      12,
      24,
    );
  }
});
