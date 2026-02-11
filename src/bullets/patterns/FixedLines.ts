import {
  isScreenEdgeBottom,
  isScreenEdgeLeft,
  isScreenEdgeRight,
  isScreenEdgeTop,
  SCREEN,
  type ScreenEdge,
} from "../../canvas";
import Pattern, { bulletIsOffScreen, bulletIsOnScreen } from "./Pattern";
import type { Bullet } from "./Pattern";

interface PatternBullet extends Bullet {
  velocity: { x: number; y: number };
  hasEnteredScreen: boolean;
}

class PatternFixedLines extends Pattern {
  private duration: number;
  private rowSpacing: number;
  private frequency: number;
  private offset: number;
  private speed: number;
  private radius: number;
  private edge: ScreenEdge;
  private time: number;
  private generateTime: number;

  constructor({
    duration,
    rowSpacing,
    offset,
    frequency,
    speed,
    radius,
    edge,
    fillStyle,
  }: {
    duration: number;
    rowSpacing: number;
    offset: number;
    frequency: number;
    speed: number;
    radius: number;
    edge: ScreenEdge;
    fillStyle: string;
  }) {
    super(fillStyle);
    this.duration = duration;
    this.rowSpacing = rowSpacing;
    this.offset = offset;
    this.frequency = frequency;
    this.speed = speed;
    this.radius = radius;
    this.edge = edge;
    this.time = 0;
    this.generateTime = 0;
  }

  update(frameTime: number, unit: number): void {
    this.time += frameTime;
    this.generateTime += frameTime;
    while (this.time <= this.duration && this.generateTime >= this.frequency) {
      this.generateTime -= this.frequency;
      if (isScreenEdgeTop(this.edge)) {
        let bulletX = SCREEN.WIDTH_CENTER + this.offset;
        while (bulletX > 0) bulletX -= this.rowSpacing;
        bulletX += this.rowSpacing;
        while (bulletX < SCREEN.WIDTH) {
          const newBullet: PatternBullet = {
            hasEnteredScreen: false,
            position: { x: bulletX, y: 0 - this.radius },
            velocity: { x: 0, y: this.speed },
            radius: this.radius,
            fillStyle: this.bulletFillStyle,
          };
          this.addBullet(newBullet);
          bulletX += this.rowSpacing;
        }
      } else if (isScreenEdgeBottom(this.edge)) {
        let bulletX = SCREEN.WIDTH_CENTER + this.offset;
        while (bulletX > 0) bulletX -= this.rowSpacing;
        bulletX += this.rowSpacing;
        while (bulletX < SCREEN.WIDTH) {
          const newBullet: PatternBullet = {
            hasEnteredScreen: false,
            position: { x: bulletX, y: SCREEN.HEIGHT + this.radius },
            velocity: { x: 0, y: this.speed * -1 },
            radius: this.radius,
            fillStyle: this.bulletFillStyle,
          };
          this.addBullet(newBullet);
          bulletX += this.rowSpacing;
        }
      } else if (isScreenEdgeLeft(this.edge)) {
        let bulletY = SCREEN.HEIGHT_CENTER + this.offset;
        while (bulletY > 0) bulletY -= this.rowSpacing;
        bulletY += this.rowSpacing;
        while (bulletY < SCREEN.HEIGHT) {
          const newBullet: PatternBullet = {
            hasEnteredScreen: false,
            position: { x: 0 - this.radius, y: bulletY },
            velocity: { x: this.speed, y: 0 },
            radius: this.radius,
            fillStyle: this.bulletFillStyle,
          };
          this.addBullet(newBullet);
          bulletY += this.rowSpacing;
        }
      } else if (isScreenEdgeRight(this.edge)) {
        let bulletY = SCREEN.HEIGHT_CENTER + this.offset;
        while (bulletY > 0) bulletY -= this.rowSpacing;
        bulletY += this.rowSpacing;
        while (bulletY < SCREEN.HEIGHT) {
          const newBullet: PatternBullet = {
            hasEnteredScreen: false,
            position: { x: SCREEN.WIDTH + this.radius, y: bulletY },
            velocity: { x: this.speed * -1, y: 0 },
            radius: this.radius,
            fillStyle: this.bulletFillStyle,
          };
          this.addBullet(newBullet);
          bulletY += this.rowSpacing;
        }
      }
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

export default PatternFixedLines;
