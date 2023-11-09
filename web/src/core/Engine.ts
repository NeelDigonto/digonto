import { BackgroundRenderer } from "./BackgroundRenderer";

export class Engine {
  private backgroundRenderer: BackgroundRenderer;

  constructor() {
    console.log("Engine Loaded");

    this.backgroundRenderer = new BackgroundRenderer(this);
  }

  startBackgroundRenderer() {
    this.backgroundRenderer.start();
  }

  destroyBackgroundRenderer() {
    this.backgroundRenderer.destroy();
  }
}
