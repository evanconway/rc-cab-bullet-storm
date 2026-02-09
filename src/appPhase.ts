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
  private allowPlayerControl: boolean;

  constructor() {
    this.appPhase = APP_PHASES.START_GAME;
    this.phaseTime = 0;
    this.score = 0;
    this.allowPlayerControl = false;
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

  getAllowPlayerControl() {
    return this.allowPlayerControl;
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
    this.allowPlayerControl = false;
  }

  setPhasePlaying() {
    this.appPhase = APP_PHASES.PLAYING;
    this.phaseTime = 0;
    this.score = 0;
    this.allowPlayerControl = true;
  }

  setPhaseGameOver(victory: boolean) {
    this.appPhase = APP_PHASES.GAME_OVER;
    this.phaseTime = 0;
    this.allowPlayerControl = victory;
  }
}

export default new AppPhaseManager();
