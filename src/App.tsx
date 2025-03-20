import { useState } from 'react';
import './App.css';
import Scene from './components/three/Scene';
import FileUploader from './components/ui/FileUploader';
import AnimationControls from './components/ui/AnimationControls';
import ModelConfig from './components/ui/ModelConfig';
import SceneSettings from './components/ui/SceneSettings';
import ModelInfo from './components/ui/ModelInfo';
import { useStore } from './store/useStore';

function App() {
  const { currentModel, isLoading, error } = useStore();
  const [sidebarTab, setSidebarTab] = useState<'animations' | 'settings' | 'model'>('animations');

  // Helper function to render the active sidebar tab content
  const renderTabContent = () => {
    switch (sidebarTab) {
      case 'animations':
        return <AnimationControls />;
      case 'settings':
        return <SceneSettings />;
      case 'model':
        return <ModelConfig />;
      default:
        return null;
    }
  };

  return (
    <div className="app-container" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <header style={{
        padding: '10px 20px',
        borderBottom: '1px solid #333',
        background: '#1a1a1a',
        color: '#fff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>glTF Animation Explorer</h1>
      </header>

      {/* Main Content */}
      <div style={{
        display: 'flex',
        flex: 1,
        overflow: 'hidden',
        background: '#1a1a1a',
      }}>
        {/* 3D Viewport */}
        <div style={{
          flex: 1,
          position: 'relative',
          overflow: 'hidden',
        }}>
          <Scene />
          
          {/* Loading Overlay */}
          {isLoading && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              zIndex: 100,
            }}>
              <div>Loading model...</div>
            </div>
          )}
          
          {/* Error Message */}
          {error && (
            <div style={{
              position: 'absolute',
              top: 20,
              left: 20,
              right: 20,
              padding: '10px',
              background: '#f44336',
              color: 'white',
              borderRadius: '4px',
              zIndex: 100,
            }}>
              {error}
            </div>
          )}
          
          {/* File Upload Area (only shown when no model is loaded) */}
          {!currentModel && !isLoading && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '80%',
              maxWidth: '500px',
              zIndex: 10,
            }}>
              <FileUploader />
            </div>
          )}
        </div>
        
        {/* Sidebar */}
        {currentModel && (
          <div style={{
            width: '300px',
            borderLeft: '1px solid #333',
            display: 'flex',
            flexDirection: 'column',
            background: '#2a2a2a',
            color: '#eee',
            overflow: 'hidden',
          }}>
            {/* Sidebar Tabs */}
            <div style={{
              display: 'flex',
              borderBottom: '1px solid #333',
            }}>
              <button
                onClick={() => setSidebarTab('animations')}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: sidebarTab === 'animations' ? '#3a3a3a' : 'transparent',
                  border: 'none',
                  borderBottom: sidebarTab === 'animations' ? '2px solid #646cff' : 'none',
                  cursor: 'pointer',
                  color: '#fff',
                }}
              >
                Animations
              </button>
              <button
                onClick={() => setSidebarTab('model')}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: sidebarTab === 'model' ? '#3a3a3a' : 'transparent',
                  border: 'none',
                  borderBottom: sidebarTab === 'model' ? '2px solid #646cff' : 'none',
                  cursor: 'pointer',
                  color: '#fff',
                }}
              >
                Model
              </button>
              <button
                onClick={() => setSidebarTab('settings')}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: sidebarTab === 'settings' ? '#3a3a3a' : 'transparent',
                  border: 'none',
                  borderBottom: sidebarTab === 'settings' ? '2px solid #646cff' : 'none',
                  cursor: 'pointer',
                  color: '#fff',
                }}
              >
                Scene
              </button>
            </div>
            
            {/* Model Info (always visible) */}
            <ModelInfo />
            
            {/* Tab Content */}
            <div style={{ flex: 1, overflow: 'auto' }}>
              {renderTabContent()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
