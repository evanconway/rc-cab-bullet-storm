import { SCREEN } from "./canvas";

const SCREEN_BUFFER = 30; // num of pixels to gen and delete bullets offscreen
const SCREEN_BUFFER_LEFT = SCREEN_BUFFER * -1;
const SCREEN_BUFFER_RIGHT = SCREEN.WIDTH + SCREEN_BUFFER;
const SCREEN_BUFFER_TOP = SCREEN_BUFFER * -1;
const SCREEN_BUFFER_BOTTOM = SCREEN.HEIGHT + SCREEN_BUFFER;

const BULLET_RADIUS = 5;

interface Position {
  x: number;
  y: number;
}

interface BulletSimple {
  position: Position;
  velocity: { x: number; y: number };
}

const dist = (positionA: Position, positionB: Position) =>
  Math.sqrt(
    Math.pow(positionA.x - positionB.x, 2) +
      Math.pow(positionA.y - positionB.y, 2),
  );

class BulletGen {
  private bulletId: number;
  private bullets: Map<number, BulletSimple>;
  private bulletsHaveEnteredScreen: Set<number>;

  constructor() {
    this.bulletId = 0;
    this.bullets = new Map();
    this.bulletsHaveEnteredScreen = new Set();
  }

  private addBullet(bullet: BulletSimple) {
    const newId = this.bulletId;
    this.bulletId += 1;
    this.bullets.set(newId, bullet);
  }

  private removeBullet(id: number) {
    this.bullets.delete(id);
  }

  /**
   * 0 is left, 1 is top, 2 is right, 3 is bottom
   */
  private getRandomScreenEdge() {
    const edge = Math.floor(Math.random() * 4);
    if (edge === 1) return 1;
    if (edge == 2) return 2;
    if (edge === 3) return 3;
    return 0;
  }

  private positionIsOnScreen({ x, y }: Position) {
    return x >= 0 && x <= SCREEN.WIDTH && y >= 0 && y <= SCREEN.HEIGHT;
  }

  private positionIsOutsideScreenBuffer({ x, y }: Position) {
    return (
      x < SCREEN_BUFFER_LEFT ||
      x > SCREEN_BUFFER_RIGHT ||
      y < SCREEN_BUFFER_TOP ||
      y > SCREEN_BUFFER_BOTTOM
    );
  }

  getBulletCount() {
    return this.bullets.size;
  }

  update(updatePercent: number) {
    this.bullets.forEach((bullet, id) => {
      bullet.position.x += bullet.velocity.x * updatePercent;
      bullet.position.y += bullet.velocity.y * updatePercent;

      if (this.positionIsOnScreen(bullet.position)) {
        this.bulletsHaveEnteredScreen.add(id);
      }

      if (this.positionIsOutsideScreenBuffer(bullet.position)) {
        this.removeBullet(id);
      }
    });
  }

  draw(context: CanvasRenderingContext2D) {
    context.strokeStyle = "#f00";
    this.bullets.forEach((bullet) => {
      context.beginPath();
      context.arc(
        bullet.position.x,
        bullet.position.y,
        BULLET_RADIUS,
        0,
        Math.PI * 2,
        true,
      );
      context.stroke();
    });
  }

  clearAllBullets() {
    this.bullets.clear();
    this.bulletsHaveEnteredScreen.clear();
  }

  getBulletOverlapsPosition(position: Position, overlapDist = 3) {
    return Array.from(this.bullets.entries()).reduce((result, [_, bullet]) => {
      return (
        result || dist(position, bullet.position) <= overlapDist + BULLET_RADIUS
      );
    }, false);
  }

  /**
   * Number correlates to edge.
   * 0: left
   * 1: top
   * 2: right
   * 3: bottom
   *
   * @param edge
   */
  addSimpleEdgeBullet(edge: 0 | 1 | 2 | 3) {
    const newBullet: BulletSimple = {
      position: { x: 0, y: 0 },
      velocity: { x: 0, y: 0 },
    };
    const speed = 1;
    if (edge === 0) {
      // left
      newBullet.position.x = SCREEN_BUFFER * -1;
      newBullet.position.y = Math.random() * SCREEN.HEIGHT;
      newBullet.velocity.x = speed;
    } else if (edge === 1) {
      // top
      newBullet.position.x = Math.random() * SCREEN.WIDTH;
      newBullet.position.y = SCREEN_BUFFER * -1;
      newBullet.velocity.y = speed;
    } else if (edge === 2) {
      // right
      newBullet.position.x = SCREEN.WIDTH + SCREEN_BUFFER;
      newBullet.position.y = Math.random() * SCREEN.HEIGHT;
      newBullet.velocity.x = speed * -1;
    } else if (edge === 3) {
      // bottom
      newBullet.position.x = Math.random() * SCREEN.WIDTH;
      newBullet.position.y = SCREEN.HEIGHT + SCREEN_BUFFER;
      newBullet.velocity.y = speed * -1;
    }
    this.addBullet(newBullet);
  }

  addSimpleRandomEdgeBullet() {
    const edge = this.getRandomScreenEdge();
    this.addSimpleEdgeBullet(edge);
  }
}

export default BulletGen;
