import Pattern, { bulletIsOffScreen, bulletIsOnScreen } from "./Pattern";
import type { Bullet, Position } from "./Pattern";

interface AimedBullet extends Bullet {
  velocity: { x: number; y: number };
  hasEnteredScreen: boolean;
}

class PatternAimedVolley extends Pattern {
  private totalTime: number;
  private time: number;
  private generateInterval: number;
  private generateTime: number;
  private minVel: number;
  private maxVel: number;
  private origin: Position;

  constructor({
    duration,
    minVel,
    maxVel,
    origin,
    generateInterval,
  }: {
    duration: number;
    minVel: number;
    maxVel?: number;
    origin: Position;
    generateInterval: number;
  }) {
    super();
    this.totalTime = duration;
    this.time = 0;
    this.generateInterval = generateInterval;
    this.generateTime = 0;
    this.minVel = minVel;
    this.maxVel = maxVel ?? minVel;
    this.origin = origin;
  }

  update(unit: number, target: Position): void {
    this.time += unit;
    this.generateTime += unit;

    while (
      this.time < this.totalTime &&
      this.generateTime >= this.generateInterval
    ) {
      this.generateTime -= this.generateInterval;

      const rawVelX = target.x - this.origin.x;
      const rawVelY = target.y - this.origin.y;

      const magnitude = Math.sqrt(Math.pow(rawVelX, 2) + Math.pow(rawVelY, 2));

      const unitVectorX = rawVelX / magnitude;
      const unitVectorY = rawVelY / magnitude;

      const speed = Math.random() * (this.maxVel - this.minVel) + this.minVel;

      const bullet: AimedBullet = {
        radius: 5,
        position: { ...this.origin },
        velocity: { x: unitVectorX * speed, y: unitVectorY * speed },
        hasEnteredScreen: false,
      };
      this.addBullet(bullet);
    }

    this.bullets.forEach((bullet, id) => {
      const aimedBullet = bullet as AimedBullet;
      aimedBullet.position.x += aimedBullet.velocity.x * unit;
      aimedBullet.position.y += aimedBullet.velocity.y * unit;

      if (bulletIsOnScreen(aimedBullet)) {
        aimedBullet.hasEnteredScreen = true;
      }

      if (aimedBullet.hasEnteredScreen && bulletIsOffScreen(aimedBullet)) {
        this.removeBullet(id);
      }
    });
  }

  canDelete(): boolean {
    return this.time >= this.totalTime && this.bullets.size <= 0;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = "#f00";
    this.bullets.forEach((b) => {
      ctx.beginPath();
      ctx.arc(b.position.x, b.position.y, b.radius, 0, Math.PI * 2, true);
      ctx.stroke();
    });
  }
}

export default PatternAimedVolley;
