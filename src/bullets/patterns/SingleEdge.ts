import {
  getRandomScreenEdge,
  isScreenEdgeBottom,
  isScreenEdgeLeft,
  isScreenEdgeRight,
  isScreenEdgeTop,
  SCREEN,
  type ScreenEdge,
} from "../../canvas";
import Pattern, {
  bulletIsOffScreen,
  bulletIsOnScreen,
  getRandomPositionOffScreenEdge,
  getUnitVectorComponents,
} from "./Pattern";
import type { Bullet, Position } from "./Pattern";

const TARGET_RANDOM_MOD = SCREEN.WIDTH * 0.7;

interface PatternBullet extends Bullet {
  velocity: { x: number; y: number };
  hasEnteredScreen: boolean;
}

class PatternSingleEdge extends Pattern {
  private time: number;
  private duration: number;
  private frequency: number;
  private generateTime: number;
  private radius: number;
  private speed: number;
  private aimed: boolean;
  private edge: ScreenEdge;

  constructor({
    duration,
    frequency,
    radius,
    speed,
    aimed,
    fillStyle,
    edge,
  }: {
    duration: number;
    frequency: number;
    radius: number;
    speed: number;
    aimed?: boolean;
    fillStyle: string;
    edge: ScreenEdge;
  }) {
    super(fillStyle);
    this.time = 0;
    this.duration = duration;
    this.frequency = frequency;
    this.generateTime = 0;
    this.radius = radius;
    this.speed = speed;
    this.aimed = aimed ?? false;
    this.edge = edge;
  }

  update(frameTime: number, unit: number, playerPosition: Position): void {
    this.time += frameTime;
    this.generateTime += frameTime;
    while (this.time <= this.duration && this.generateTime >= this.frequency) {
      this.generateTime -= this.frequency;

      const position = getRandomPositionOffScreenEdge(this.edge, this.radius);

      const newBullet: PatternBullet = {
        radius: this.radius,
        position,
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

export default PatternSingleEdge;
