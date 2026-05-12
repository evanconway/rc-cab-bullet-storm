import type { Position } from "./patterns/Pattern";
import type Pattern from "./patterns/Pattern";

class BulletManager {
  private patternId: number;
  private patterns: Map<number, Pattern>;

  constructor() {
    this.patternId = 0;
    this.patterns = new Map();
  }

  clear() {
    this.patterns = new Map();
  }

  getBulletCount() {
    return Array.from(this.patterns.entries()).reduce(
      (result, [_, pattern]) => result + pattern.getBulletCount(),
      0,
    );
  }

  addPattern(pattern: Pattern) {
    this.patterns.set(this.patternId, pattern);
    this.patternId += 1;
  }

  updatePatterns(frameTime: number, unit: number, playerPosition: Position) {
    this.patterns.forEach((p) => p.update(frameTime, unit, playerPosition));
  }

  deletePatternsMarkedForDeletion() {
    this.patterns.forEach((pattern, id) => {
      if (pattern.canDelete()) {
        this.patterns.delete(id);
      }
    });
  }

  getPatternCount() {
    return this.patterns.size;
  }

  getShortestBulletDistance(position: Position) {
    const firstPattern = this.patterns.values().next().value;
    if (firstPattern === undefined) return null;
    let distance = firstPattern.getShortestBulletDistance(position);
    if (distance === null) return null;
    for (const pattern of this.patterns.values()) {
      const closestBulletDist = pattern.getShortestBulletDistance(position);
      if (closestBulletDist !== null && closestBulletDist < distance) {
        distance = closestBulletDist;
      }
    }
    return Math.max(distance, 0);
  }

  draw(context: CanvasRenderingContext2D) {
    const bullets = Array.from(this.patterns.values())
      .map((b) => Array.from(b.getBullets().values()))
      .flat(1)
      .sort((a, b) => b.radius - a.radius);
    bullets.forEach((b) => {
      context.fillStyle = b.fillStyle;
      context.beginPath();
      context.arc(b.position.x, b.position.y, b.radius, 0, Math.PI * 2, true);
      context.fill();
    });
  }
}

const bulletManager = new BulletManager();

export default bulletManager;
