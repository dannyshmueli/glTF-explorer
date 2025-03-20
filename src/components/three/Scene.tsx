import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
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
  const { currentModel, modelConfig, updateAnimationAction, setCurrentModel } = useStore();
  const group = useRef<THREE.Group>(null);
  const { object } = currentModel || { object: null };
  const [detectedMorphTargets, setDetectedMorphTargets] = useState<string[]>([]);
  
  // For debugging - log what animations are available on the object
  useEffect(() => {
    if (currentModel?.object) {
      console.log('Model in Scene component:', {
        object: currentModel.object,
        hasAnimationsOnObject: currentModel.object.animations && currentModel.object.animations.length > 0,
        animations: currentModel.object.animations,
        animationsCount: currentModel.object.animations ? currentModel.object.animations.length : 0
      });
      
      // Detect morph targets
      const morphTargets: string[] = [];
      currentModel.object.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          // Safely check for morphTargetDictionary
          const morphDict = child.morphTargetDictionary;
          if (morphDict) {
            console.log('Found mesh with morph targets:', child.name, morphDict);
            Object.keys(morphDict).forEach(key => {
              if (!morphTargets.includes(key)) {
                morphTargets.push(key);
              }
            });
          }
        }
      });
      
      if (morphTargets.length > 0) {
        console.log('Found morph targets:', morphTargets);
        setDetectedMorphTargets(morphTargets);
      }
    }
  }, [currentModel?.object]); // Only depend on the object, not the entire currentModel
  
  // Update the model with detected morph targets
  useEffect(() => {
    if (detectedMorphTargets.length > 0 && currentModel && !currentModel.morphTargets) {
      setCurrentModel({
        ...currentModel,
        morphTargets: detectedMorphTargets
      });
    }
  }, [detectedMorphTargets, currentModel, setCurrentModel]);
  
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
  
  // Apply morph target influences from the store
  useFrame(() => {
    if (currentModel?.object && modelConfig.morphTargetInfluences) {
      currentModel.object.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          // Safely check for morphTargetDictionary and morphTargetInfluences
          const morphDict = child.morphTargetDictionary;
          const morphInfluences = child.morphTargetInfluences;
          
          if (morphDict && morphInfluences) {
            Object.entries(modelConfig.morphTargetInfluences || {}).forEach(([name, value]) => {
              const index = morphDict[name];
              if (index !== undefined) {
                morphInfluences[index] = value;
              }
            });
          }
        }
      });
    }
  });

  // Apply model transformations
  return (
    <group ref={group}>
      {object && (
        <primitive 
          object={object} 
          position={modelConfig.position}
          rotation={[
            modelConfig.rotation[0] * Math.PI / 180,
            modelConfig.rotation[1] * Math.PI / 180,
            modelConfig.rotation[2] * Math.PI / 180
          ]}
          scale={modelConfig.scale}
        />
      )}
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
        shadow-mapSize-width={2048} 
        shadow-mapSize-height={2048} 
      />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} />
      
      {sceneSettings.showGrid && <Grid infiniteGrid fadeDistance={50} fadeStrength={5} />}
      {sceneSettings.showAxes && (
        <axesHelper args={[5]} />
      )}
      
      <Environment preset="city" />
    </>
  );
};

/**
 * Main 3D Scene component
 */
const Scene: React.FC = () => {
  const { currentModel } = useStore();
  
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas shadows camera={{ position: [0, 2, 5], fov: 50 }}>
        <Environment3D />
        
        <Center>
          {currentModel && <Model />}
        </Center>
        
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={1}
          maxDistance={20}
        />
      </Canvas>
    </div>
  );
};

export default Scene;
