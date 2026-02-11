import {
  isScreenEdgeBottom,
  isScreenEdgeLeft,
  isScreenEdgeRight,
  isScreenEdgeTop,
  SCREEN,
  type ScreenEdge,
} from "../../canvas";

export interface Position {
  x: number;
  y: number;
}

export interface Bullet {
  fillStyle: string;
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

export const bulletIsOffScreen = (bullet: Bullet, extraBuffer = 0) => {
  const {
    position: { x, y },
    radius,
  } = bullet;
  const usedDist = radius + extraBuffer;
  return (
    x < 0 - usedDist ||
    x > SCREEN.WIDTH + usedDist ||
    y < 0 - usedDist ||
    y > SCREEN.HEIGHT + usedDist
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

export const getRandomPositionOffScreenEdge = (
  edge: ScreenEdge,
  radius: number,
): Position => {
  if (isScreenEdgeLeft(edge)) {
    // left
    return { x: radius * -1, y: Math.random() * SCREEN.HEIGHT };
  } else if (isScreenEdgeRight(edge)) {
    // right
    return {
      x: SCREEN.WIDTH + radius,
      y: Math.random() * SCREEN.HEIGHT,
    };
  } else if (isScreenEdgeTop(edge)) {
    // top
    return { x: Math.random() * SCREEN.WIDTH, y: radius * -1 };
  } else {
    // bottom
    return { x: Math.random() * SCREEN.WIDTH, y: SCREEN.HEIGHT + radius };
  }
};

const dist = (positionA: Position, positionB: Position) =>
  Math.sqrt(
    Math.pow(positionA.x - positionB.x, 2) +
      Math.pow(positionA.y - positionB.y, 2),
  );

class Pattern {
  private bulletId: number;
  protected bullets: Map<number, Bullet>;
  protected bulletFillStyle: string;

  constructor(fillStyle: string) {
    this.bulletId = 0;
    this.bullets = new Map();
    this.bulletFillStyle = fillStyle;
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
    this.bullets.forEach((b) => {
      ctx.strokeStyle = b.fillStyle;
      ctx.beginPath();
      ctx.arc(b.position.x, b.position.y, b.radius, 0, Math.PI * 2, true);
      ctx.stroke();
    });
  }

  getShortestBulletDistance(position: Position) {
    const firstBullet = this.bullets.values().next().value;
    if (firstBullet === undefined) return null;
    let distance = dist(position, firstBullet.position) - firstBullet.radius;
    for (const bullet of this.bullets.values()) {
      const bulletDist = dist(position, bullet.position) - bullet.radius;
      if (bulletDist < distance) {
        distance = bulletDist;
      }
    }
    return distance;
  }
}

export default Pattern;
