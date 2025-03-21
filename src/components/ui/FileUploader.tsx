import React, { useCallback, useRef, useState } from 'react';
import { useStore } from '../../store/useStore';
import { 
  isValidGLTFFile, 
  createFileURL, 
  processModel,
  getFileNameWithoutExtension
} from '../../utils/modelLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

const FileUploader: React.FC = () => {
  const { setCurrentModel, setIsLoading, setError, addAvailableModel } = useStore();
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Function to load the example robot model directly
  const loadExampleRobot = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const loader = new GLTFLoader();
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
      loader.setDRACOLoader(dracoLoader);
      
      const result = await new Promise((resolve, reject) => {
        loader.load(
          'https://threejs.org/examples/models/gltf/RobotExpressive/RobotExpressive.glb',
          resolve,
          (progress) => console.log(`Loading example: ${(progress.loaded / progress.total) * 100}%`),
          reject
        );
      });
      
      console.log('Loaded example robot model:', result);
      const modelInfo = processModel(result, 'Robot Example');
      setCurrentModel(modelInfo);
    } catch (error) {
      console.error('Error loading example model:', error);
      setError(`Failed to wmple model: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  }, [setCurrentModel, setIsLoading, setError]);
  
  const handleFileProcessing = useCallback(async (file: File) => {
    try {
      // Validate file type
      if (!isValidGLTFFile(file)) {
        setError('Invalid file type. Please upload a .glb or .gltf file.');
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      // Create URL for the file
      const fileURL = createFileURL(file);
      
      // Load the model using GLTFLoader
      const loader = new GLTFLoader();
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
      loader.setDRACOLoader(dracoLoader);
      
      const result = await new Promise((resolve, reject) => {
        loader.load(
          fileURL,
          resolve,
          (progress) => console.log(`Loading: ${(progress.loaded / progress.total) * 100}%`),
          reject
        );
      });
      
      console.log('Loaded model:', result);
      
      // Process the loaded model
      const fileName = getFileNameWithoutExtension(file.name);
      const modelInfo = processModel(result, fileName);
      
      // Update the store with the loaded model
      setCurrentModel(modelInfo);
      
      // Cleanup URL
      URL.revokeObjectURL(fileURL);
    } catch (error) {
      console.error('Error loading model:', error);
      setError(`Failed to load model: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  }, [setCurrentModel, setIsLoading, setError]);
  
  // Handle file selection from input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcessing(e.target.files[0]);
    }
  };
  
  // Handle file drag events
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  // Handle file drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcessing(e.dataTransfer.files[0]);
    }
  };
  
  // Handle button click to open file dialog
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <div
      className="file-uploader"
      style={{
        padding: '20px',
        border: '2px dashed',
        borderColor: dragActive ? '#646cff' : '#555',
        borderRadius: '5px',
        textAlign: 'center',
        cursor: 'pointer',
        marginBottom: '20px',
        backgroundColor: dragActive ? 'rgba(100, 108, 255, 0.15)' : '#2a2a2a',
        transition: 'all 0.3s ease',
        color: '#eee'
      }}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={handleButtonClick}
    >
      <h3 style={{ marginTop: 0 }}>Drop your glTF Model here</h3>
      <p>or click to browse files (.glb, .gltf)</p>
      
      <input
        ref={fileInputRef}
        type="file"
        className="input-file-upload"
        style={{ display: 'none' }}
        onChange={handleFileChange}
        accept=".glb,.gltf"
      />
      
      <div className="example-section" style={{ marginTop: '20px' }} onClick={(e) => e.stopPropagation()}>
        <p style={{ marginBottom: '10px', fontSize: '0.9em', color: '#aaa' }}>
          Don't have a model? Try our example:
        </p>
        <button
          onClick={(e) => {
            e.stopPropagation();
            loadExampleRobot();
          }}
          style={{
            padding: '8px 15px',
            backgroundColor: '#4a4a4a',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#5a5a5a')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#4a4a4a')}
        >
          Load Example Robot
        </button>
        
        <div style={{ 
          fontSize: '0.8em', 
          marginTop: '15px', 
          color: '#aaa',
          padding: '10px',
          background: 'rgba(0,0,0,0.2)',
          borderRadius: '4px'
        }}>
          <p style={{ margin: '0 0 5px 0' }}>
            Example robot model by{' '}
            <a 
              href="https://www.patreon.com/quaternius" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#646cff' }}
            >
              Tomás Laulhé
            </a>,
            modifications by{' '}
            <a 
              href="https://donmccurdy.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#646cff' }}
            >
              Don McCurdy
            </a>. CC0.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FileUploader;
