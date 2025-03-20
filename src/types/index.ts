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
  morphTargets?: string[]; // Names of available morph targets/expressions
}

export interface ModelConfig {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  morphTargetInfluences?: Record<string, number>; // Morph target values (0-1)
}

export interface SceneSettings {
  showGrid: boolean;
  showAxes: boolean;
  background: string;
}
