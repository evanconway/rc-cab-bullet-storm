const width = 336;
const height = 262;
export const SCREEN = {
  WIDTH: width,
  HEIGHT: height,
  WIDTH_CENTER: width / 2,
  HEIGHT_CENTER: height / 2,
  BUFFER: 16,
} as const;

export type ScreenEdge = 0 | 1 | 2 | 3;

export const SCREEN_EDGES = {
  TOP: 0,
  BOTTOM: 1,
  LEFT: 2,
  RIGHT: 3,
} as const;

export const getRandomScreenEdge = () =>
  Math.floor(Math.random() * 4) as ScreenEdge;

export const isScreenEdgeTop = (screenEdge: ScreenEdge) =>
  screenEdge === SCREEN_EDGES.TOP;
export const isScreenEdgeBottom = (screenEdge: ScreenEdge) =>
  screenEdge === SCREEN_EDGES.BOTTOM;
export const isScreenEdgeLeft = (screenEdge: ScreenEdge) =>
  screenEdge === SCREEN_EDGES.LEFT;
export const isScreenEdgeRight = (screenEdge: ScreenEdge) =>
  screenEdge === SCREEN_EDGES.RIGHT;

const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;
canvas.setAttribute("width", String(SCREEN.WIDTH));
canvas.setAttribute("height", String(SCREEN.HEIGHT));

const ctx = canvas.getContext("2d")!;

const defaultFrameTime = (1 / 60) * 1000;

export const setGameLoop = (
  drawCallback: (params: {
    context: CanvasRenderingContext2D;
    getFrameTimeNormalizedNum: (num: number) => number;
    frameTime: number;
  }) => void,
) => {
  let lastFrameTime = Date.now();
  const preparedCallback = () => {
    const currentFrameTime = Date.now();
    ctx.clearRect(0, 0, SCREEN.WIDTH, SCREEN.HEIGHT);

    const frameTime = currentFrameTime - lastFrameTime; // real, put back in when done debugging
    // const frameTime = 20; // fake, remove when done

    const frametimePercentage = frameTime / defaultFrameTime;

    drawCallback({
      context: ctx,
      getFrameTimeNormalizedNum: (num: number) => num * frametimePercentage,
      frameTime,
    });
    lastFrameTime = currentFrameTime;
    requestAnimationFrame(preparedCallback);
  };

  preparedCallback();
};
