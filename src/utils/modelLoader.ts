import { AnimationClip } from 'three';
import { GLTF } from 'three-stdlib';
import { ModelInfo } from '../types';
import { AnimationAction } from 'three';

/**
 * Processes a loaded GLTF model to extract animation information
 */
export const processModel = (
  gltf: GLTF,
  name = 'Uploaded Model'
): ModelInfo => {
  const object = gltf.scene;
  
  // Store the original animations on the scene object for later use
  // This is crucial for the useAnimations hook to work properly
  object.animations = gltf.animations || [];
  
  // Log detailed animation information
  console.log(`Processing model animations:`, {
    gltfAnimations: gltf.animations,
    objectAnimations: object.animations,
    animationsLength: (gltf.animations || []).length,
  });
  
  if (gltf.animations && gltf.animations.length > 0) {
    gltf.animations.forEach((anim, index) => {
      console.log(`Animation ${index}:`, {
        name: anim.name,
        duration: anim.duration,
        tracks: anim.tracks ? anim.tracks.length : 0,
        trackNames: anim.tracks ? anim.tracks.map(t => t.name) : []
      });
    });
  }
  
  // Create animation info from animation clips
  const animationInfos = (gltf.animations || []).map((clip: AnimationClip) => ({
    name: clip.name || `Animation ${gltf.animations.indexOf(clip)}`,
    duration: clip.duration,
    isPlaying: false,
  }));
  
  // If no animations found, add a placeholder to make UI visible
  if (animationInfos.length === 0) {
    console.log('No animations found in model, adding a placeholder for UI');
    animationInfos.push({
      name: 'No animations found',
      duration: 0,
      isPlaying: false
    });
  }
  
  console.log('Final processed model:', {
    name,
    animations: animationInfos,
    objectHasAnimations: object.animations && object.animations.length > 0
  });
  
  return {
    name,
    animations: animationInfos,
    object
  };
};

/**
 * Creates a file URL from a file object
 */
export const createFileURL = (file: File): string => {
  return URL.createObjectURL(file);
};

/**
 * Cleans up a file URL
 */
export const revokeFileURL = (url: string): void => {
  URL.revokeObjectURL(url);
};

/**
 * Validates if a file is a glTF or GLB file
 */
export const isValidGLTFFile = (file: File): boolean => {
  const extension = file.name.split('.').pop()?.toLowerCase();
  return extension === 'gltf' || extension === 'glb';
};

/**
 * Extracts the filename without extension
 */
export const getFileNameWithoutExtension = (filename: string): string => {
  return filename.split('.').slice(0, -1).join('.');
};

/**
 * Generates a JSON representation of an AnimationAction
 */
export const exportAnimationActionAsJSON = (animationName: string, action: AnimationAction): string => {
  if (!action) return '{}';
  
  const exportData = {
    name: animationName,
    time: action.time,
    timeScale: action.timeScale,
    weight: action.weight,
    loop: {
      repetitions: action.loop,
      clampWhenFinished: action.clampWhenFinished,
      zeroSlopeAtEnd: action.zeroSlopeAtEnd,
      zeroSlopeAtStart: action.zeroSlopeAtStart
    }
  };
  
  return JSON.stringify(exportData, null, 2);
};
