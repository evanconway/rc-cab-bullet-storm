import "./style.css";
import { SYSTEM } from "@rcade/plugin-input-classic";
import player from "./player";
import AppPhaseManager from "./appPhase";
import { setGameLoop, SCREEN } from "./canvas";
import bulletManager from "./bullets/BulletManager";
import PatternRain from "./bullets/patterns/Rain";
import PatternAimedVolley from "./bullets/patterns/AimedVolley";
import PatternSingle from "./bullets/patterns/Single";

const app = new AppPhaseManager();

const GAME_OVER_SCREEN_TIME = 60 * 3;
let gameOverTime = 0;

const PLAYER_SPEED = 3; // integer value for traveling at 45 degree angle

setGameLoop(({ context, getFrameTimeNormalizedNum }) => {
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

    player.draw(context);
  } else if (app.isPhasePlaying()) {
    player.updatePosition(
      getFrameTimeNormalizedNum(Math.sqrt(Math.pow(PLAYER_SPEED, 2) / 2)),
    );

    bulletManager.updatePatterns(
      getFrameTimeNormalizedNum(1),
      player.getPosition(),
    );
    bulletManager.draw(context);

    if (bulletManager.bulletCollisionAt(player.getPosition())) {
      app.advance();
      gameOverTime = 0;
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

    gameOverTime += getFrameTimeNormalizedNum(1);
    if (gameOverTime >= GAME_OVER_SCREEN_TIME) {
      app.advance();
    }
  }
});
