import { AnimationAction, Object3D } from 'three';

export interface AnimationInfo {
  name: string;
  duration: number;
  action?: AnimationAction;
  isPlaying: boolean;
}

export interface ModelInfo {
  name: string;
  animations: AnimationInfo[];
  object?: Object3D;
}

export interface ModelConfig {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
}

export interface SceneSettings {
  showGrid: boolean;
  showAxes: boolean;
  background: string;
}
