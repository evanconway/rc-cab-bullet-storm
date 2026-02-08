type AppPhase = 0 | 1 | 2;

const APP_PHASES = {
  START_GAME: 0 as AppPhase,
  PLAYING: 1 as AppPhase,
  GAME_OVER: 2 as AppPhase,
} as const;

class AppPhaseManager {
  private appPhase: AppPhase;

  constructor() {
    this.appPhase = APP_PHASES.START_GAME;
  }

  advance() {
    if (this.appPhase === APP_PHASES.START_GAME) {
      this.appPhase = APP_PHASES.PLAYING;
    } else if (this.appPhase === APP_PHASES.PLAYING) {
      this.appPhase = APP_PHASES.GAME_OVER;
    } else if (this.appPhase === APP_PHASES.GAME_OVER) {
      this.appPhase = APP_PHASES.START_GAME;
    }
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
}

export default new AppPhaseManager();
