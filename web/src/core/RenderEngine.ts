import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { Engine } from "./Engine";
import vertexShader from "@/shader/noise/vertex.glsl";
import fragmentShader from "@/shader/noise/fragment.glsl";

export class RenderEngine {
  // should always be attached
  canvas: HTMLCanvasElement;
  engine: Engine;
  //editorControls: EditorControls | null = null;

  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;

  isPlaying: boolean = false;
  scene: THREE.Scene;
  width_: number = 0;
  height_: number = 0;
  delta: number = 0;
  lastFrameStartTimeStamp: number = 0;
  lastFrameRenderTime: number = 0;

  material: THREE.ShaderMaterial;
  //  planeMaterial: THREE.MeshPhysicalMaterial;
  geometry: THREE.SphereGeometry;
  mesh: THREE.Mesh;

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
      0.0001,
      10
    );

    this.camera.position.setZ(1.3);
    this.camera.lookAt(0, 0, 0);

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

    this.scene = new THREE.Scene();

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

    //this.planeGeometry = new THREE.PlaneGeometry(40, 40, 1, 1);
    this.geometry = new THREE.SphereGeometry(1.5, 40, 40);

    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.scene.add(this.mesh);
  }

  addObjects() {}

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

    this.material.uniforms.time.value = timestamp / 2000;

    this.renderer.render(this.scene, this.camera);

    this.lastFrameRenderTime = performance.now() - timestamp;
    this.lastFrameStartTimeStamp = timestamp;

    // if (this.editorControls !== null) this.editorControls.update(this.delta);

    window.requestAnimationFrame(this.animate.bind(this));
  }

  start() {
    //this.render();
    //window.requestAnimationFrame(this.start);
    //this.renderer.setAnimationLoop(() => this.animate());

    this.animate();
  }

  destroy() {
    this.renderer.dispose();
    console.log("Render Engine Destroyed");
  }
}
