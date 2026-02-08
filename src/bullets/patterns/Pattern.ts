export interface Position {
  x: number;
  y: number;
}

export interface Bullet {
  position: Position;
  radius: number;
}

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

  public getBulletCount() {
    return this.bullets.size;
  }

  public update(unit: number) {
    console.log("deafult pattern update invoked");
    throw new Error("default pattern update invoked, this should never happen");
  }

  canDelete() {
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
