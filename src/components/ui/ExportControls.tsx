import React, { useState } from 'react';
import { useStore } from '../../store/useStore';

const ExportControls: React.FC = () => {
  const { currentModel, modelConfig } = useStore();
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
    const { position, rotation, scale, morphTargetInfluences } = modelConfig;
    const modelName = currentModel.name.replace(/\s+/g, '');
    const sanitizedModelName = modelName.replace(/[^a-zA-Z0-9_]/g, '');
    
    // Format arrays as strings
    const posStr = `[${position.map(v => v.toFixed(2)).join(', ')}]`;
    const rotStr = `[${rotation.map(v => v.toFixed(2)).join(', ')}]`;
    const scaleStr = `[${scale.map(v => v.toFixed(2)).join(', ')}]`;
    
    // Get morph target influences
    const morphTargets = morphTargetInfluences || {};
    
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
      code += `  position: [number, number, number];\n`;
      code += `  rotation: [number, number, number];\n`;
      code += `  scale: [number, number, number];\n`;
      code += `  animations: Record<string, Animation>;\n`;
      
      if (currentModel.morphTargets && currentModel.morphTargets.length > 0) {
        code += `  morphTargets: string[];\n`;
        code += `  defaultExpressions: Record<string, number>;\n`;
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
      code += `  position: ${posStr},\n`;
      code += `  rotation: ${rotStr},\n`;
      code += `  scale: ${scaleStr},\n`;
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
        
        code += `  defaultExpressions: {\n`;
        currentModel.morphTargets.forEach(target => {
          const value = morphTargets[target] || 0;
          code += `    "${target}": ${value},\n`;
        });
        code += `  },\n`;
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
      code += `  position: ${posStr},\n`;
      code += `  rotation: ${rotStr},\n`;
      code += `  scale: ${scaleStr},\n`;
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
        
        code += `  defaultExpressions: {\n`;
        currentModel.morphTargets.forEach(target => {
          const value = morphTargets[target] || 0;
          code += `    "${target}": ${value},\n`;
        });
        code += `  },\n`;
      }
      
      code += `};\n\n`;
      
      // Export statement
      code += `export { ${sanitizedModelName}Animations, ${sanitizedModelName}Data };\n`;
    }
    
    return code;
  };
  
  // Generate the Three Fiber code based on the current model and settings
  const generateThreeFiberCode = () => {
    const { position, rotation, scale, morphTargetInfluences } = modelConfig;
    const hasAnimations = currentModel.animations.length > 0;
    const hasMorphTargets = currentModel.morphTargets && currentModel.morphTargets.length > 0;
    const modelName = currentModel.name.replace(/\s+/g, '');
    const sanitizedModelName = modelName.replace(/[^a-zA-Z0-9_]/g, '');
    
    // Format arrays as strings
    const posStr = `[${position.map(v => v.toFixed(2)).join(', ')}]`;
    const rotStr = `[${rotation.map(v => v.toFixed(2)).join(', ')}]`;
    const scaleStr = `[${scale.map(v => v.toFixed(2)).join(', ')}]`;
    
    // Get active animations
    const activeAnimations = currentModel.animations
      .filter(anim => anim.isPlaying)
      .map(anim => anim.name);
    
    // Get morph target influences
    const morphTargets = morphTargetInfluences || {};
    
    // Generate imports
    let imports = '';
    if (exportType === 'tsx') {
      imports = `import React, { useRef, useEffect } from 'react';\n`;
      imports += `import { useGLTF, useAnimations } from '@react-three/drei';\n`;
      imports += `import { GroupProps, useFrame } from '@react-three/fiber';\n`;
      imports += `import * as THREE from 'three';\n`;
      imports += `import { ${sanitizedModelName}Animations, ${sanitizedModelName}Data } from './modelData';\n\n`;
    } else {
      imports = `import React, { useRef, useEffect } from 'react';\n`;
      imports += `import { useGLTF, useAnimations } from '@react-three/drei';\n`;
      imports += `import { useFrame } from '@react-three/fiber';\n`;
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
      if (activeAnimations.length > 0) {
        activeAnimations.forEach(animName => {
          const anim = currentModel.animations.find(a => a.name === animName);
          if (anim && anim.action) {
            const speed = anim.action.timeScale || 1;
            const enumName = animName.replace(/[^a-zA-Z0-9_]/g, '');
            component += `    // Play the ${animName} animation\n`;
            component += `    actions[${sanitizedModelName}Animations.${enumName}]?.reset().play();\n`;
            if (speed !== 1) {
              component += `    if (actions[${sanitizedModelName}Animations.${enumName}]) actions[${sanitizedModelName}Animations.${enumName}].timeScale = ${speed};\n`;
            }
          }
        });
      } else {
        const firstAnimName = currentModel.animations[0].name.replace(/[^a-zA-Z0-9_]/g, '');
        component += `    // Uncomment to play animations\n`;
        component += `    // actions[${sanitizedModelName}Animations.${firstAnimName}]?.reset().play();\n`;
      }
      component += `  }, [actions]);\n\n`;
    }
    
    // Add morph targets if present
    if (hasMorphTargets) {
      component += `  // Update morph targets/expressions\n`;
      component += `  useEffect(() => {\n`;
      component += `    if (group.current) {\n`;
      component += `      const model = group.current.children[0];\n`;
      component += `      if (model && model.morphTargetInfluences) {\n`;
      
      // Add code to set morph target influences
      currentModel.morphTargets?.forEach((targetName, index) => {
        const value = morphTargets[targetName] || 0;
        if (value > 0) {
          component += `        // Set ${targetName} expression\n`;
          component += `        model.morphTargetDictionary && model.morphTargetDictionary["${targetName}"] !== undefined && \n`;
          component += `          (model.morphTargetInfluences[model.morphTargetDictionary["${targetName}"]] = ${sanitizedModelName}Data.defaultExpressions["${targetName}"]);\n`;
        }
      });
      
      component += `      }\n`;
      component += `    }\n`;
      component += `  }, []);\n\n`;
    }
    
    // Add return statement
    component += `  return (\n`;
    component += `    <group ref={group} {...props} dispose={null}\n`;
    component += `      position={${sanitizedModelName}Data.position}\n`;
    component += `      rotation={${sanitizedModelName}Data.rotation}\n`;
    component += `      scale={${sanitizedModelName}Data.scale}}>\n`;
    
    // Add placeholder for mesh components
    component += `      {/* Model meshes will be generated here */}\n`;
    component += `      <mesh\n`;
    component += `        name="ExampleMesh"\n`;
    component += `        castShadow\n`;
    component += `        receiveShadow\n`;
    component += `        geometry={nodes.ExampleMesh?.geometry}\n`;
    component += `        material={materials.ExampleMaterial}\n`;
    component += `      />\n`;
    
    component += `    </group>\n`;
    component += `  );\n`;
    component += `}\n\n`;
    
    // Add preload for GLTF
    component += `// Preload the model\n`;
    component += `useGLTF.preload(${sanitizedModelName}Data.modelPath);\n`;
    
    return imports + component;
  };
  
  const handleCopyCode = (codeType: 'modelData' | 'component') => {
    const code = codeType === 'modelData' ? generateModelDataStructure() : generateThreeFiberCode();
    navigator.clipboard.writeText(code)
      .then(() => {
        setShowCopiedMessage(true);
        setTimeout(() => setShowCopiedMessage(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy code:', err);
      });
  };
  
  return (
    <div style={{ 
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
        <h3 style={{ marginTop: 0, color: '#fff' }}>Export to React Three Fiber</h3>
        
        <div style={{ marginBottom: '15px' }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="radio"
                name="exportType"
                value="tsx"
                checked={exportType === 'tsx'}
                onChange={() => setExportType('tsx')}
                style={{ marginRight: '5px' }}
              />
              TypeScript (TSX)
            </label>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="radio"
                name="exportType"
                value="js"
                checked={exportType === 'js'}
                onChange={() => setExportType('js')}
                style={{ marginRight: '5px' }}
              />
              JavaScript (JS)
            </label>
          </div>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={() => handleCopyCode('modelData')}
              style={{
                padding: '8px 12px',
                background: '#646cff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                flex: 1
              }}
            >
              {showCopiedMessage ? 'Copied!' : 'Copy Model Data'}
            </button>
            
            <button 
              onClick={() => handleCopyCode('component')}
              style={{
                padding: '8px 12px',
                background: '#646cff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                flex: 1
              }}
            >
              {showCopiedMessage ? 'Copied!' : 'Copy Component Code'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Tabs for model data and component code */}
      <div style={{ 
        display: 'flex', 
        borderBottom: '1px solid #444',
        background: '#2a2a2a',
      }}>
        <button
          onClick={() => setActiveTab('modelData')}
          style={{
            flex: 1,
            padding: '8px 12px',
            background: activeTab === 'modelData' ? '#3a3a3a' : 'transparent',
            border: 'none',
            borderBottom: activeTab === 'modelData' ? '2px solid #646cff' : 'none',
            cursor: 'pointer',
            color: '#fff',
          }}
        >
          Model Data
        </button>
        <button
          onClick={() => setActiveTab('component')}
          style={{
            flex: 1,
            padding: '8px 12px',
            background: activeTab === 'component' ? '#3a3a3a' : 'transparent',
            border: 'none',
            borderBottom: activeTab === 'component' ? '2px solid #646cff' : 'none',
            cursor: 'pointer',
            color: '#fff',
          }}
        >
          Component Code
        </button>
      </div>
      
      {/* Scrollable preview */}
      <div style={{ 
        overflowY: 'auto',
        padding: '10px',
        flex: 1,
        background: '#1e1e1e',
        fontFamily: 'monospace',
        fontSize: '14px',
        whiteSpace: 'pre-wrap',
        borderRadius: '4px'
      }}>
        <pre style={{ margin: 0 }}>
          {activeTab === 'modelData' ? generateModelDataStructure() : generateThreeFiberCode()}
        </pre>
      </div>
    </div>
  );
};

export default ExportControls;
