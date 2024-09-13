import React, { useRef, useEffect, useState } from 'react';
import * as blazeface from '@tensorflow-models/blazeface';
import '@tensorflow/tfjs';
import '../Pages/Nav.css';

const WebcamCapture = ({ onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [faceBoundingBox, setFaceBoundingBox] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(false); // New state for camera toggle

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
          if (!canvas) return;
          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          ctx.clearRect(0, 0, canvas.width, canvas.height);

          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;

          if (predictions.length > 0) {
            const prediction = predictions[0];
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

    if (isCameraOn) {
      loadModelAndDetectFaces();
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    }

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isCameraOn]); // Re-run effect when camera is toggled

  const capture = () => {
    if (!faceBoundingBox) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    const scaleFactor = 0.5; // Scale down the size of the final image
    canvas.width = faceBoundingBox.width * scaleFactor;
    canvas.height = faceBoundingBox.height * scaleFactor;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(
      video,
      faceBoundingBox.x, faceBoundingBox.y,
      faceBoundingBox.width, faceBoundingBox.height,
      0, 0,
      canvas.width, canvas.height
    );

    const imageSrc = canvas.toDataURL('image/png');
    onCapture(imageSrc);
  };

  const toggleCamera = () => {
    setIsCameraOn((prev) => !prev); // Toggle camera on/off
  };

  return (
    <div style={{ position: 'relative', textAlign: 'center' }}>
      {isCameraOn ? (
        <video
          ref={videoRef}
          autoPlay
          style={{ width: '150px', height: '100px', borderRadius: '10px' }}
        />
      ) : (
        <div style={{ width: '150px', height: '100px', backgroundColor: '#000', borderRadius: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' }}>
          Camera Off
        </div>
      )}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '150px',
          height: '100px',
        }}
      />
      <button
        className="capture-images"
        onClick={capture}
        disabled={isLoading || !isCameraOn}
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
      <button
       className="capture-images"
        onClick={toggleCamera}
        style={{
          position: 'absolute',
          top: '7rem',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: isCameraOn ? 'red' : 'green',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginTop: '10px',
        }}
      >
        {isCameraOn ? 'Turn Camera Off' : 'Turn Camera On'}
      </button> 
    </div>
  );
};

export default WebcamCapture;
