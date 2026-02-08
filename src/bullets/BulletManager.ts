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

  updatePatterns(unit: number) {
    this.patterns.forEach((p) => p.update(unit));
  }

  deletePatternsMarkedForDeletion() {
    this.patterns.forEach((pattern, id) => {
      if (pattern.canDelete()) {
        this.patterns.delete(id);
      }
    });
  }

  bulletCollisionAt(position: Position) {
    return Array.from(this.patterns.entries()).reduce(
      (result, [, pattern]) => result || pattern.bulletCollisionAt(position),
      false,
    );
  }

  draw(context: CanvasRenderingContext2D) {
    this.patterns.forEach((p) => p.draw(context));
  }
}

const bulletManager = new BulletManager();

export default bulletManager;
