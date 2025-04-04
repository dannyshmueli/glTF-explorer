import React from 'react';
import { useStore } from '../../store/useStore';
import { Object3D, Box3, Vector3 } from 'three';

const ModelInfo: React.FC = () => {
  const { currentModel, setCurrentModel, resetAllAnimations, resetMorphTargets } = useStore();

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

  // Calculate model dimensions
  const getModelSize = (object: Object3D | undefined): { width: number; height: number; depth: number } => {
    if (!object) return { width: 0, height: 0, depth: 0 };

    const boundingBox = new Box3().setFromObject(object);
    const size = new Vector3();
    boundingBox.getSize(size);

    return {
      width: parseFloat(size.x.toFixed(2)),
      height: parseFloat(size.y.toFixed(2)),
      depth: parseFloat(size.z.toFixed(2))
    };
  };

  const handleRemoveModel = () => {
    // Reset animations and morph targets first
    resetAllAnimations();
    resetMorphTargets();
    // Set current model to null to return to initial state
    setCurrentModel(null);
  };

  const meshCount = countMeshes(currentModel.object);
  const animationCount = currentModel.animations.length;
  const modelSize = getModelSize(currentModel.object);

  return (
    <div className="model-info" style={{ padding: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h3 style={{ marginTop: 0, marginBottom: 0 }}>Model Information</h3>
        <button 
          onClick={handleRemoveModel}
          style={{
            background: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '6px 12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '14px'
          }}
        >
          Remove Model
        </button>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '8px' }}>
        <span style={{ fontWeight: 'bold' }}>Name:</span>
        <span>{currentModel.name}</span>
        
        <span style={{ fontWeight: 'bold' }}>Meshes:</span>
        <span>{meshCount}</span>
        
        <span style={{ fontWeight: 'bold' }}>Size:</span>
        <span>W: {modelSize.width}m × H: {modelSize.height}m × D: {modelSize.depth}m</span>
        
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
