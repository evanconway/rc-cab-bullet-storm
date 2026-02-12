import { SCREEN } from "../../canvas";
import Pattern from "./Pattern";
import type { Bullet, Position } from "./Pattern";

interface RainBullet extends Bullet {
  velocity: { x: number; y: number };
}

const RAIN_X_OFFSET = 40;

class PatternRain extends Pattern {
  private totalTime: number;
  private time: number;
  private frequency: number;
  private generateTime: number;
  private minRainVel: number;
  private maxRainVel: number;
  private rainXOffset: number;
  private radius: number;

  constructor({
    duration,
    minVel,
    maxVel,
    frequency,
    fillStyle,
    variation,
    radius,
  }: {
    duration: number;
    minVel: number;
    maxVel?: number;
    frequency: number;
    fillStyle: string;
    variation?: number;
    radius?: number;
  }) {
    super(fillStyle);
    this.totalTime = duration;
    this.time = 0;
    this.frequency = frequency;
    this.generateTime = 0;
    this.minRainVel = minVel;
    this.maxRainVel = maxVel ?? minVel;
    this.rainXOffset = variation ?? RAIN_X_OFFSET;
    this.radius = radius ?? 5;
  }

  update(frameTime: number, unit: number): void {
    this.time += frameTime;
    this.generateTime += frameTime;

    while (this.time < this.totalTime && this.generateTime >= this.frequency) {
      this.generateTime -= this.frequency;

      const position: Position = {
        x: Math.random() * SCREEN.WIDTH,
        y: -30,
      };

      const target: Position = {
        x: position.x + Math.random() * this.rainXOffset - this.rainXOffset / 2,
        y: SCREEN.HEIGHT,
      };

      const rawVelX = target.x - position.x;
      const rawVelY = target.y - position.y;

      const magnitude = Math.sqrt(Math.pow(rawVelX, 2) + Math.pow(rawVelY, 2));

      const unitVectorX = rawVelX / magnitude;
      const unitVectorY = rawVelY / magnitude;

      const speed =
        Math.random() * (this.maxRainVel - this.minRainVel) + this.minRainVel;

      const bullet: RainBullet = {
        radius: this.radius,
        position: { x: Math.random() * SCREEN.WIDTH, y: -30 },
        velocity: { x: unitVectorX * speed, y: unitVectorY * speed },
        fillStyle: this.bulletFillStyle,
      };
      this.addBullet(bullet);
    }

    this.bullets.forEach((bullet, id) => {
      const rainBullet = bullet as RainBullet;
      rainBullet.position.x += rainBullet.velocity.x * unit;
      rainBullet.position.y += rainBullet.velocity.y * unit;
      if (rainBullet.position.y >= SCREEN.HEIGHT + 30) {
        this.removeBullet(id);
      }
    });
  }

  canDelete(): boolean {
    return this.time >= this.totalTime && this.bullets.size <= 0;
  }
}

export default PatternRain;
