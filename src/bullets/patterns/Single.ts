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
  }: {
    target: Position;
    origin: Position;
    speed: number;
    radius: number;
  }) {
    super();
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
    };
    this.addBullet(bullet);
  }

  update(unit: number): void {
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

  draw(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = "#070";
    this.bullets.forEach((b) => {
      ctx.beginPath();
      ctx.arc(b.position.x, b.position.y, b.radius, 0, Math.PI * 2, true);
      ctx.stroke();
    });
  }
}

export default PatternSingle;
