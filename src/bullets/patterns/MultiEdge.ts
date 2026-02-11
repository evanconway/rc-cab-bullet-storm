import {
  getRandomScreenEdge,
  isScreenEdgeBottom,
  isScreenEdgeLeft,
  isScreenEdgeRight,
  isScreenEdgeTop,
  SCREEN,
} from "../../canvas";
import Pattern, {
  bulletIsOffScreen,
  bulletIsOnScreen,
  getUnitVectorComponents,
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
  private aimed: boolean;

  constructor({
    duration,
    frequency,
    radius,
    speed,
    aimed,
    fillStyle,
  }: {
    duration: number;
    frequency: number;
    radius: number;
    speed: number;
    aimed?: boolean;
    fillStyle: string;
  }) {
    super(fillStyle);
    this.time = 0;
    this.duration = duration;
    this.frequency = frequency;
    this.generateTime = 0;
    this.radius = radius;
    this.speed = speed;
    this.aimed = aimed ?? false;
  }

  update(frameTime: number, unit: number, playerPosition: Position): void {
    this.time += frameTime;
    this.generateTime += frameTime;
    while (this.time <= this.duration && this.generateTime >= this.frequency) {
      this.generateTime -= this.frequency;

      const newBullet: PatternBullet = {
        radius: this.radius,
        position: { x: 0, y: 0 },
        velocity: { x: 0, y: 0 },
        hasEnteredScreen: false,
        fillStyle: this.bulletFillStyle,
      };

      const target: Position = this.aimed
        ? { ...playerPosition }
        : {
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
        target,
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
}

export default PatternMultiEdge;
