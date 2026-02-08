const width = 336;
const height = 262;
export const SCREEN = {
  WIDTH: width,
  HEIGHT: height,
  WIDTH_CENTER: width / 2,
  HEIGHT_CENTER: height / 2,
  BUFFER: 16,
} as const;

const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;
canvas.setAttribute("width", String(SCREEN.WIDTH));
canvas.setAttribute("height", String(SCREEN.HEIGHT));

const ctx = canvas.getContext("2d")!;

const defaultFrameTime = (1 / 60) * 1000;

export const setGameLoop = (
  drawCallback: (params: {
    context: CanvasRenderingContext2D;
    getFrameTimeNormalizedNum: (num: number) => number;
  }) => void,
) => {
  let lastFrameTime = Date.now();
  const preparedCallback = () => {
    const currentFrameTime = Date.now();
    ctx.clearRect(0, 0, SCREEN.WIDTH, SCREEN.HEIGHT);

    // const frametimePercentage =
    //   (currentFrameTime - lastFrameTime) / defaultFrameTime;

    const frametimePercentage = 0.42; // just for debugging

    drawCallback({
      context: ctx,
      getFrameTimeNormalizedNum: (num: number) => num * frametimePercentage,
    });
    lastFrameTime = currentFrameTime;
    requestAnimationFrame(preparedCallback);
  };

  preparedCallback();
};
