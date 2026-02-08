import "./style.css";
import { PLAYER_1, SYSTEM } from "@rcade/plugin-input-classic";
import AppPhaseManager from "./appPhase";
import { setGameLoop, SCREEN } from "./canvas";
import bulletManager from "./bullets/BulletManager";
import PatternRain from "./bullets/patterns/Rain";
import PatternAimedVolley from "./bullets/patterns/AimedVolley";
import PatternSingle from "./bullets/patterns/Single";

const app = new AppPhaseManager();

const position = { x: 0, y: 0 };

const drawPlayer = (context: CanvasRenderingContext2D) => {
  context.fillStyle = "#fff";
  context.beginPath();
  context.arc(position.x, position.y, 5, 0, Math.PI * 2, true);
  context.fill();
};

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
      bulletManager.clear();
      bulletManager.addPattern(
        new PatternRain({ duration: 500, minVel: 1.5, generateInterval: 2 }),
      );
      bulletManager.addPattern(
        new PatternAimedVolley({
          duration: 60,
          minVel: 3,
          origin: { x: -30, y: SCREEN.HEIGHT / 2 },
          generateInterval: 7,
        }),
      );
      bulletManager.addPattern(
        new PatternSingle({
          origin: { x: SCREEN.WIDTH_CENTER, y: 0 - 30 },
          target: { x: SCREEN.WIDTH_CENTER, y: SCREEN.HEIGHT },
          radius: 30,
          speed: 1,
        }),
      );
      app.advance();
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

    position.x = Math.min(
      Math.max(position.x, SCREEN.BUFFER),
      SCREEN.WIDTH - SCREEN.BUFFER,
    );

    position.y = Math.min(
      Math.max(position.y, SCREEN.BUFFER),
      SCREEN.HEIGHT - SCREEN.BUFFER,
    );

    context.fillStyle = "#fff";
    context.textAlign = "left";
    context.fillText(`bullets: ${bulletManager.getBulletCount()}`, 8, 16);

    bulletManager.updatePatterns(getFrameTimeNormalizedNum(1), position);
    bulletManager.draw(context);

    if (bulletManager.bulletCollisionAt(position)) {
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
