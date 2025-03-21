import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { exportAnimationActionAsJSON } from '../../utils/modelLoader';

const AnimationControls: React.FC = () => {
  const { currentModel, toggleAnimation, setAnimationSpeed, resetAllAnimations } = useStore();
  const [speedValues, setSpeedValues] = useState<Record<string, number>>({});
  const [expandedAnimation, setExpandedAnimation] = useState<string | null>(null);

  // Handle copying animation data to clipboard
  const handleCopyToClipboard = (animationName: string) => {
    const animation = currentModel?.animations.find(a => a.name === animationName);
    if (animation?.action) {
      const jsonData = exportAnimationActionAsJSON(animationName, animation.action);
      navigator.clipboard.writeText(jsonData)
        .then(() => {
          alert('Animation data copied to clipboard!');
        })
        .catch(err => {
          console.error('Failed to copy animation data:', err);
          alert('Failed to copy animation data');
        });
    }
  };

  // Handle animation speed change
  const handleSpeedChange = (animationName: string, speed: number) => {
    setSpeedValues(prev => ({ ...prev, [animationName]: speed }));
    setAnimationSpeed(animationName, speed);
  };

  // Handle animation toggle (play/pause)
  const handleToggleAnimation = (animationName: string) => {
    toggleAnimation(animationName);
  };

  // Toggle expanded state for animation details
  const toggleExpanded = (animationName: string) => {
    setExpandedAnimation(expandedAnimation === animationName ? null : animationName);
  };

  if (!currentModel || currentModel.animations.length === 0) {
    return (
      <div className="animation-controls" style={{ padding: '20px' }}>
        <p>No animations found in the current model.</p>
      </div>
    );
  }

  return (
    <div className="animation-controls" style={{ 
      padding: '0', 
      background: '#2a2a2a', 
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }}>
      {/* Fixed header section */}
      <div style={{ 
        padding: '10px',
        marginBottom: '15px',
        borderBottom: '1px solid #444',
        background: '#2a2a2a',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <h3 style={{ marginTop: 0, color: '#fff' }}>Animation Controls</h3>
        
        <div style={{ marginBottom: '15px' }}>
          <button 
            onClick={resetAllAnimations}
            style={{
              padding: '8px 12px',
              background: '#4a4a4a',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Reset All Animations
          </button>
        </div>
      </div>
      
      {/* Scrollable animation list */}
      <div style={{ 
        overflowY: 'auto',
        padding: '10px',
        flex: 1
      }}>
        {currentModel.animations.map((animation) => (
          <div 
            key={animation.name}
            className="animation-item"
            style={{
              border: '1px solid #444',
              borderRadius: '4px',
              marginBottom: '10px',
              overflow: 'hidden'
            }}
          >
            <div 
              className="animation-header"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px',
                background: '#333',
                cursor: 'pointer'
              }}
              onClick={() => toggleExpanded(animation.name)}
            >
              <div>
                <span style={{ fontWeight: 'bold' }}>{animation.name}</span>
                <span style={{ marginLeft: '10px', fontSize: '0.8em', color: '#aaa' }}>
                  ({animation.duration.toFixed(2)}s)
                </span>
              </div>
              <span>{expandedAnimation === animation.name ? '▲' : '▼'}</span>
            </div>
            
            {expandedAnimation === animation.name && (
              <div className="animation-details" style={{ padding: '10px', background: '#2a2a2a' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <button
                    onClick={() => handleToggleAnimation(animation.name)}
                    style={{
                      padding: '5px 10px',
                      background: animation.isPlaying ? '#f44336' : '#4caf50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      marginRight: '10px'
                    }}
                  >
                    {animation.isPlaying ? 'Pause' : 'Play'}
                  </button>
                  
                  <button
                    onClick={() => handleCopyToClipboard(animation.name)}
                    style={{
                      padding: '5px 10px',
                      background: '#2196f3',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Export
                  </button>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: '10px' }}>Speed:</span>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={speedValues[animation.name] || 1}
                    onChange={(e) => handleSpeedChange(animation.name, parseFloat(e.target.value))}
                    style={{ flex: 1 }}
                  />
                  <span style={{ marginLeft: '10px', minWidth: '40px' }}>
                    {(speedValues[animation.name] || 1).toFixed(1)}x
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnimationControls;
