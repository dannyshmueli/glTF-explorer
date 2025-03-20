import React from 'react';
import { useStore } from '../../store/useStore';

const ModelConfig: React.FC = () => {
  const { modelConfig, updateModelConfig } = useStore();

  // Helper function to handle vector3 updates
  const handleVectorChange = (
    property: 'position' | 'rotation' | 'scale',
    index: number,
    value: number
  ) => {
    const newVector = [...modelConfig[property]];
    newVector[index] = value;
    updateModelConfig({ [property]: newVector as [number, number, number] });
  };

  return (
    <div className="model-config" style={{ padding: '10px' }}>
      <h3 style={{ marginTop: 0 }}>Model Controls</h3>
      
      {/* Position Controls */}
      <div style={{ marginBottom: '15px' }}>
        <h4 style={{ marginTop: 0, marginBottom: '8px', fontSize: '1em' }}>Position</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '30px 1fr 50px', gap: '8px', alignItems: 'center' }}>
          <label>X:</label>
          <input
            type="range"
            min="-10"
            max="10"
            step="0.1"
            value={modelConfig.position[0]}
            onChange={(e) => handleVectorChange('position', 0, parseFloat(e.target.value))}
          />
          <span>{modelConfig.position[0].toFixed(1)}</span>
          
          <label>Y:</label>
          <input
            type="range"
            min="-10"
            max="10"
            step="0.1"
            value={modelConfig.position[1]}
            onChange={(e) => handleVectorChange('position', 1, parseFloat(e.target.value))}
          />
          <span>{modelConfig.position[1].toFixed(1)}</span>
          
          <label>Z:</label>
          <input
            type="range"
            min="-10"
            max="10"
            step="0.1"
            value={modelConfig.position[2]}
            onChange={(e) => handleVectorChange('position', 2, parseFloat(e.target.value))}
          />
          <span>{modelConfig.position[2].toFixed(1)}</span>
        </div>
      </div>
      
      {/* Rotation Controls */}
      <div style={{ marginBottom: '15px' }}>
        <h4 style={{ marginTop: 0, marginBottom: '8px', fontSize: '1em' }}>Rotation</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '30px 1fr 50px', gap: '8px', alignItems: 'center' }}>
          <label>X:</label>
          <input
            type="range"
            min="0"
            max={Math.PI * 2}
            step="0.1"
            value={modelConfig.rotation[0]}
            onChange={(e) => handleVectorChange('rotation', 0, parseFloat(e.target.value))}
          />
          <span>{(modelConfig.rotation[0] * (180 / Math.PI)).toFixed(0)}°</span>
          
          <label>Y:</label>
          <input
            type="range"
            min="0"
            max={Math.PI * 2}
            step="0.1"
            value={modelConfig.rotation[1]}
            onChange={(e) => handleVectorChange('rotation', 1, parseFloat(e.target.value))}
          />
          <span>{(modelConfig.rotation[1] * (180 / Math.PI)).toFixed(0)}°</span>
          
          <label>Z:</label>
          <input
            type="range"
            min="0"
            max={Math.PI * 2}
            step="0.1"
            value={modelConfig.rotation[2]}
            onChange={(e) => handleVectorChange('rotation', 2, parseFloat(e.target.value))}
          />
          <span>{(modelConfig.rotation[2] * (180 / Math.PI)).toFixed(0)}°</span>
        </div>
      </div>
      
      {/* Scale Controls */}
      <div style={{ marginBottom: '15px' }}>
        <h4 style={{ marginTop: 0, marginBottom: '8px', fontSize: '1em' }}>Scale</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '30px 1fr 50px', gap: '8px', alignItems: 'center' }}>
          <label>X:</label>
          <input
            type="range"
            min="0.1"
            max="5"
            step="0.1"
            value={modelConfig.scale[0]}
            onChange={(e) => handleVectorChange('scale', 0, parseFloat(e.target.value))}
          />
          <span>{modelConfig.scale[0].toFixed(1)}</span>
          
          <label>Y:</label>
          <input
            type="range"
            min="0.1"
            max="5"
            step="0.1"
            value={modelConfig.scale[1]}
            onChange={(e) => handleVectorChange('scale', 1, parseFloat(e.target.value))}
          />
          <span>{modelConfig.scale[1].toFixed(1)}</span>
          
          <label>Z:</label>
          <input
            type="range"
            min="0.1"
            max="5"
            step="0.1"
            value={modelConfig.scale[2]}
            onChange={(e) => handleVectorChange('scale', 2, parseFloat(e.target.value))}
          />
          <span>{modelConfig.scale[2].toFixed(1)}</span>
        </div>
      </div>
      
      {/* Reset Button */}
      <button
        onClick={() => updateModelConfig({
          position: [0, 0, 0],
          rotation: [0, 0, 0],
          scale: [1, 1, 1]
        })}
        style={{
          padding: '8px 12px',
          background: '#4a4a4a',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Reset Transforms
      </button>
    </div>
  );
};

export default ModelConfig;
