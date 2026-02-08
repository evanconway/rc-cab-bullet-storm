import "./style.css";
import { PLAYER_1, SYSTEM } from "@rcade/plugin-input-classic";
import AppPhaseManager from "./appPhase";
import { setGameLoop, SCREEN } from "./canvas";
import BulletGen from "./bulletGen";

const app = new AppPhaseManager();
const bulletManager = new BulletGen();

const position = { x: 0, y: 0 };

const drawPlayer = (context: CanvasRenderingContext2D) => {
  context.fillStyle = "#fff";
  context.beginPath();
  context.arc(position.x, position.y, 5, 0, Math.PI * 2, true);
  context.fill();
};

let bulletGenInterval = 10;
let bulletGenTime = 0;

let bulletGenIntervalMod = 1; // decreasing increases frequency (difficulty)

const GAME_PHASE_TIME = 60 * 15;
let gamePhaseTimeCurrent = 0;
let gamePhase = 0;

const GAME_OVER_SCREEN_TIME = 60 * 3;
let gameOverTime = 0;

const PLAYER_SPEED = 3; // integer value for traveling at 45 degree angle

setGameLoop(({ context, getFrameTimeNormalizedNum }) => {
  if (app.isPhaseStartGame()) {
    context.fillStyle = "#09FF00";
    context.textAlign = "center";
    context.fillText(
      "Press Player 1 Start",
      SCREEN.WIDTH / 2,
      SCREEN.HEIGHT * 0.3,
    );

    position.x = SCREEN.WIDTH / 2;
    position.y = SCREEN.HEIGHT / 2;

    if (SYSTEM.ONE_PLAYER) {
      app.advance();
      bulletManager.clearAllBullets();
    }

    drawPlayer(context);
  } else if (app.isPhasePlaying()) {
    const speed = getFrameTimeNormalizedNum(
      Math.sqrt(Math.pow(PLAYER_SPEED, 2) / 2),
    );

    if (PLAYER_1.DPAD.up) position.y -= speed;
    if (PLAYER_1.DPAD.down) position.y += speed;
    if (PLAYER_1.DPAD.left) position.x -= speed;
    if (PLAYER_1.DPAD.right) position.x += speed;

    bulletGenTime += getFrameTimeNormalizedNum(1);
    gamePhaseTimeCurrent += getFrameTimeNormalizedNum(1);

    if (gamePhaseTimeCurrent < GAME_PHASE_TIME) {
      if (gamePhase === 0) {
        bulletGenInterval = 6;
        if (bulletGenTime >= bulletGenInterval * bulletGenIntervalMod) {
          bulletManager.addSimpleEdgeBullet(1);
          bulletGenTime = 0;
        }
      } else if (gamePhase === 1) {
        bulletGenInterval = 9;
        if (bulletGenTime >= bulletGenInterval * bulletGenIntervalMod) {
          bulletManager.addSimpleEdgeBullet(0);
          bulletManager.addSimpleEdgeBullet(2);
          bulletGenTime = 0;
        }
      } else if (gamePhase === 2) {
        bulletGenInterval = 5;
        if (bulletGenTime >= bulletGenInterval * bulletGenIntervalMod) {
          bulletManager.addSimpleRandomEdgeBullet();
          bulletGenTime = 0;
        }
      }
    } else if (bulletManager.getBulletCount() <= 0) {
      gamePhase += 1;
      gamePhaseTimeCurrent = 0;
      if (gamePhase >= 3) {
        gamePhase = 0;
        bulletGenIntervalMod *= 0.7;
      }
    }

    bulletManager.update(getFrameTimeNormalizedNum(1));
    bulletManager.draw(context);

    context.fillStyle = "#fff";
    context.textAlign = "left";
    context.fillText(`bullets: ${bulletManager.getBulletCount()}`, 8, 16);

    if (bulletManager.getBulletOverlapsPosition(position, 1)) {
      app.advance();
      gameOverTime = 0;
    }

    drawPlayer(context);
  } else if (app.isPhaseGameOver()) {
    bulletManager.draw(context);

    context.fillStyle = "#fff";
    context.textAlign = "left";
    context.fillText(`bullets: ${bulletManager.getBulletCount()}`, 8, 16);

    drawPlayer(context);

    context.fillStyle = "#09FF00";
    context.textAlign = "center";
    context.fillText("game over", SCREEN.WIDTH / 2, SCREEN.HEIGHT / 2);

    gameOverTime += getFrameTimeNormalizedNum(1);
    if (gameOverTime >= GAME_OVER_SCREEN_TIME) {
      app.advance();
    }
  }
});
