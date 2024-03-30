import React, { useState } from 'react';
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

const MyImageZoomComponent = ({ src, alt = 'image' }) => {
    return (
        <Zoom>
        <img
          alt={alt}
          src={src}
          width="500"
        />
      </Zoom>
      );
    };

export default MyImageZoomComponent;
