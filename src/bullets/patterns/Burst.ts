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
    fillStyle,
  }: {
    origin: Position;
    speed: number;
    radius: number;
    numOfBullets: number;
    offset?: number; // in radians;
    fillStyle: string;
  }) {
    super(fillStyle);
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
        fillStyle: this.bulletFillStyle,
      };
      this.addBullet(bullet);
    }
  }

  update(frameTime: number, unit: number): void {
    this.bullets.forEach((bullet, id) => {
      const single = bullet as PatternBullet;
      single.position.x += single.velocity.x * unit;
      single.position.y += single.velocity.y * unit;
      if (bulletIsOffScreen(single, single.radius)) {
        this.removeBullet(id);
      }
    });
  }

  canDelete(): boolean {
    return this.bullets.size <= 0;
  }
}

export default PatternBurst;
