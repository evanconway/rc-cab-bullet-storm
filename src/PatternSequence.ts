import PatternAimedVolley from "./bullets/patterns/AimedVolley";
import type Pattern from "./bullets/patterns/Pattern";
import PatternRain from "./bullets/patterns/Rain";
import PatternSingle from "./bullets/patterns/Single";
import { SCREEN } from "./canvas";

class PatternSequence {
  private patterns: Map<number, Pattern[]>;

  constructor() {
    this.patterns = new Map();
    this.patterns.set(100, [
      new PatternSingle({
        origin: { x: SCREEN.WIDTH_CENTER, y: 0 - 30 },
        target: { x: SCREEN.WIDTH_CENTER, y: SCREEN.HEIGHT },
        radius: 30,
        speed: 1,
      }),
    ]);

    this.patterns.set(2000, [
      new PatternAimedVolley({
        duration: 60,
        minVel: 3,
        origin: { x: SCREEN.BUFFER * -1, y: SCREEN.HEIGHT * 0.2 },
        generateInterval: 7,
      }),
    ]);
    this.patterns.set(2500, [
      new PatternAimedVolley({
        duration: 60,
        minVel: 3,
        origin: { x: SCREEN.WIDTH + SCREEN.BUFFER, y: SCREEN.HEIGHT * 0.4 },
        generateInterval: 7,
      }),
    ]);
    this.patterns.set(3000, [
      new PatternAimedVolley({
        duration: 60,
        minVel: 3,
        origin: { x: SCREEN.BUFFER * -1, y: SCREEN.HEIGHT * 0.6 },
        generateInterval: 7,
      }),
    ]);
    this.patterns.set(3500, [
      new PatternAimedVolley({
        duration: 60,
        minVel: 3,
        origin: { x: SCREEN.WIDTH + SCREEN.BUFFER, y: SCREEN.HEIGHT * 0.8 },
        generateInterval: 7,
      }),
    ]);
    this.patterns.set(4000, [
      new PatternAimedVolley({
        duration: 60,
        minVel: 3,
        origin: { x: SCREEN.BUFFER * -1, y: SCREEN.HEIGHT * 1.0 },
        generateInterval: 7,
      }),
    ]);
    this.patterns.set(5000, [
      new PatternRain({ duration: 500, minVel: 1.5, generateInterval: 2 }),
    ]);
  }

  /**
   * Returns all patterns passed the given time, and removes them
   * from the instance.
   *
   * @param time
   */
  getPatternsPassedTime(time: number) {
    const foundPatterns: Pattern[] = [];
    for (const key of this.patterns.keys()) {
      if (key <= time) {
        foundPatterns.push(...(this.patterns.get(key) ?? []));
        this.patterns.delete(key);
      }
    }
    return foundPatterns;
  }
}

export default PatternSequence;
