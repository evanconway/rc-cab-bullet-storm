import PatternAimedVolley from "./bullets/patterns/AimedVolley";
import PatternBurst from "./bullets/patterns/Burst";
import PatternFixedLines from "./bullets/patterns/FixedLines";
import PatternMultiEdge from "./bullets/patterns/MultiEdge";
import Pattern, {
  getRandomPositionOffScreenEdge,
} from "./bullets/patterns/Pattern";
import PatternRain from "./bullets/patterns/Rain";
import PatternSingle from "./bullets/patterns/Single";
import PatternSingleEdge from "./bullets/patterns/SingleEdge";
import { SCREEN, SCREEN_EDGES, type ScreenEdge } from "./canvas";

class PatternSequence {
  private patterns: Map<number, Pattern[]>;

  private set(time: number, pattern: Pattern) {
    const existingArr = this.patterns.get(time);
    if (existingArr === undefined) {
      this.patterns.set(time, [pattern]);
    } else {
      existingArr.push(pattern);
    }
  }

  constructor() {
    this.patterns = new Map();

    // show them the danger
    this.set(
      1000,
      new PatternMultiEdge({
        duration: 15000,
        frequency: 1200,
        radius: 6,
        speed: 0.8,
        fillStyle: "#070",
      }),
    );

    // make 'em dodge
    this.set(
      7000,
      new PatternMultiEdge({
        duration: 8000,
        frequency: 2500,
        radius: 6,
        speed: 1.5,
        aimed: true,
        fillStyle: "#a00",
      }),
    );

    // big rain
    this.set(
      15000,
      new PatternRain({
        duration: 20000,
        minVel: 0.5,
        frequency: 1100,
        fillStyle: "#00a",
        variation: 0,
        radius: 30,
      }),
    );

    // then gunners from below
    for (let i = 20000; i < 35000; i += 2100) {
      this.set(
        i,
        new PatternAimedVolley({
          duration: 1000,
          minVel: 2,
          frequency: 250,
          fillStyle: "#f00",
          origin: getRandomPositionOffScreenEdge(SCREEN_EDGES.BOTTOM, 5),
        }),
      );
    }

    const burstPhase1Rad = 8;

    // bursts from the sides
    for (let i = 40000; i < 48000; i += 1700) {
      this.set(
        i,
        new PatternBurst({
          origin: getRandomPositionOffScreenEdge(
            Math.random() * 2 > 1 ? SCREEN_EDGES.LEFT : SCREEN_EDGES.RIGHT,
            burstPhase1Rad,
          ),
          numOfBullets: Math.floor(Math.random() * 10 + 15),
          speed: 1.5,
          radius: burstPhase1Rad,
          offset: Math.random() * 2 * Math.PI,
          fillStyle: "#B300FF",
        }),
      );
    }

    // pick up the pace
    let leftOrRight: ScreenEdge = SCREEN_EDGES.LEFT;
    for (let i = 50000; i < 65000; i += 1200) {
      this.set(
        i,
        new PatternBurst({
          origin: getRandomPositionOffScreenEdge(leftOrRight, burstPhase1Rad),
          numOfBullets: Math.floor(Math.random() * 5 + 30),
          speed: 1.5,
          radius: burstPhase1Rad,
          offset: Math.random() * 2 * Math.PI,
          fillStyle: "#FF00E1",
        }),
      );
      leftOrRight =
        leftOrRight === SCREEN_EDGES.LEFT
          ? SCREEN_EDGES.RIGHT
          : SCREEN_EDGES.LEFT;
    }

    // now react to me
    this.set(
      65000,
      new PatternAimedVolley({
        duration: 4000,
        minVel: 2.5,
        frequency: 600,
        fillStyle: "#f00",
        origin: getRandomPositionOffScreenEdge(SCREEN_EDGES.TOP, 5),
      }),
    );
    this.set(
      65000,
      new PatternAimedVolley({
        duration: 4000,
        minVel: 2.5,
        frequency: 600,
        fillStyle: "#f00",
        origin: getRandomPositionOffScreenEdge(SCREEN_EDGES.LEFT, 5),
      }),
    );
    this.set(
      65000,
      new PatternAimedVolley({
        duration: 4000,
        minVel: 2.5,
        frequency: 600,
        fillStyle: "#f00",
        origin: getRandomPositionOffScreenEdge(SCREEN_EDGES.RIGHT, 5),
      }),
    );
    // accelerate
    this.set(
      69000,
      new PatternAimedVolley({
        duration: 3000,
        minVel: 2.5,
        frequency: 400,
        fillStyle: "#f00",
        origin: getRandomPositionOffScreenEdge(SCREEN_EDGES.TOP, 5),
      }),
    );
    this.set(
      69000,
      new PatternAimedVolley({
        duration: 3000,
        minVel: 2.5,
        frequency: 400,
        fillStyle: "#f00",
        origin: getRandomPositionOffScreenEdge(SCREEN_EDGES.LEFT, 5),
      }),
    );
    this.set(
      69000,
      new PatternAimedVolley({
        duration: 3000,
        minVel: 2.5,
        frequency: 400,
        fillStyle: "#f00",
        origin: getRandomPositionOffScreenEdge(SCREEN_EDGES.RIGHT, 5),
      }),
    );
    this.set(
      72000,
      new PatternAimedVolley({
        duration: 3000,
        minVel: 2.5,
        frequency: 200,
        fillStyle: "#f00",
        origin: getRandomPositionOffScreenEdge(SCREEN_EDGES.LEFT, 5),
      }),
    );
    this.set(
      72000,
      new PatternAimedVolley({
        duration: 3000,
        minVel: 2.5,
        frequency: 200,
        fillStyle: "#f00",
        origin: getRandomPositionOffScreenEdge(SCREEN_EDGES.RIGHT, 5),
      }),
    );

    // fill it with gold
    const burstPhase2Rad = 4;
    const burstPhase2Speed = 0.3;
    const burstPhase2Count = 30;
    for (let i = 75000; i < 95000; i += 2500) {
      this.set(
        i,
        new PatternBurst({
          origin: getRandomPositionOffScreenEdge(
            SCREEN_EDGES.TOP,
            burstPhase2Rad,
          ),
          numOfBullets: burstPhase2Count,
          speed: burstPhase2Speed,
          radius: burstPhase2Rad,
          fillStyle: "#FFD000",
        }),
      );
      this.set(
        i,
        new PatternBurst({
          origin: getRandomPositionOffScreenEdge(
            SCREEN_EDGES.BOTTOM,
            burstPhase2Rad,
          ),
          numOfBullets: burstPhase2Count,
          speed: burstPhase2Speed,
          radius: burstPhase2Rad,
          fillStyle: "#FFD000",
        }),
      );
      this.set(
        i,
        new PatternBurst({
          origin: getRandomPositionOffScreenEdge(
            SCREEN_EDGES.LEFT,
            burstPhase2Rad,
          ),
          numOfBullets: burstPhase2Count,
          speed: burstPhase2Speed,
          radius: burstPhase2Rad,
          fillStyle: "#FFD000",
        }),
      );
      this.set(
        i,
        new PatternBurst({
          origin: getRandomPositionOffScreenEdge(
            SCREEN_EDGES.RIGHT,
            burstPhase2Rad,
          ),
          numOfBullets: burstPhase2Count,
          speed: burstPhase2Speed,
          radius: burstPhase2Rad,
          fillStyle: "#FFD000",
        }),
      );
    }

    // more guns from below, but big single shots
    this.set(
      103000,
      new PatternSingleEdge({
        duration: 13000,
        frequency: 800,
        radius: 15,
        fillStyle: "#FF721A",
        speed: 2.7,
        aimed: true,
        edge: SCREEN_EDGES.BOTTOM,
      }),
    );

    // now lock 'em in place
    for (const edge of [SCREEN_EDGES.BOTTOM, SCREEN_EDGES.RIGHT]) {
      this.set(
        112000,
        new PatternFixedLines({
          duration: 10000,
          rowSpacing: SCREEN.WIDTH / 4,
          frequency: 600,
          speed: 0.5,
          radius: 4,
          edge,
          fillStyle: "#1AFFE4",
        }),
      );
    }

    // let's see you dodge those guns in a cage...
    this.set(
      115000,
      new PatternMultiEdge({
        duration: 30000,
        frequency: 800,
        radius: 8,
        fillStyle: "#FF721A",
        speed: 2.3,
        aimed: true,
      }),
    );

    // another cage
    for (const edge of [SCREEN_EDGES.TOP, SCREEN_EDGES.LEFT]) {
      this.set(
        122000,
        new PatternFixedLines({
          duration: 10000,
          rowSpacing: SCREEN.WIDTH / 5,
          frequency: 600,
          speed: 0.5,
          radius: 4,
          edge,
          fillStyle: "#1AFFE4",
          offset: Math.random() * (SCREEN.WIDTH / 5),
        }),
      );
    }
    // and another
    for (const edge of [SCREEN_EDGES.TOP, SCREEN_EDGES.LEFT]) {
      this.set(
        132000,
        new PatternFixedLines({
          duration: 10000,
          rowSpacing: SCREEN.WIDTH / 6,
          frequency: 600,
          speed: 0.5,
          radius: 4,
          edge,
          fillStyle: "#1AFFE4",
          offset: Math.random() * (SCREEN.WIDTH / 5),
        }),
      );
    }

    // now the rain
    this.set(
      146000,
      new PatternRain({
        duration: 30000,
        minVel: 0.5,
        // maxVel: 1.1,
        frequency: 35,
        fillStyle: "#00b",
        radius: 4,
      }),
    );

    // remember the danger
    this.set(
      154000,
      new PatternMultiEdge({
        duration: 15000,
        frequency: 2400,
        radius: 35,
        speed: 0.4,
        fillStyle: "#070",
      }),
    );
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

  getComplete() {
    return this.patterns.size <= 0;
  }
}

export default PatternSequence;
