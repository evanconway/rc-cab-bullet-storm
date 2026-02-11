import Pattern, { bulletIsOffScreen, bulletIsOnScreen } from "./Pattern";
import type { Bullet, Position } from "./Pattern";

interface SingleBullet extends Bullet {
  velocity: { x: number; y: number };
  hasEnteredScreen: boolean;
}

class PatternSingle extends Pattern {
  private origin: Position;

  constructor({
    target,
    origin,
    speed,
    radius,
    fillStyle,
  }: {
    target: Position;
    origin: Position;
    speed: number;
    radius: number;
    fillStyle: string;
  }) {
    super(fillStyle);
    this.origin = origin;

    const rawVelX = target.x - this.origin.x;
    const rawVelY = target.y - this.origin.y;
    const magnitude = Math.sqrt(Math.pow(rawVelX, 2) + Math.pow(rawVelY, 2));
    const unitVectorX = rawVelX / magnitude;
    const unitVectorY = rawVelY / magnitude;

    const bullet: SingleBullet = {
      radius,
      position: { ...this.origin },
      velocity: { x: unitVectorX * speed, y: unitVectorY * speed },
      hasEnteredScreen: false,
      fillStyle: this.bulletFillStyle,
    };
    this.addBullet(bullet);
  }

  update(frameTime: number, unit: number): void {
    this.bullets.forEach((bullet, id) => {
      const single = bullet as SingleBullet;
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
}

export default PatternSingle;
