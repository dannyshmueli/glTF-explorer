import React from 'react';
import { useStore } from '../../store/useStore';
import { Object3D } from 'three';

const ModelInfo: React.FC = () => {
  const { currentModel } = useStore();

  if (!currentModel) {
    return null;
  }

  // Calculate some statistics about the model
  const countMeshes = (object: Object3D | undefined): number => {
    if (!object) return 0;
    
    let count = 0;
    if (object.type === 'Mesh') count++;
    
    object.children.forEach((child: Object3D) => {
      count += countMeshes(child);
    });
    
    return count;
  };

  const meshCount = countMeshes(currentModel.object);
  const animationCount = currentModel.animations.length;

  return (
    <div className="model-info" style={{ padding: '10px' }}>
      <h3 style={{ marginTop: 0 }}>Model Information</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '8px' }}>
        <span style={{ fontWeight: 'bold' }}>Name:</span>
        <span>{currentModel.name}</span>
        
        <span style={{ fontWeight: 'bold' }}>Meshes:</span>
        <span>{meshCount}</span>
        
        <span style={{ fontWeight: 'bold' }}>Animations:</span>
        <span>{animationCount}</span>
        
        <span style={{ fontWeight: 'bold' }}>Total Duration:</span>
        <span>
          {currentModel.animations.reduce((total, anim) => total + anim.duration, 0).toFixed(2)}s
        </span>
      </div>
    </div>
  );
};

export default ModelInfo;
