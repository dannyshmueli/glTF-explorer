import React from 'react';
import { useStore } from '../../store/useStore';

const ExpressionControls: React.FC = () => {
  const { currentModel, modelConfig, updateMorphTargetInfluence, resetMorphTargets } = useStore();
  
  // If no model or no morph targets, show a message
  if (!currentModel || !currentModel.morphTargets || currentModel.morphTargets.length === 0) {
    return (
      <div style={{ padding: '20px', color: '#aaa' }}>
        <p>No facial expressions available for this model.</p>
        <p style={{ fontSize: '0.9em' }}>
          Try loading the example robot model, which includes expressions like "Angry", "Surprised", and "Sad".
        </p>
      </div>
    );
  }
  
  // Handle slider change for a morph target
  const handleExpressionChange = (name: string, value: number) => {
    updateMorphTargetInfluence(name, value);
  };
  
  // Reset all expressions
  const handleResetExpressions = () => {
    resetMorphTargets();
  };
  
  return (
    <div className="expression-controls" style={{ padding: '10px', color: '#eee' }}>
      <h3 style={{ marginTop: 0, marginBottom: '15px' }}>Facial Expressions</h3>
      
      <div style={{ marginBottom: '15px' }}>
        <button 
          onClick={handleResetExpressions}
          style={{
            padding: '8px 12px',
            background: '#4a4a4a',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Reset Expressions
        </button>
      </div>
      
      <div className="expressions-list">
        {currentModel.morphTargets.map((name) => (
          <div 
            key={name}
            className="expression-item"
            style={{
              marginBottom: '15px',
              background: '#333',
              borderRadius: '4px',
              padding: '10px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>{name}</span>
              <span>{((modelConfig.morphTargetInfluences?.[name] || 0) * 100).toFixed(0)}%</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={modelConfig.morphTargetInfluences?.[name] || 0}
                onChange={(e) => handleExpressionChange(name, parseFloat(e.target.value))}
                style={{ flex: 1 }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpressionControls;
