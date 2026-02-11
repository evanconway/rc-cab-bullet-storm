import Pattern, { bulletIsOffScreen } from "./Pattern";
import type { Bullet, Position } from "./Pattern";

interface PatternBullet extends Bullet {
  velocity: { x: number; y: number };
}

class PatternBurst extends Pattern {
  constructor({
    origin,
    speed,
    radius,
    numOfBullets,
    offset,
  }: {
    origin: Position;
    speed: number;
    radius: number;
    numOfBullets: number;
    offset?: number; // in radians;
  }) {
    super();
    const radians = (2 * Math.PI) / numOfBullets;
    const firstRadian = offset ?? 0;

    for (let i = 0; i < numOfBullets; i++) {
      const xVecComponent = Math.cos(firstRadian + i * radians);
      const yVecComponent = Math.sin(firstRadian + i * radians);
      const bullet: PatternBullet = {
        radius,
        position: { ...origin },
        velocity: {
          x: xVecComponent * speed,
          y: yVecComponent * speed,
        },
      };
      this.addBullet(bullet);
    }
  }

  update(frameTime: number, unit: number): void {
    this.bullets.forEach((bullet, id) => {
      const single = bullet as PatternBullet;
      single.position.x += single.velocity.x * unit;
      single.position.y += single.velocity.y * unit;
      if (bulletIsOffScreen(single)) {
        this.removeBullet(id);
      }
    });
  }

  canDelete(): boolean {
    return this.bullets.size <= 0;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = "#f0f";
    this.bullets.forEach((b) => {
      ctx.beginPath();
      ctx.arc(b.position.x, b.position.y, b.radius, 0, Math.PI * 2, true);
      ctx.stroke();
    });
  }
}

export default PatternBurst;
