import { SCREEN } from "../../canvas";

export interface Position {
  x: number;
  y: number;
}

export interface Bullet {
  position: Position;
  radius: number;
}

export const bulletIsOnScreen = (bullet: Bullet) => {
  const {
    position: { x, y },
    radius,
  } = bullet;
  return (
    x > 0 - radius &&
    x < SCREEN.WIDTH + radius &&
    y > 0 - radius &&
    y < SCREEN.HEIGHT + radius
  );
};

export const bulletIsOffScreen = (bullet: Bullet) => {
  const {
    position: { x, y },
    radius,
  } = bullet;
  return (
    x < 0 - radius ||
    x > SCREEN.WIDTH + radius ||
    y < 0 - radius ||
    y > SCREEN.HEIGHT + radius
  );
};

export const getUnitVectorComponents = (origin: Position, target: Position) => {
  const rawVelX = target.x - origin.x;
  const rawVelY = target.y - origin.y;
  const magnitude = Math.sqrt(Math.pow(rawVelX, 2) + Math.pow(rawVelY, 2));
  return {
    unitVectorX: rawVelX / magnitude,
    unitVectorY: rawVelY / magnitude,
  };
};

const dist = (positionA: Position, positionB: Position) =>
  Math.sqrt(
    Math.pow(positionA.x - positionB.x, 2) +
      Math.pow(positionA.y - positionB.y, 2),
  );

class Pattern {
  private bulletId: number;
  protected bullets: Map<number, Bullet>;

  constructor() {
    this.bulletId = 0;
    this.bullets = new Map();
  }

  protected addBullet(bullet: Bullet) {
    const newId = this.bulletId;
    this.bulletId += 1;
    this.bullets.set(newId, bullet);
  }

  protected removeBullet(id: number) {
    this.bullets.delete(id);
  }

  getBulletCount() {
    return this.bullets.size;
  }

  update(frametime: number, unit: number, playerPosition: Position) {
    console.log("default pattern update invoked");
    throw new Error("default pattern update invoked, this should never happen");
  }

  canDelete() {
    console.log("default pattern canDelete invoked");
    throw new Error(
      "default pattern canDelete invoked, this should never happen",
    );
    return true;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = "#f00";
    this.bullets.forEach((b) => {
      ctx.beginPath();
      ctx.arc(b.position.x, b.position.y, b.radius, 0, Math.PI * 2, true);
      ctx.stroke();
    });
  }

  bulletCollisionAt(position: Position) {
    return Array.from(this.bullets.entries()).reduce(
      (result, [_, bullet]) =>
        result || dist(position, bullet.position) <= bullet.radius,
      false,
    );
  }
}

export default Pattern;
