import React, { useRef, useState, useEffect } from 'react';
import '@google/model-viewer';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

const Ring = () => {
  const geometry = new THREE.RingGeometry(1, 5, 32);
  const material = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide });
  return <mesh geometry={geometry} material={material} />;
};

const ARModelWithRing = ({ mainModelSrc }) => {
  const modelViewerRef = useRef(null);
  const [isARMode, setIsARMode] = useState(false); // Track if in AR mode
  const [ringVisible, setRingVisible] = useState(false); // Manage ring visibility

  const handleARReady = () => {
    setIsARMode(true);
    setRingVisible(true); // Show the ring when AR is ready
  };

  const handleRingClick = () => {
    // Place the main model at the ring's position
    if (modelViewerRef.current) {
      modelViewerRef.current.setAttribute('reveal', 'interaction'); // Allow placement of main model
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      {/* Model Viewer for Main Model */}
      <model-viewer
        ref={modelViewerRef}
        src={isARMode ? null : mainModelSrc} // Use main model when not in AR
        alt="Main Model"
        auto-rotate
        camera-controls
        ar
        ar-modes="webxr scene-viewer quick-look"
        style={{ width: '100%', height: '100%' }}
        onARReady={handleARReady} // Trigger when AR is ready
      >
        <button slot="ar-button" style={customButtonStyle}>
          View in AR
        </button>
        <div slot="ar-status" style={statusStyle}>
          Move your phone around to find a flat surface.
        </div>
      </model-viewer>

      {/* Render Ring in AR */}
      {isARMode && ringVisible && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} onClick={handleRingClick}>
          <Canvas>
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <Ring />
            <OrbitControls />
          </Canvas>
        </div>
      )}
    </div>
  );
};

// Custom styles for button and status message
const customButtonStyle = {
  backgroundColor: '#fff',
  border: '1px solid #000',
  borderRadius: '5px',
  padding: '10px',
  position: 'absolute',
  top: '20px',
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 10,
};

const statusStyle = {
  position: 'absolute',
  top: '60px',
  left: '50%',
  transform: 'translateX(-50%)',
  color: '#000',
};

export default ARModelWithRing;
