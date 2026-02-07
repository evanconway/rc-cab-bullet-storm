import "./style.css";
import { PLAYER_1, SYSTEM } from "@rcade/plugin-input-classic";
import { setGameLoop, SCREEN } from "./canvas";

const position = { x: SCREEN.WIDTH / 2, y: SCREEN.HEIGHT / 2 };

setGameLoop(({ context, getFrameTimeNormalizedNum }) => {
  const speed = getFrameTimeNormalizedNum(Math.sqrt(2));

  if (PLAYER_1.DPAD.up) position.y -= speed;
  if (PLAYER_1.DPAD.down) position.y += speed;
  if (PLAYER_1.DPAD.left) position.x -= speed;
  if (PLAYER_1.DPAD.right) position.x += speed;

  context.fillStyle = "#fff";
  context.fillText("hello world", 8, 16);

  context.fillRect(Math.floor(position.x), Math.floor(position.y), 10, 10);
});
