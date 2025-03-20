import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  Grid, 
  Environment, 
  useAnimations,
  Center
} from '@react-three/drei';
import { useStore } from '../../store/useStore';
import * as THREE from 'three';

/**
 * Model component that renders the loaded glTF model
 */
const Model: React.FC = () => {
  const { currentModel, modelConfig, updateAnimationAction } = useStore();
  const group = useRef<THREE.Group>(null);
  const { object } = currentModel || { object: null };
  
  // For debugging - log what animations are available on the object
  useEffect(() => {
    if (currentModel?.object) {
      console.log('Model in Scene component:', {
        object: currentModel.object,
        hasAnimationsOnObject: currentModel.object.animations && currentModel.object.animations.length > 0,
        animations: currentModel.object.animations,
        animationsCount: currentModel.object.animations ? currentModel.object.animations.length : 0
      });
    }
  }, [currentModel]);
  
  // Extract animation clips from the current model for the useAnimations hook
  // The hook expects actual THREE.AnimationClip objects, not our animation info objects
  const clipObjects = currentModel?.object?.animations || [];

  // Initialize animations with actual THREE.AnimationClip objects
  const { actions, names } = useAnimations(clipObjects, group);
  
  // For debugging - log what animations drei's useAnimations found
  useEffect(() => {
    console.log('useAnimations results:', { 
      actions, 
      names, 
      hasActions: actions && Object.keys(actions).length > 0 
    });
  }, [actions, names]);

  // Update store with animation actions
  useEffect(() => {
    if (actions && names && names.length > 0) {
      console.log('Adding animation actions to store:', names);
      names.forEach((name) => {
        if (actions[name]) {
          try {
            // Check if the action has necessary methods before using it
            updateAnimationAction(name, actions[name]);
          } catch (error) {
            console.error(`Error setting up animation: ${name}`, error);
          }
        }
      });
    }
  }, [actions, names, updateAnimationAction]);

  // Update transforms based on model config
  useEffect(() => {
    if (group.current) {
      group.current.position.set(...modelConfig.position);
      group.current.rotation.set(...modelConfig.rotation);
      group.current.scale.set(...modelConfig.scale);
    }
  }, [modelConfig]);

  if (!object) return null;
  
  return (
    <group ref={group}>
      <primitive 
        object={object} 
      />
    </group>
  );
};

/**
 * Environment and lighting setup
 */
const Environment3D: React.FC = () => {
  const { sceneSettings } = useStore();
  const { scene } = useThree();

  // Update background color when scene settings change
  useEffect(() => {
    scene.background = new THREE.Color(sceneSettings.background);
  }, [scene, sceneSettings.background]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1} 
        castShadow 
      />
      <directionalLight 
        position={[-10, 10, 5]} 
        intensity={0.5} 
      />
      <Environment preset="city" />
    </>
  );
};

/**
 * Main 3D Scene component
 */
const Scene: React.FC = () => {
  const { sceneSettings, currentModel } = useStore();

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        camera={{ position: [0, 2, 5], fov: 50 }}
        shadows
      >
        <Environment3D />
        
        {/* Helpers */}
        {sceneSettings.showGrid && (
          <Grid 
            cellSize={1}
            cellThickness={0.5}
            cellColor="#606060"
            sectionSize={3}
            sectionThickness={1}
            sectionColor="#808080"
            fadeDistance={30}
            infiniteGrid
            position={[0, -0.01, 0]}
          />
        )}
        
        {sceneSettings.showAxes && (
          <primitive object={new THREE.AxesHelper(5)} />
        )}
        
        {/* Model */}
        {currentModel && (
          <Center>
            <Model />
          </Center>
        )}
        
        {/* Controls */}
        <OrbitControls 
          makeDefault
          enableDamping
          dampingFactor={0.1}
          rotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
};

export default Scene;
