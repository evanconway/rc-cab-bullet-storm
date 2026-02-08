export interface Position {
  x: number;
  y: number;
}

export interface Bullet {
  position: Position;
}

class Pattern {
  protected update: (unit: number) => void;
  protected canDelete: () => boolean;
  private bulletId: number;
  protected bullets: Map<number, Bullet>;

  constructor() {
    this.update = () => {};
    this.canDelete = () => true;
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
}

export default Pattern;
