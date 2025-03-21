import React from 'react';

const InfoControls: React.FC = () => {
  return (
    <div className="info-controls" style={{ padding: '15px', height: '100%', overflowY: 'auto' }}>
      

      <section style={{ marginBottom: '20px' }}>
        <h4 style={{ marginBottom: '10px' }}>Why Use This Explorer?</h4>
        <p style={{ lineHeight: '1.5', marginBottom: '12px' }}>
          A 3D character or object explorer must see all the animations, facial expressions, and props 
          the model creator has exposed. This tool helps you discover everything a model can do before
          integrating it into your project.
        </p>
        <p style={{ lineHeight: '1.5' }}>
          After exploring the model and experiencing its animations, you can export structured code for 
          common libraries like Three.js and React Three Fiber, making implementation much easier.
        </p>
      </section>

      <section style={{ marginBottom: '20px' }}>
        <h4 style={{ marginBottom: '10px' }}>How to Use</h4>
        <ol style={{ margin: '0 0 0 16px', padding: 0 }}>
          <li style={{ marginBottom: '12px', lineHeight: '1.5' }}>
            <b>Upload a Model</b> - Drag and drop or use the file uploader to import your glTF (.glb, .gltf) model
          </li>
          <li style={{ marginBottom: '12px', lineHeight: '1.5' }}>
            <b>Explore Animations</b> - In the Animations tab, play, pause and adjust speed of available animations
          </li>
          <li style={{ marginBottom: '12px', lineHeight: '1.5' }}>
            <b>Control Expressions</b> - If available, adjust facial expressions/morph targets in the Expressions tab
          </li>
          <li style={{ marginBottom: '12px', lineHeight: '1.5' }}>
            <b>Configure Model</b> - Adjust position, rotation, and scale to better view the model
          </li>
          <li style={{ marginBottom: '12px', lineHeight: '1.5' }}>
            <b>Adjust Scene</b> - Configure lighting and background for better visualization
          </li>
          <li style={{ marginBottom: '12px', lineHeight: '1.5' }}>
            <b>Export</b> - Generate clean React Three Fiber code structures in the Export tab.
            The exported code provides well-organized animation names, morph targets, and model data
            to help developers integrate the character without hassle. No specific view settings are
            included - just the essential model structure for easy implementation.
          </li>
        </ol>
      </section>

      <section>
        <h4 style={{ marginBottom: '10px' }}>About This Project</h4>
        <p style={{ lineHeight: '1.5', marginBottom: '12px' }}>
          The glTF Animation Explorer was built using <b>Vibe coding</b> methodology, 
          focusing on user experience and developer ergonomics with a vibrant, interactive UI.
        </p>
        <p style={{ lineHeight: '1.5', marginBottom: '12px' }}>
          Developed in <b>Windsurf</b>, the world's first agentic IDE, which enhances 
          the development workflow through AI-powered assistance and code generation.
        </p>
        <p style={{ lineHeight: '1.5' }}>
          {String.fromCharCode(169)} {new Date().getFullYear()} | <a 
            href="https://github.com/dannyshmueli/glTF-explorer" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ color: '#61dafb', textDecoration: 'none' }}
          >
            GitHub Repository
          </a>
        </p>
      </section>
    </div>
  );
};

export default InfoControls;
