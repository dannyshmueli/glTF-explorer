import React from 'react';
import { useStore } from '../../store/useStore';

const SceneSettings: React.FC = () => {
  const { sceneSettings, updateSceneSettings } = useStore();

  return (
    <div className="scene-settings" style={{ padding: '10px' }}>
      <h3 style={{ marginTop: 0 }}>Scene Settings</h3>
      
      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'flex', alignItems: 'center' }}>
          <input
            type="checkbox"
            checked={sceneSettings.showGrid}
            onChange={(e) => updateSceneSettings({ showGrid: e.target.checked })}
            style={{ marginRight: '8px' }}
          />
          Show Grid
        </label>
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'flex', alignItems: 'center' }}>
          <input
            type="checkbox"
            checked={sceneSettings.showAxes}
            onChange={(e) => updateSceneSettings({ showAxes: e.target.checked })}
            style={{ marginRight: '8px' }}
          />
          Show Axes
        </label>
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>
          Background Color:
        </label>
        <input
          type="color"
          value={sceneSettings.background}
          onChange={(e) => updateSceneSettings({ background: e.target.value })}
          style={{ width: '100%' }}
        />
      </div>
    </div>
  );
};

export default SceneSettings;
