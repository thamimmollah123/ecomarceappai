import React, { useEffect, useRef } from 'react';
import * as blazeface from '@tensorflow-models/blazeface';
import '@tensorflow/tfjs';

const FaceDetection = ({ imageSrc, onFaceDetected }) => {
  const imgRef = useRef(null);

  useEffect(() => {
    const detectFace = async () => {
      const model = await blazeface.load();
      const returnTensors = false;
      const predictions = await model.estimateFaces(imgRef.current, returnTensors);

      if (predictions.length > 0) {
        // Assuming the first face is the user's face
        const face = predictions[0];
        onFaceDetected(face);
      } else {
        alert('No face detected. Please try again.');
      }
    };

    if (imageSrc) {
      detectFace();
    }
  }, [imageSrc, onFaceDetected]);

  return <img ref={imgRef} src={imageSrc} alt="User" style={{ display: 'none' }} />;
};

export default FaceDetection;
