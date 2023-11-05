import { Engine } from "../core/Engine";

//export {};

declare global {
  interface Window {
    engine: Engine;
  }
}
