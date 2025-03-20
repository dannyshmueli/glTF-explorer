import { create } from 'zustand';
import { AnimationAction } from 'three';
import { ModelInfo, SceneSettings, ModelConfig } from '../types';

interface AnimationState {
  // Model & Animation State
  currentModel: ModelInfo | null;
  modelConfig: ModelConfig;
  availableModels: ModelInfo[];
  isLoading: boolean;
  error: string | null;
  
  // Scene Settings
  sceneSettings: SceneSettings;
  
  // Actions
  setCurrentModel: (model: ModelInfo | null) => void;
  addAvailableModel: (model: ModelInfo) => void;
  updateModelConfig: (config: Partial<ModelConfig>) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updateSceneSettings: (settings: Partial<SceneSettings>) => void;
  
  // Animation Controls
  toggleAnimation: (animationName: string, play?: boolean) => void;
  updateAnimationAction: (animationName: string, action: AnimationAction) => void;
  setAnimationSpeed: (animationName: string, speed: number) => void;
  resetAllAnimations: () => void;
}

const DEFAULT_MODEL_CONFIG: ModelConfig = {
  position: [0, 0, 0],
  rotation: [0, 0, 0],
  scale: [1, 1, 1],
};

const DEFAULT_SCENE_SETTINGS: SceneSettings = {
  showGrid: true,
  showAxes: true,
  background: '#1a1a1a',
};

export const useStore = create<AnimationState>((set) => ({
  // Initial State
  currentModel: null,
  modelConfig: DEFAULT_MODEL_CONFIG,
  availableModels: [],
  isLoading: false,
  error: null,
  sceneSettings: DEFAULT_SCENE_SETTINGS,
  
  // Actions
  setCurrentModel: (model) => set({ currentModel: model }),
  
  addAvailableModel: (model) => set((state) => ({
    availableModels: [...state.availableModels, model]
  })),
  
  updateModelConfig: (config) => set((state) => ({
    modelConfig: { ...state.modelConfig, ...config }
  })),
  
  setIsLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),
  
  updateSceneSettings: (settings) => set((state) => ({
    sceneSettings: { ...state.sceneSettings, ...settings }
  })),
  
  // Animation Controls
  toggleAnimation: (animationName, play) => set((state) => {
    if (!state.currentModel) return state;
    
    const updatedAnimations = state.currentModel.animations.map(anim => {
      if (anim.name === animationName) {
        const newIsPlaying = play !== undefined ? play : !anim.isPlaying;
        
        // Update the animation action if it exists
        if (anim.action) {
          if (newIsPlaying) {
            anim.action.play();
          } else {
            anim.action.paused = true; // Use paused property instead of pause() method
          }
        }
        
        return { ...anim, isPlaying: newIsPlaying };
      }
      return anim;
    });
    
    return {
      currentModel: {
        ...state.currentModel,
        animations: updatedAnimations
      }
    };
  }),
  
  updateAnimationAction: (animationName, action) => set((state) => {
    if (!state.currentModel) return state;
    
    const updatedAnimations = state.currentModel.animations.map(anim => {
      if (anim.name === animationName) {
        return { ...anim, action };
      }
      return anim;
    });
    
    return {
      currentModel: {
        ...state.currentModel,
        animations: updatedAnimations
      }
    };
  }),
  
  setAnimationSpeed: (animationName, speed) => set((state) => {
    if (!state.currentModel) return state;
    
    const updatedAnimations = state.currentModel.animations.map(anim => {
      if (anim.name === animationName && anim.action) {
        anim.action.timeScale = speed;
        return anim;
      }
      return anim;
    });
    
    return {
      currentModel: {
        ...state.currentModel,
        animations: updatedAnimations
      }
    };
  }),
  
  resetAllAnimations: () => set((state) => {
    if (!state.currentModel) return state;
    
    const updatedAnimations = state.currentModel.animations.map(anim => {
      if (anim.action) {
        anim.action.reset();
        if (anim.isPlaying) {
          anim.action.play();
        }
      }
      return anim;
    });
    
    return {
      currentModel: {
        ...state.currentModel,
        animations: updatedAnimations
      }
    };
  }),
}));
