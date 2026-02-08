import { SCREEN } from "../../canvas";
import Pattern, {
  bulletIsOffScreen,
  bulletIsOnScreen,
  getRandomScreenEdge,
  getUnitVectorComponents,
  isScreenEdgeBottom,
  isScreenEdgeLeft,
  isScreenEdgeRight,
  isScreenEdgeTop,
} from "./Pattern";
import type { Bullet, Position } from "./Pattern";

const TARGET_RANDOM_MOD = SCREEN.WIDTH * 0.7;

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
    this.generateTime += frameTime;
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

      const edge = getRandomScreenEdge();
      if (isScreenEdgeLeft(edge)) {
        // left
        newBullet.position.x = this.radius * -1;
        newBullet.position.y = Math.random() * SCREEN.HEIGHT;
      } else if (isScreenEdgeRight(edge)) {
        // right
        newBullet.position.x = SCREEN.WIDTH + this.radius;
        newBullet.position.y = Math.random() * SCREEN.HEIGHT;
      } else if (isScreenEdgeTop(edge)) {
        // top
        newBullet.position.x = Math.random() * SCREEN.WIDTH;
        newBullet.position.y = this.radius * -1;
      } else if (isScreenEdgeBottom(edge)) {
        // bottom
        newBullet.position.x = Math.random() * SCREEN.WIDTH;
        newBullet.position.y = SCREEN.HEIGHT + this.radius;
      }
      const { unitVectorX, unitVectorY } = getUnitVectorComponents(
        newBullet.position,
        randomTarget,
      );
      newBullet.velocity.x = unitVectorX * this.speed;
      newBullet.velocity.y = unitVectorY * this.speed;
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
    return this.bullets.size <= 0 && this.time >= this.duration;
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
