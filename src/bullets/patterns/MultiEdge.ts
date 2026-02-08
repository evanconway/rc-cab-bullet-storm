import { SCREEN } from "../../canvas";
import Pattern, {
  bulletIsOffScreen,
  bulletIsOnScreen,
  getUnitVectorComponents,
} from "./Pattern";
import type { Bullet, Position } from "./Pattern";

const TARGET_RANDOM_MOD = 20;

interface PatternBullet extends Bullet {
  velocity: { x: number; y: number };
  hasEnteredScreen: boolean;
}

class PatternMultiEdge extends Pattern {
  private time: number;
  private duration: number;
  private frequency: number;
  private generateTime: number;
  private radius: number;
  private speed: number;

  constructor({
    duration,
    frequency,
    radius,
    speed,
  }: {
    duration: number;
    frequency: number;
    radius: number;
    speed: number;
  }) {
    super();
    this.time = 0;
    this.duration = duration;
    this.frequency = frequency;
    this.generateTime = 0;
    this.radius = radius;
    this.speed = speed;
  }

  update(frameTime: number, unit: number): void {
    this.time += frameTime;
    while (this.time <= this.duration && this.generateTime >= this.frequency) {
      this.generateTime -= this.frequency;

      const newBullet: PatternBullet = {
        radius: this.radius,
        position: { x: 0, y: 0 },
        velocity: { x: 0, y: 0 },
        hasEnteredScreen: false,
      };

      const randomTarget: Position = {
        x:
          SCREEN.WIDTH_CENTER +
          Math.random() * TARGET_RANDOM_MOD -
          TARGET_RANDOM_MOD / 2,
        y:
          SCREEN.HEIGHT_CENTER +
          Math.random() * TARGET_RANDOM_MOD -
          TARGET_RANDOM_MOD / 2,
      };

      const edge = Math.floor(Math.random() * 4);
      if (edge === 0) {
        // left
        newBullet.position.x = SCREEN.BUFFER * -1;
        newBullet.position.y = Math.random() * SCREEN.HEIGHT;
      } else if (edge === 1) {
        // right
        newBullet.position.x = SCREEN.BUFFER;
        newBullet.position.y = Math.random() * SCREEN.HEIGHT;
      } else if (edge === 2) {
        // top
        newBullet.position.x = Math.random() * SCREEN.WIDTH;
        newBullet.position.y = SCREEN.BUFFER * -1;
      } else if (edge === 3) {
        // bottom
        newBullet.position.x = Math.random() * SCREEN.WIDTH;
        newBullet.position.y = SCREEN.BUFFER;
      }
      const { unitVectorX, unitVectorY } = getUnitVectorComponents(
        newBullet.position,
        randomTarget,
      );
      newBullet.velocity.x = unitVectorX;
      newBullet.velocity.y = unitVectorY;
      this.addBullet(newBullet);
    }

    this.bullets.forEach((bullet, id) => {
      const single = bullet as PatternBullet;
      single.position.x += single.velocity.x * unit;
      single.position.y += single.velocity.y * unit;

      if (bulletIsOnScreen(single)) {
        single.hasEnteredScreen = true;
      }

      if (single.hasEnteredScreen && bulletIsOffScreen(single)) {
        this.removeBullet(id);
      }
    });
  }

  canDelete(): boolean {
    return this.bullets.size <= 0;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = "#070";
    this.bullets.forEach((b) => {
      ctx.beginPath();
      ctx.arc(b.position.x, b.position.y, b.radius, 0, Math.PI * 2, true);
      ctx.stroke();
    });
  }
}

export default PatternMultiEdge;
