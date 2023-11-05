import { RenderEngine } from "./RenderEngine";

export class Engine {
  renderEngine: RenderEngine | null = null;

  constructor() {
    console.log("Engine Loaded");
  }

  initializeRenderEngine(
    canvas: HTMLCanvasElement,
    width: number,
    height: number
  ) {
    this.renderEngine = new RenderEngine(this, canvas, width, height);
  }

  resizeRenderer(width: number, height: number) {
    if (!this.renderEngine) {
      console.warn("Render Engine not present during resize.");
    }
  }

  startRender() {
    if (!this.renderEngine) {
      console.warn("No Render Engine during start.");
      return;
    }

    this.renderEngine?.start();
  }

  destroyRenderEngine() {
    this.renderEngine?.destroy();
    this.renderEngine = null;
  }
}
