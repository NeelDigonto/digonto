import * as THREE from "three";
//import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { Engine } from "./Engine";
import vertexShader from "@/shader/noise/vertex.glsl";
import fragmentShader from "@/shader/noise/fragment.glsl";

// @ts-ignore
import Stats from "three/addons/libs/stats.module";

export class BackgroundRenderer {
  private engine: Engine;
  private canvas: HTMLCanvasElement; // should always be attached

  private canvas_width_: number;
  private canvas_height_: number;

  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;

  private material: THREE.ShaderMaterial;
  private geometry: THREE.SphereGeometry;
  private mesh: THREE.Mesh;

  private isPlaying: boolean;
  private delta: number;
  private lastFrameStartTimeStamp: number;
  private lastFrameRenderTime: number;

  private stats: Stats;

  //editorControls: EditorControls | null = null;

  constructor(engine: Engine) {
    console.log("Render Engine Initialized");
    this.engine = engine;
    {
      const canvas = document.getElementById("canvas") as HTMLCanvasElement;
      if (!canvas)
        throw new Error(
          "Canvas not found from BackgroundRenderer constructor."
        );

      this.canvas = canvas;
    }

    this.canvas_width_ = this.canvas.clientWidth;
    this.canvas_height_ = this.canvas.clientHeight;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });

    this.renderer.setClearColor(new THREE.Color(0, 0, 0), 1);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.8;
    this.renderer.shadowMap.enabled = false; // Disable since simple shader render

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      70,
      this.canvas_width_ / this.canvas_height_,
      0.0001,
      10
    );
    this.camera.position.setZ(1.3);
    this.camera.lookAt(0, 0, 0);

    this.resize();
    window.addEventListener("resize", this.resize.bind(this));

    this.material = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      uniforms: {
        time: { value: 0 },
        /*   resolution: {
          value: new THREE.Vector4(),
        }, */
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    });
    this.geometry = new THREE.SphereGeometry(1.5, 40, 40);
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);

    this.isPlaying = false;
    this.delta = 0;
    this.lastFrameStartTimeStamp = 0;
    this.lastFrameRenderTime = 0;

    this.stats = new Stats();
    this.stats.showPanel(1);
    document.body.appendChild(this.stats.dom);
  }

  private resize() {
    this.canvas_width_ = window.innerWidth;
    this.canvas_height_ = window.innerHeight;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.canvas_width_, this.canvas_height_);

    this.camera.aspect = this.canvas_width_ / this.canvas_height_;
    this.camera.updateProjectionMatrix();
  }

  private animate(timestamp: number) {
    this.material.uniforms.time.value = timestamp / 2000;

    this.renderer.render(this.scene, this.camera);

    // if (this.editorControls !== null) this.editorControls.update(this.delta);
  }

  private smartAnimate() {
    if (this.isPlaying) {
      const timestamp = performance.now();
      this.delta = timestamp - this.lastFrameStartTimeStamp;
      this.stats.begin();

      this.animate(timestamp);

      this.stats.end();
      this.lastFrameRenderTime = performance.now() - timestamp;
      this.lastFrameStartTimeStamp = timestamp;

      window.requestAnimationFrame(this.smartAnimate.bind(this));
    }
  }

  start() {
    this.isPlaying = true;
    this.smartAnimate();
  }

  stop() {
    this.isPlaying = false;
  }

  destroy() {
    this.renderer.dispose();
    console.log("Render Engine Destroyed");
  }
}
