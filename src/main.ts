import "./style.css";
import { PLAYER_1, SYSTEM } from "@rcade/plugin-input-classic";
import { setGameLoop, SCREEN } from "./canvas";
import BulletGen from "./bulletGen";

const bulletManager = new BulletGen();

const position = { x: 0, y: 0 };

const drawPlayerBox = (context: CanvasRenderingContext2D) => {
  context.fillStyle = "#fff";
  const playerSize = 10;
  context.fillRect(
    Math.floor(position.x - playerSize / 2),
    Math.floor(position.y - playerSize / 2),
    10,
    10,
  );
};

const BULLET_GEN_INTERVAL = 5;
let bulletGenTime = 0;

let gamePhase: 0 | 1 | 2 = 0;
const GAME_OVER_SCREEN_TIME = 60 * 4;
let gameOverTime = 0;

const PLAYER_SPEED = 3; // integer value for traveling at 45 degree angle

setGameLoop(({ context, getFrameTimeNormalizedNum }) => {
  if (gamePhase === 0) {
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
      gamePhase = 1;
      bulletManager.clearAllBullets();
    }

    drawPlayerBox(context);
  } else if (gamePhase === 1) {
    const speed = getFrameTimeNormalizedNum(
      Math.sqrt(Math.pow(PLAYER_SPEED, 2) / 2),
    );

    if (PLAYER_1.DPAD.up) position.y -= speed;
    if (PLAYER_1.DPAD.down) position.y += speed;
    if (PLAYER_1.DPAD.left) position.x -= speed;
    if (PLAYER_1.DPAD.right) position.x += speed;

    bulletGenTime += getFrameTimeNormalizedNum(1);
    if (bulletGenTime >= BULLET_GEN_INTERVAL) {
      bulletManager.genSimpleRandomEdgeBullet();
      bulletGenTime = 0;
    }

    bulletManager.update(getFrameTimeNormalizedNum(1));
    bulletManager.draw(context);

    context.fillStyle = "#fff";
    context.textAlign = "left";
    context.fillText(`bullets: ${bulletManager.getBulletCount()}`, 8, 16);

    if (bulletManager.getBulletOverlapsPosition(position, 5)) {
      gamePhase = 2;
      gameOverTime = 0;
    }

    drawPlayerBox(context);
  } else if (gamePhase === 2) {
    bulletManager.draw(context);

    context.fillStyle = "#fff";
    context.textAlign = "left";
    context.fillText(`bullets: ${bulletManager.getBulletCount()}`, 8, 16);

    drawPlayerBox(context);

    context.fillStyle = "#09FF00";
    context.textAlign = "center";
    context.fillText("game over", SCREEN.WIDTH / 2, SCREEN.HEIGHT / 2);

    gameOverTime += getFrameTimeNormalizedNum(1);
    if (gameOverTime >= GAME_OVER_SCREEN_TIME) {
      gamePhase = 0;
    }
  }
});
