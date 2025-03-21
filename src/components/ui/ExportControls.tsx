import React, { useState } from 'react';
import { useStore } from '../../store/useStore';

const ExportControls: React.FC = () => {
  const { currentModel } = useStore();
  const [exportType, setExportType] = useState<'tsx' | 'js'>('tsx');
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);
  const [activeTab, setActiveTab] = useState('modelData');
  
  if (!currentModel) {
    return (
      <div style={{ padding: '20px' }}>
        <p>Load a model to export it.</p>
      </div>
    );
  }
  
  // Generate model data structure/enum
  const generateModelDataStructure = () => {
    const modelName = currentModel.name.replace(/\s+/g, '');
    const sanitizedModelName = modelName.replace(/[^a-zA-Z0-9_]/g, '');
    
    let code = '';
    
    if (exportType === 'tsx') {
      // TypeScript interface for animation data
      code += `// Animation and model data for ${currentModel.name}\n\n`;
      
      // Animation interface
      code += `interface Animation {\n`;
      code += `  name: string;\n`;
      code += `  duration: number;\n`;
      code += `}\n\n`;
      
      // Model data interface
      code += `interface ModelData {\n`;
      code += `  modelPath: string;\n`;
      code += `  animations: Record<string, Animation>;\n`;
      
      if (currentModel.morphTargets && currentModel.morphTargets.length > 0) {
        code += `  morphTargets: string[];\n`;
      }
      
      code += `}\n\n`;
      
      // Create enum for animation names
      code += `// Enum for animation names\n`;
      code += `enum ${sanitizedModelName}Animations {\n`;
      currentModel.animations.forEach(anim => {
        const enumName = anim.name.replace(/[^a-zA-Z0-9_]/g, '');
        code += `  ${enumName} = "${anim.name}",\n`;
      });
      code += `}\n\n`;
      
      // Create the model data object
      code += `// Complete model data\n`;
      code += `const ${sanitizedModelName}Data: ModelData = {\n`;
      code += `  modelPath: "/path/to/${modelName}.glb",\n`;
      code += `  animations: {\n`;
      
      // Add all animations
      currentModel.animations.forEach(anim => {
        const enumRef = `${sanitizedModelName}Animations.${anim.name.replace(/[^a-zA-Z0-9_]/g, '')}`;
        code += `    [${enumRef}]: {\n`;
        code += `      name: ${enumRef},\n`;
        code += `      duration: ${anim.duration.toFixed(2)},\n`;
        code += `    },\n`;
      });
      
      code += `  },\n`;
      
      // Add morph targets if present
      if (currentModel.morphTargets && currentModel.morphTargets.length > 0) {
        code += `  morphTargets: [\n`;
        currentModel.morphTargets.forEach(target => {
          code += `    "${target}",\n`;
        });
        code += `  ],\n`;
      }
      
      code += `};\n\n`;
      
      // Export statement
      code += `export { ${sanitizedModelName}Animations, ${sanitizedModelName}Data };\n`;
      
    } else {
      // JavaScript version
      code += `// Animation and model data for ${currentModel.name}\n\n`;
      
      // Create object for animation names
      code += `// Animation name constants\n`;
      code += `const ${sanitizedModelName}Animations = {\n`;
      currentModel.animations.forEach(anim => {
        const enumName = anim.name.replace(/[^a-zA-Z0-9_]/g, '');
        code += `  ${enumName}: "${anim.name}",\n`;
      });
      code += `};\n\n`;
      
      // Create the model data object
      code += `// Complete model data\n`;
      code += `const ${sanitizedModelName}Data = {\n`;
      code += `  modelPath: "/path/to/${modelName}.glb",\n`;
      code += `  animations: {\n`;
      
      // Add all animations
      currentModel.animations.forEach(anim => {
        const enumRef = `${sanitizedModelName}Animations.${anim.name.replace(/[^a-zA-Z0-9_]/g, '')}`;
        code += `    [${enumRef}]: {\n`;
        code += `      name: ${enumRef},\n`;
        code += `      duration: ${anim.duration.toFixed(2)},\n`;
        code += `    },\n`;
      });
      
      code += `  },\n`;
      
      // Add morph targets if present
      if (currentModel.morphTargets && currentModel.morphTargets.length > 0) {
        code += `  morphTargets: [\n`;
        currentModel.morphTargets.forEach(target => {
          code += `    "${target}",\n`;
        });
        code += `  ],\n`;
      }
      
      code += `};\n\n`;
      
      // Export statement
      code += `export { ${sanitizedModelName}Animations, ${sanitizedModelName}Data };\n`;
    }
    
    return code;
  };
  
  // Generate the Three Fiber code based on the current model and settings
  const generateThreeFiberCode = () => {
    const hasAnimations = currentModel.animations.length > 0;
    const hasMorphTargets = currentModel.morphTargets && currentModel.morphTargets.length > 0;
    const modelName = currentModel.name.replace(/\s+/g, '');
    const sanitizedModelName = modelName.replace(/[^a-zA-Z0-9_]/g, '');
    
    // Generate imports
    let imports = '';
    if (exportType === 'tsx') {
      imports = `import React, { useRef, useEffect } from 'react';\n`;
      imports += `import { useGLTF, useAnimations } from '@react-three/drei';\n`;
      imports += `import { GroupProps } from '@react-three/fiber';\n`;
      imports += `import * as THREE from 'three';\n`;
      imports += `import { ${sanitizedModelName}Animations, ${sanitizedModelName}Data } from './modelData';\n\n`;
    } else {
      imports = `import React, { useRef, useEffect } from 'react';\n`;
      imports += `import { useGLTF, useAnimations } from '@react-three/drei';\n`;
      imports += `import * as THREE from 'three';\n`;
      imports += `import { ${sanitizedModelName}Animations, ${sanitizedModelName}Data } from './modelData';\n\n`;
    }
    
    // Generate component
    let component = '';
    if (exportType === 'tsx') {
      component = `export function Model(props: GroupProps) {\n`;
    } else {
      component = `export function Model(props) {\n`;
    }
    
    // Add refs
    component += `  const group = useRef();\n`;
    
    // Add GLTF loading
    component += `  const { nodes, materials, animations } = useGLTF(${sanitizedModelName}Data.modelPath);\n`;
    
    // Add animations if present
    if (hasAnimations) {
      component += `  const { actions } = useAnimations(animations, group);\n\n`;
      
      // Add useEffect for animations
      component += `  useEffect(() => {\n`;
      component += `    // Example of playing an animation\n`;
      const firstAnimName = currentModel.animations[0].name.replace(/[^a-zA-Z0-9_]/g, '');
      component += `    // Uncomment to play an animation:\n`;
      component += `    // actions[${sanitizedModelName}Animations.${firstAnimName}]?.reset().play();\n`;
      
      // List all available animations in comments
      component += `    \n    // Available animations:\n`;
      currentModel.animations.forEach(anim => {
        const enumName = anim.name.replace(/[^a-zA-Z0-9_]/g, '');
        component += `    // - actions[${sanitizedModelName}Animations.${enumName}]?.reset().play();\n`;
      });
      
      component += `  }, [actions]);\n\n`;
    }
    
    // Add morph targets if present
    if (hasMorphTargets && currentModel.morphTargets) {
      component += `  // Example of setting morph targets/expressions\n`;
      component += `  useEffect(() => {\n`;
      component += `    if (group.current) {\n`;
      component += `      const model = group.current.children[0];\n`;
      component += `      if (model && model.morphTargetInfluences && model.morphTargetDictionary) {\n`;
      
      // List all available morph targets in comments
      component += `        // Available expressions/morph targets:\n`;
      currentModel.morphTargets.forEach(target => {
        component += `        // model.morphTargetInfluences[model.morphTargetDictionary["${target}"]] = 0.5; // 0-1 range\n`;
      });
      
      component += `      }\n`;
      component += `    }\n`;
      component += `  }, []);\n\n`;
    }
    
    // Add return statement
    component += `  return (\n`;
    component += `    <group ref={group} {...props} dispose={null}>\n`;
    
    // Create placeholder for model content
    component += `      {/* Model structure will be here */}\n`;
    component += `      {/* This is a simplified placeholder - the actual structure depends on your model */}\n`;
    
    component += `    </group>\n`;
    component += `  );\n`;
    component += `}\n\n`;
    
    // Add useGLTF preload
    component += `// Preload the model\n`;
    component += `useGLTF.preload(${sanitizedModelName}Data.modelPath);\n`;
    
    return imports + component;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setShowCopiedMessage(true);
        setTimeout(() => setShowCopiedMessage(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  const code = activeTab === 'modelData' ? generateModelDataStructure() : generateThreeFiberCode();

  return (
    <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ marginBottom: '15px' }}>
        <h3 style={{ marginTop: 0 }}>Export to React Three Fiber</h3>
        <p style={{ fontSize: '0.9rem', marginBottom: '15px', lineHeight: '1.4' }}>
          Export your model as structured code for React Three Fiber. This generates clean code that's ready to use
          in your React applications, with properly named animations and expressions.
        </p>
        
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Format:</label>
            <div style={{ display: 'flex', gap: '5px' }}>
              <button
                onClick={() => setExportType('tsx')}
                style={{
                  padding: '5px 10px',
                  background: exportType === 'tsx' ? '#4a90e2' : '#3a3a3a',
                  border: 'none',
                  borderRadius: '4px',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                TypeScript
              </button>
              <button
                onClick={() => setExportType('js')}
                style={{
                  padding: '5px 10px',
                  background: exportType === 'js' ? '#4a90e2' : '#3a3a3a',
                  border: 'none',
                  borderRadius: '4px',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                JavaScript
              </button>
            </div>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
          <button
            onClick={() => setActiveTab('modelData')}
            style={{
              padding: '5px 10px',
              background: activeTab === 'modelData' ? '#4a90e2' : '#3a3a3a',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            Model Data
          </button>
          <button
            onClick={() => setActiveTab('componentCode')}
            style={{
              padding: '5px 10px',
              background: activeTab === 'componentCode' ? '#4a90e2' : '#3a3a3a',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            Component Code
          </button>
        </div>
      </div>
      
      <div style={{ 
        flex: 1, 
        padding: '10px', 
        backgroundColor: '#1e1e1e', 
        borderRadius: '4px',
        position: 'relative',
        overflow: 'auto'
      }}>
        <pre style={{ 
          margin: 0, 
          fontFamily: 'monospace', 
          fontSize: '13px',
          lineHeight: '1.4',
          color: '#d4d4d4',
          whiteSpace: 'pre-wrap'
        }}>
          {code}
        </pre>
        
        <button
          onClick={() => copyToClipboard(code)}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            padding: '5px 10px',
            background: '#3a3a3a',
            border: 'none',
            borderRadius: '4px',
            color: 'white',
            cursor: 'pointer',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}
        >
          {showCopiedMessage ? 'Copied! ✓' : 'Copy'}
        </button>
      </div>
    </div>
  );
};

export default ExportControls;
