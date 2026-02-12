type DeadState = 0 | 1 | 2 | 3;

export const DEAD_STATES = {
  FLASH: 0 as DeadState,
  SILENCE: 1 as DeadState,
  INTANGIBLE: 2 as DeadState,
  ALIVE: 3 as DeadState,
} as const;

const TIMES = {
  FLASH: 1000,
  SILENCE: 1000,
  INTANGIBLE: 3000,
} as const;

class Lives {
  private state: DeadState;
  private time: number;
  private initialLives: number;
  private lives: number;

  constructor(lives: number) {
    this.state = DEAD_STATES.ALIVE;
    this.time = 0;
    this.initialLives = lives;
    this.lives = lives;
  }

  getLives() {
    return this.lives;
  }

  reset() {
    this.lives = this.initialLives;
    this.time = 0;
    this.state = DEAD_STATES.ALIVE;
  }

  startDeath() {
    this.lives -= 1;
    this.time = 0;
    this.state = DEAD_STATES.FLASH;
  }

  getState() {
    return this.state;
  }

  advanceTime(time: number) {
    if (this.state !== DEAD_STATES.ALIVE) {
      this.time += time;
    }

    if (this.state === DEAD_STATES.FLASH && this.time >= TIMES.FLASH) {
      this.time = 0;
      this.state = DEAD_STATES.SILENCE;
    } else if (
      this.state === DEAD_STATES.SILENCE &&
      this.time >= TIMES.SILENCE
    ) {
      this.time = 0;
      this.state = DEAD_STATES.INTANGIBLE;
    } else if (
      this.state === DEAD_STATES.INTANGIBLE &&
      this.time >= TIMES.INTANGIBLE
    ) {
      this.time = 0;
      this.state = DEAD_STATES.ALIVE;
    }
  }

  getFlashAlpha() {
    if (this.state === DEAD_STATES.FLASH) {
      return 1 - this.time / TIMES.FLASH;
    }
    return 0;
  }
}

export default Lives;
