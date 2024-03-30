import { Button } from "@mui/material";
import React, { Component } from "react";

import {
    TransformWrapper,
    TransformComponent,
    useControls,
  } from "react-zoom-pan-pinch";

const Controls = () => {
  const { zoomIn, zoomOut, resetTransform } = useControls();

  return (
    <div className="tools" style={{display:'flex',flexDirection:"row",gap:"5px"}}>
      <Button variant="outlined" onClick={() => zoomIn()}>Zoom In</Button>
      <Button variant="outlined" onClick={() => zoomOut()}>Zoom Out</Button>
      <Button variant="outlined" onClick={() => resetTransform()}>Reset</Button>
    </div>
  );
};

const ZoomPinch = ({src}) => {
    const transformOptions = {
        initialScale: 1,
        minScale: 0.5,
        maxScale: 8,
        scalePadding: 2 
      }
  return (
    <TransformWrapper
    initialScale={1}
      initialPositionX={0}
      initialPositionY={0}
    //   options={transformOptions}
    >
      {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
        <>
          <Controls />
          <TransformComponent>
            <img src={src} alt="test" height={window.innerHeight * 0.7}/>
          </TransformComponent>
        </>
      )}
    </TransformWrapper>
  );
};

export default ZoomPinch;