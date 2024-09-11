import React, { useRef, useEffect, useState } from 'react';
import * as blazeface from '@tensorflow-models/blazeface';
import '@tensorflow/tfjs';
import '../Pages/Nav.css';

const WebcamCapture = ({ onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [faceBoundingBox, setFaceBoundingBox] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadModelAndDetectFaces = async () => {
      try {
        setIsLoading(true);
        const model = await blazeface.load();
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          detectFaces(model);
        };
      } catch (error) {
        console.error('Error loading model or video stream:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const detectFaces = async (model) => {
      const video = videoRef.current;

      const detect = async () => {
        if (video.readyState === 4) {
          const predictions = await model.estimateFaces(video, false);

          const canvas = canvasRef.current;
          if (!canvas) return; // Ensure canvas is available
          const ctx = canvas.getContext('2d');
          if (!ctx) return; // Ensure context is available

          ctx.clearRect(0, 0, canvas.width, canvas.height);

          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;

          if (predictions.length > 0) {
            const prediction = predictions[0]; // Use the first detected face

            const [x, y, width, height] = prediction.topLeft.concat(prediction.bottomRight).flat();
            ctx.strokeStyle = 'yellow';
            ctx.lineWidth = 4;
            ctx.strokeRect(x, y, width - x, height - y);

            setFaceBoundingBox({ x, y, width: width - x, height: height - y });
          }
        }

        requestAnimationFrame(detect);
      };

      detect();
    };

    loadModelAndDetectFaces();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const capture = () => {
    if (!faceBoundingBox) return; // Exit if no face is detected

    const canvas = document.createElement('canvas');
    canvas.width = faceBoundingBox.width;
    canvas.height = faceBoundingBox.height;
    const ctx = canvas.getContext('2d');
    const video = videoRef.current;

    if (!ctx) return; // Ensure context is available

    ctx.drawImage(
      video,
      faceBoundingBox.x, faceBoundingBox.y,
      faceBoundingBox.width, faceBoundingBox.height,
      0, 0,
      faceBoundingBox.width, faceBoundingBox.height
    );

    const imageSrc = canvas.toDataURL('image/png');
    onCapture(imageSrc);
  };

  return (
    <div style={{ position: 'relative', textAlign: 'center' }}>
      <video ref={videoRef} autoPlay style={{ width: '100%' }} />
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      />
      <button
        className='capture-images'
        onClick={capture}
        disabled={isLoading}
        style={{
          position: 'absolute',
          bottom: '10px',
         
          left: '50%',
          transform: 'translateX(-50%)',
      
          backgroundColor: 'blue',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        {isLoading ? 'Loading...' : 'Capture Photo'}
      </button>
    </div>
  );
};

export default WebcamCapture;
