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
  private generateInterval: number;
  private generateTime: number;
  private minRainVel: number;
  private maxRainVel: number;

  constructor({
    duration,
    minVel,
    maxVel,
  }: {
    duration: number;
    minVel: number;
    maxVel?: number;
  }) {
    super();
    this.totalTime = duration;
    this.time = 0;
    this.generateInterval = 2;
    this.generateTime = 0;
    this.minRainVel = minVel;
    this.maxRainVel = maxVel ?? minVel;
  }

  public update(unit: number): void {
    this.time += unit;
    this.generateTime += unit;

    while (
      this.time < this.totalTime &&
      this.generateTime >= this.generateInterval
    ) {
      this.generateTime -= this.generateInterval;

      const position: Position = {
        x: Math.random() * SCREEN.WIDTH,
        y: -30,
      };

      const target: Position = {
        x: position.x + Math.random() * RAIN_X_OFFSET - RAIN_X_OFFSET / 2,
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
        radius: 5,
        position: { x: Math.random() * SCREEN.WIDTH, y: -30 },
        velocity: { x: unitVectorX * speed, y: unitVectorY * speed },
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

  draw(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = "#00a";
    this.bullets.forEach((b) => {
      ctx.beginPath();
      ctx.arc(b.position.x, b.position.y, b.radius, 0, Math.PI * 2, true);
      ctx.stroke();
    });
  }
}

export default PatternRain;
