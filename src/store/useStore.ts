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
  
  // Morph Target Controls
  updateMorphTargetInfluence: (targetName: string, value: number) => void;
  resetMorphTargets: () => void;
}

const DEFAULT_MODEL_CONFIG: ModelConfig = {
  position: [0, 0, 0],
  rotation: [0, 0, 0],
  scale: [1, 1, 1],
  morphTargetInfluences: {},
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
  
  // Model Actions
  setCurrentModel: (model) => set((state) => {
    // Reset model config when loading a new model
    return {
      currentModel: model,
      modelConfig: {
        ...DEFAULT_MODEL_CONFIG,
        // Keep any existing morph target influences
        morphTargetInfluences: state.modelConfig.morphTargetInfluences || {},
      }
    };
  }),
  
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
    
    const updatedAnimations = state.currentModel.animations.map(animation => {
      if (animation.name === animationName) {
        const shouldPlay = play !== undefined ? play : !animation.isPlaying;
        
        // Update the action state
        if (animation.action) {
          if (shouldPlay) {
            animation.action.reset().play();
          } else {
            animation.action.stop();
          }
        }
        
        return {
          ...animation,
          isPlaying: shouldPlay
        };
      }
      return animation;
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
    
    const updatedAnimations = state.currentModel.animations.map(animation => {
      if (animation.name === animationName) {
        return {
          ...animation,
          action
        };
      }
      return animation;
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
    
    const updatedAnimations = state.currentModel.animations.map(animation => {
      if (animation.name === animationName && animation.action) {
        // Update the timeScale of the action
        animation.action.timeScale = speed;
        
        return animation; // No need to create a new object as we're just modifying the action
      }
      return animation;
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
    
    const updatedAnimations = state.currentModel.animations.map(animation => {
      if (animation.action && animation.isPlaying) {
        animation.action.stop();
      }
      
      return {
        ...animation,
        isPlaying: false
      };
    });
    
    return {
      currentModel: {
        ...state.currentModel,
        animations: updatedAnimations
      }
    };
  }),
  
  // Morph Target Controls
  updateMorphTargetInfluence: (targetName, value) => set((state) => ({
    modelConfig: {
      ...state.modelConfig,
      morphTargetInfluences: {
        ...state.modelConfig.morphTargetInfluences,
        [targetName]: value
      }
    }
  })),
  
  resetMorphTargets: () => set((state) => ({
    modelConfig: {
      ...state.modelConfig,
      morphTargetInfluences: {}
    }
  }))
}));
