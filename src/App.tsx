import { useState } from 'react';
import './App.css';
import Scene from './components/three/Scene';
import FileUploader from './components/ui/FileUploader';
import AnimationControls from './components/ui/AnimationControls';
import ModelConfig from './components/ui/ModelConfig';
import SceneSettings from './components/ui/SceneSettings';
import ModelInfo from './components/ui/ModelInfo';
import ExpressionControls from './components/ui/ExpressionControls';
import ExportControls from './components/ui/ExportControls';
import { useStore } from './store/useStore';

function App() {
  const { currentModel, isLoading, error } = useStore();
  const [sidebarTab, setSidebarTab] = useState<'animations' | 'expressions' | 'model' | 'settings' | 'export'>('animations');

  // Helper function to render the active sidebar tab content
  const renderTabContent = () => {
    switch (sidebarTab) {
      case 'animations':
        return <AnimationControls />;
      case 'expressions':
        return <ExpressionControls />;
      case 'settings':
        return <SceneSettings />;
      case 'model':
        return <ModelConfig />;
      case 'export':
        return <ExportControls />;
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
            borderLeft: '1px solid #333',
            display: 'flex',
            flexDirection: 'column',
            background: '#2a2a2a',
            color: '#eee',
            overflow: 'hidden',
            width: '350px'
          }} className="sidebar-container">
            {/* Model Info - Always at the top */}
            <div className="model-info">
              <ModelInfo />
            </div>
            
            {/* Tabs Container */}
            <div className="sidebar-tabs">
              {/* Top section - Tabs above the active one */}
              <div className="sidebar-top-section">
                {/* Only show tabs that should appear above the current active tab */}
                {sidebarTab === 'animations' && null}
                
                {sidebarTab === 'expressions' && (
                  <button
                    onClick={() => setSidebarTab('animations')}
                    className="sidebar-tab"
                  >
                    <span className="sidebar-tab-icon">🎬</span>
                    Animations
                    <span className="sidebar-tab-expand-icon">▼</span>
                  </button>
                )}
                
                {sidebarTab === 'model' && (
                  <>
                    <button
                      onClick={() => setSidebarTab('animations')}
                      className="sidebar-tab"
                    >
                      <span className="sidebar-tab-icon">🎬</span>
                      Animations
                      <span className="sidebar-tab-expand-icon">▼</span>
                    </button>
                    <button
                      onClick={() => setSidebarTab('expressions')}
                      className="sidebar-tab"
                    >
                      <span className="sidebar-tab-icon">😀</span>
                      Expressions
                      <span className="sidebar-tab-expand-icon">▼</span>
                    </button>
                  </>
                )}
                
                {sidebarTab === 'settings' && (
                  <>
                    <button
                      onClick={() => setSidebarTab('animations')}
                      className="sidebar-tab"
                    >
                      <span className="sidebar-tab-icon">🎬</span>
                      Animations
                      <span className="sidebar-tab-expand-icon">▼</span>
                    </button>
                    <button
                      onClick={() => setSidebarTab('expressions')}
                      className="sidebar-tab"
                    >
                      <span className="sidebar-tab-icon">😀</span>
                      Expressions
                      <span className="sidebar-tab-expand-icon">▼</span>
                    </button>
                    <button
                      onClick={() => setSidebarTab('model')}
                      className="sidebar-tab"
                    >
                      <span className="sidebar-tab-icon">📐</span>
                      Model
                      <span className="sidebar-tab-expand-icon">▼</span>
                    </button>
                  </>
                )}
                
                {sidebarTab === 'export' && (
                  <>
                    <button
                      onClick={() => setSidebarTab('animations')}
                      className="sidebar-tab"
                    >
                      <span className="sidebar-tab-icon">🎬</span>
                      Animations
                      <span className="sidebar-tab-expand-icon">▼</span>
                    </button>
                    <button
                      onClick={() => setSidebarTab('expressions')}
                      className="sidebar-tab"
                    >
                      <span className="sidebar-tab-icon">😀</span>
                      Expressions
                      <span className="sidebar-tab-expand-icon">▼</span>
                    </button>
                    <button
                      onClick={() => setSidebarTab('model')}
                      className="sidebar-tab"
                    >
                      <span className="sidebar-tab-icon">📐</span>
                      Model
                      <span className="sidebar-tab-expand-icon">▼</span>
                    </button>
                    <button
                      onClick={() => setSidebarTab('settings')}
                      className="sidebar-tab"
                    >
                      <span className="sidebar-tab-icon">🌐</span>
                      Scene
                      <span className="sidebar-tab-expand-icon">▼</span>
                    </button>
                  </>
                )}
              </div>
              
              {/* Middle section - Active tab */}
              <div className="sidebar-middle-section">
                {/* Active Tab Header */}
                {sidebarTab === 'animations' && (
                  <button className="sidebar-tab active">
                    <span className="sidebar-tab-icon">🎬</span>
                    Animations
                    <span className="sidebar-tab-expand-icon">▼</span>
                  </button>
                )}
                {sidebarTab === 'expressions' && (
                  <button className="sidebar-tab active">
                    <span className="sidebar-tab-icon">😀</span>
                    Expressions
                    <span className="sidebar-tab-expand-icon">▼</span>
                  </button>
                )}
                {sidebarTab === 'model' && (
                  <button className="sidebar-tab active">
                    <span className="sidebar-tab-icon">📐</span>
                    Model
                    <span className="sidebar-tab-expand-icon">▼</span>
                  </button>
                )}
                {sidebarTab === 'settings' && (
                  <button className="sidebar-tab active">
                    <span className="sidebar-tab-icon">🌐</span>
                    Scene
                    <span className="sidebar-tab-expand-icon">▼</span>
                  </button>
                )}
                {sidebarTab === 'export' && (
                  <button className="sidebar-tab active">
                    <span className="sidebar-tab-icon">⬇️</span>
                    Export
                    <span className="sidebar-tab-expand-icon">▼</span>
                  </button>
                )}
                
                {/* Active Tab Content */}
                <div className="sidebar-tab-content active">
                  {renderTabContent()}
                </div>
              </div>
              
              {/* Bottom section - Tabs below the active one */}
              <div className="sidebar-bottom-section">
                {/* Only show tabs that should appear below the current active tab */}
                {sidebarTab === 'animations' && (
                  <>
                    <button
                      onClick={() => setSidebarTab('expressions')}
                      className="sidebar-tab"
                    >
                      <span className="sidebar-tab-icon">😀</span>
                      Expressions
                      <span className="sidebar-tab-expand-icon">▼</span>
                    </button>
                    <button
                      onClick={() => setSidebarTab('model')}
                      className="sidebar-tab"
                    >
                      <span className="sidebar-tab-icon">📐</span>
                      Model
                      <span className="sidebar-tab-expand-icon">▼</span>
                    </button>
                    <button
                      onClick={() => setSidebarTab('settings')}
                      className="sidebar-tab"
                    >
                      <span className="sidebar-tab-icon">🌐</span>
                      Scene
                      <span className="sidebar-tab-expand-icon">▼</span>
                    </button>
                    <button
                      onClick={() => setSidebarTab('export')}
                      className="sidebar-tab"
                    >
                      <span className="sidebar-tab-icon">⬇️</span>
                      Export
                      <span className="sidebar-tab-expand-icon">▼</span>
                    </button>
                  </>
                )}
                
                {sidebarTab === 'expressions' && (
                  <>
                    <button
                      onClick={() => setSidebarTab('model')}
                      className="sidebar-tab"
                    >
                      <span className="sidebar-tab-icon">📐</span>
                      Model
                      <span className="sidebar-tab-expand-icon">▼</span>
                    </button>
                    <button
                      onClick={() => setSidebarTab('settings')}
                      className="sidebar-tab"
                    >
                      <span className="sidebar-tab-icon">🌐</span>
                      Scene
                      <span className="sidebar-tab-expand-icon">▼</span>
                    </button>
                    <button
                      onClick={() => setSidebarTab('export')}
                      className="sidebar-tab"
                    >
                      <span className="sidebar-tab-icon">⬇️</span>
                      Export
                      <span className="sidebar-tab-expand-icon">▼</span>
                    </button>
                  </>
                )}
                
                {sidebarTab === 'model' && (
                  <>
                    <button
                      onClick={() => setSidebarTab('settings')}
                      className="sidebar-tab"
                    >
                      <span className="sidebar-tab-icon">🌐</span>
                      Scene
                      <span className="sidebar-tab-expand-icon">▼</span>
                    </button>
                    <button
                      onClick={() => setSidebarTab('export')}
                      className="sidebar-tab"
                    >
                      <span className="sidebar-tab-icon">⬇️</span>
                      Export
                      <span className="sidebar-tab-expand-icon">▼</span>
                    </button>
                  </>
                )}
                
                {sidebarTab === 'settings' && (
                  <button
                    onClick={() => setSidebarTab('export')}
                    className="sidebar-tab"
                  >
                    <span className="sidebar-tab-icon">⬇️</span>
                    Export
                    <span className="sidebar-tab-expand-icon">▼</span>
                  </button>
                )}
                
                {sidebarTab === 'export' && null}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
