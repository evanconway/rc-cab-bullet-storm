import "./style.css";
import { PLAYER_1, SYSTEM } from "@rcade/plugin-input-classic";
import { setGameLoop, SCREEN } from "./canvas";
import BulletGen from "./bulletGen";

const bulletManager = new BulletGen();

const position = { x: SCREEN.WIDTH / 2, y: SCREEN.HEIGHT / 2 };

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

setGameLoop(({ context, getFrameTimeNormalizedNum }) => {
  const speed = getFrameTimeNormalizedNum(Math.sqrt(8));

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
  context.fillText(`bullets: ${bulletManager.getBulletCount()}`, 8, 16);

  drawPlayerBox(context);
});
