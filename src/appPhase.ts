type AppPhase = 0 | 1 | 2;

const APP_PHASES = {
  START_GAME: 0 as AppPhase,
  PLAYING: 1 as AppPhase,
  GAME_OVER: 2 as AppPhase,
} as const;

class AppPhaseManager {
  private appPhase: AppPhase;
  private phaseTime: number;
  private score: number;

  constructor() {
    this.appPhase = APP_PHASES.START_GAME;
    this.phaseTime = 0;
    this.score = 0;
  }

  getScore() {
    return Math.floor(this.score);
  }

  scoreAdd(value: number) {
    this.score += value;
  }

  getPhaseTime() {
    return this.phaseTime;
  }

  increasePhaseTime(time: number) {
    this.phaseTime += time;
  }

  isPhaseStartGame() {
    return this.appPhase === APP_PHASES.START_GAME;
  }

  isPhasePlaying() {
    return this.appPhase === APP_PHASES.PLAYING;
  }

  isPhaseGameOver() {
    return this.appPhase === APP_PHASES.GAME_OVER;
  }

  setPhaseStartGame() {
    this.appPhase = APP_PHASES.START_GAME;
    this.phaseTime = 0;
  }

  setPhasePlaying() {
    this.appPhase = APP_PHASES.PLAYING;
    this.phaseTime = 0;
    this.score = 0;
  }

  setPhaseGameOver() {
    this.appPhase = APP_PHASES.GAME_OVER;
    this.phaseTime = 0;
  }
}

export default new AppPhaseManager();
