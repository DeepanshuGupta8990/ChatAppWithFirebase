import React, { useRef, useState } from "react";
import { ReactSketchCanvas } from "react-sketch-canvas";

export default function Sketch() {
  const canvasRef = useRef(null);
  const [eraseMode, setEraseMode] = useState(false);
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [canvasColor, setCanvasColor] = useState("#ffffff");
  const [imageUrl, setImageUrl] = useState('');
  const [backgroundImage,setbackgroundImage] = useState("");

  const handleExportImage = () => {
    if (canvasRef.current) {
        canvasRef.current
        .exportImage("png")
        .then(data => {
          console.log(data);
        })
        .catch(e => {
          console.log(e);
        });
    }
  };


  const handleEraserClick = () => {
    setEraseMode(true);
    canvasRef.current?.eraseMode(true);
  };

  const handlePenClick = () => {
    setEraseMode(false);
    canvasRef.current?.eraseMode(false);
  };

  const handleUndoClick = () => {
    canvasRef.current?.undo();
  };

  const handleRedoClick = () => {
    canvasRef.current?.redo();
  };

  const handleClearClick = () => {
    canvasRef.current?.clearCanvas();
  };

  const handleResetClick = () => {
    canvasRef.current?.resetCanvas();
  };

  const handleStrokeColorChange = (event) => {
    setStrokeColor(event.target.value);
  };

  const handleCanvasColorChange = (event) => {
    setCanvasColor(event.target.value);
  };

  const handleImageUrlChange = (event) => {
    setImageUrl(event.target.value);
  };

  const handleLoadImage = () => {
    if (imageUrl && canvasRef.current) {
        setbackgroundImage(imageUrl)
    }
  };

  return (
    <div className="d-flex flex-column gap-2 p-2">
      <h1>Tools</h1>
      <div className="d-flex gap-2 align-items-center ">
        <button
          type="button"
          className="btn btn-sm btn-outline-primary"
          disabled={!eraseMode}
          onClick={handlePenClick}
        >
          Pen
        </button>
        <button
          type="button"
          className="btn btn-sm btn-outline-primary"
          disabled={eraseMode}
          onClick={handleEraserClick}
        >
          Eraser
        </button>
        <div className="vr" />
        <button
          type="button"
          className="btn btn-sm btn-outline-primary"
          onClick={handleUndoClick}
        >
          Undo
        </button>
        <button
          type="button"
          className="btn btn-sm btn-outline-primary"
          onClick={handleRedoClick}
        >
          Redo
        </button>
        <button
          type="button"
          className="btn btn-sm btn-outline-primary"
          onClick={handleClearClick}
        >
          Clear
        </button>
        <button
          type="button"
          className="btn btn-sm btn-outline-primary"
          onClick={handleResetClick}
        >
          Reset
        </button>
        <label htmlFor="color">Stroke color</label>
        <input
          type="color"
          value={strokeColor}
          onChange={handleStrokeColorChange}
        />
        <label htmlFor="color">Canvas color</label>
        <input
          type="color"
          value={canvasColor}
          onChange={handleCanvasColorChange}
        />
        <input
          type="text"
          placeholder="Enter image URL"
          value={imageUrl}
          onChange={handleImageUrlChange}
        />
        <button onClick={handleLoadImage}>Load Image</button>
        <button onClick={handleExportImage}>Get Image</button>

      </div>
      <h1>Canvas</h1>
      <ReactSketchCanvas
        ref={canvasRef}
        strokeColor={strokeColor}
        canvasColor={canvasColor}
        backgroundImage={backgroundImage}
        preserveBackgroundImageAspectRatio={'xMinYMin'}
        style={{width:"300px",}}
      />
    </div>
  );
}
