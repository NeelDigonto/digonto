import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { Engine } from "./Engine";

export class RenderEngine {
  // should always be attached
  canvas: HTMLCanvasElement;
  engine: Engine;
  //editorControls: EditorControls | null = null;

  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;

  isPlaying: boolean = false;
  mainScene: THREE.Scene = new THREE.Scene();
  width_: number = 0;
  height_: number = 0;
  delta: number = 0;
  lastFrameStartTimeStamp: number = 0;
  lastFrameRenderTime: number = 0;

  constructor(
    engine: Engine,
    canvas: HTMLCanvasElement,
    width: number,
    height: number
  ) {
    console.log("Render Engine Initialized");
    this.engine = engine;
    this.canvas = canvas;

    this.width_ = width;
    this.height_ = height;

    this.camera = new THREE.PerspectiveCamera(
      70,
      this.width_ / this.height_,
      0.01,
      1000
    );

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width_, this.height_);
    //this.renderer.setClearColor(0x87ceeb, 1);
    this.renderer.setClearColor(0x000, 1);

    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.shadowMap.enabled = true;
    this.renderer.toneMappingExposure = 0.8;
  }

  resize(width: number, height: number) {
    this.width_ = width;
    this.height_ = height;
    this.renderer.setSize(this.width_, this.height_);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.camera.aspect = this.width_ / this.height_;
    this.camera.updateProjectionMatrix();
  }

  animate() {
    const timestamp = performance.now();
    this.delta = timestamp - this.lastFrameStartTimeStamp;

    this.renderer.render(this.mainScene, this.camera);

    this.lastFrameRenderTime = performance.now() - timestamp;
    this.lastFrameStartTimeStamp = timestamp;

    // if (this.editorControls !== null) this.editorControls.update(this.delta);
  }

  start() {
    //this.render();
    //window.requestAnimationFrame(this.start);

    this.renderer.setAnimationLoop(() => this.animate());
  }

  destroy() {
    this.renderer.dispose();
    console.log("Render Engine Destroyed");
  }
}
