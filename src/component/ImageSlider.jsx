import React from 'react';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';

const ImageSlider = ({imageArray}) => {
    const images = imageArray;

    return (
        <Slide>
            {
                images.map((image,index)=>{
                    return(
                        <>
                          <div className="each-slide-effect">
                          <div style={{ 'backgroundImage': `url(${  URL.createObjectURL(images[index])} )` }}>
                          <span>Slide {index+1}</span>
                          </div>
                          </div>
                        </>
                    )
                })
            }
        </Slide>
    );
};

export default ImageSlider;