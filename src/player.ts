import { PLAYER_1 } from "@rcade/plugin-input-classic";
import type { Position } from "./bullets/patterns/Pattern";
import { SCREEN } from "./canvas";

class Player {
  private position: Position;

  constructor() {
    this.position = { x: 0, y: 0 };
  }

  setPosition(position: Position) {
    this.position = position;
  }

  getPosition() {
    return this.position;
  }

  updatePosition(speed: number) {
    if (PLAYER_1.DPAD.up) this.position.y -= speed;
    if (PLAYER_1.DPAD.down) this.position.y += speed;
    if (PLAYER_1.DPAD.left) this.position.x -= speed;
    if (PLAYER_1.DPAD.right) this.position.x += speed;
    this.position.x = Math.min(
      Math.max(this.position.x, SCREEN.BUFFER),
      SCREEN.WIDTH - SCREEN.BUFFER,
    );
    this.position.y = Math.min(
      Math.max(this.position.y, SCREEN.BUFFER),
      SCREEN.HEIGHT - SCREEN.BUFFER,
    );
  }

  draw(context: CanvasRenderingContext2D) {
    context.fillStyle = "#fff";
    context.beginPath();
    context.arc(this.position.x, this.position.y, 5, 0, Math.PI * 2, true);
    context.fill();
  }
}

export default new Player();
