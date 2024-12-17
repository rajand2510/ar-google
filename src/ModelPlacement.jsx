import React, { useRef, useState } from "react";
import "@google/model-viewer";

const ModelPlacement = ({ modelUrl }) => {
  const modelViewerRef = useRef(null);
  const [isPlaced, setIsPlaced] = useState(false);
  const [scale, setScale] = useState(1); // Default scale

  // Handle placement tap in AR mode
  const handleARPlacement = (event) => {
    const modelViewer = modelViewerRef.current;

    if (modelViewer && modelViewer.ar) {
      const hitTest = event.detail?.hitTestResults?.[0];
      if (hitTest) {
        const { x, y, z } = hitTest.transform.position;

        // Place the model at the hit-test position
        modelViewer.model.setAttribute("position", `${x} ${y} ${z}`);
        
        // Apply scale after placement
        modelViewer.model.setAttribute("scale", `${scale} ${scale} ${scale}`);
        
        setIsPlaced(true);
      }
    }
  };

  // Functions to increase or decrease scale
  const increaseScale = () => {
    setScale(prevScale => prevScale + 0.1); // Increase by 0.1
  };

  const decreaseScale = () => {
    setScale(prevScale => Math.max(prevScale - 0.1, 0.1)); // Decrease by 0.1 (avoid going below 0.1)
  };

  return (
    <div style={{ width: "100%", height: "90%" }}>
      {/* Model Viewer */}
      <model-viewer
        ref={modelViewerRef}
        src={modelUrl}
        ar
        ar-hit-test
        camera-controls
        style={{ width: "100%", height: "100%" }}
        onArHitTest={handleARPlacement} // For AR mode placement
      >
        {/* Scale Controls */}
      {isPlaced && (
        <div style={{ position: "absolute", bottom: "10px", left: "10px", color: "white" }}>
          <button onClick={increaseScale} style={{ marginRight: "10px" }}>Increase Scale</button>
          <button onClick={decreaseScale}>Decrease Scale</button>
        </div>
      )}
      </model-viewer>

      
    </div>
  );
};

export default ModelPlacement;
