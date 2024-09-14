import React, { useRef, useEffect, useState } from 'react';
import * as blazeface from '@tensorflow-models/blazeface';
import '@tensorflow/tfjs';
import '../Pages/Webcam.css';

const WebcamCapture = ({ onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [faceBoundingBox, setFaceBoundingBox] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);

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
  }, [isCameraOn]);

  const capture = () => {
    if (!faceBoundingBox) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    const scaleFactor = 0.5; 
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
    setIsCameraOn((prev) => !prev);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const image = new Image();
        image.src = reader.result;
        image.onload = async () => {
          setUploadedImage(reader.result); // Show uploaded image in preview
          
          const model = await blazeface.load(); // Load the BlazeFace model
          
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = image.width;
          canvas.height = image.height;
          ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

          const predictions = await model.estimateFaces(canvas, false); // Run face detection
          
          if (predictions.length > 0) {
            const prediction = predictions[0];
            const [x, y, width, height] = prediction.topLeft.concat(prediction.bottomRight).flat();
            setFaceBoundingBox({ x, y, width: width - x, height: height - y });

            ctx.strokeStyle = 'yellow';
            ctx.lineWidth = 4;
            ctx.strokeRect(x, y, width - x, height - y);
          } else {
            alert('No face detected in the uploaded image.');
          }
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const captureUploadedImage = () => {
    if (!uploadedImage || !faceBoundingBox) return;

    const img = new Image();
    img.src = uploadedImage;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const scaleFactor = 0.5; 
      canvas.width = faceBoundingBox.width * scaleFactor;
      canvas.height = faceBoundingBox.height * scaleFactor;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(
        img,
        faceBoundingBox.x, faceBoundingBox.y,
        faceBoundingBox.width, faceBoundingBox.height,
        0, 0,
        canvas.width, canvas.height
      );

      const imageSrc = canvas.toDataURL('image/png');
      onCapture(imageSrc); 
    };
  };

  return (
    <div className="webcam-capture-container">
      <div className="webcam-display">
        {isCameraOn ? (
          <>
            <video ref={videoRef} autoPlay className="video-feed" />
            <canvas ref={canvasRef} className="video-overlay" />
          </>
        ) : uploadedImage ? (
          <img src={uploadedImage} alt="Uploaded Preview" className="uploaded-image-preview" />
        ) : (
          <div className="camera-off-placeholder">
            Camera Off
          </div>
        )}
      </div>

      <div className="controls">
        <button
          className="control-button"
          onClick={capture}
          disabled={isLoading || !isCameraOn}
        >
          {isLoading ? 'Loading...' : 'Capture Photo'}
        </button>

        <button
          className={`control-button ${isCameraOn ? 'off' : 'on'}`}
          onClick={toggleCamera}
        >
          {isCameraOn ? 'Turn Camera Off' : 'Turn Camera On'}
        </button>
      </div>

      <div className="upload-section">
        <input type="file" accept="image/*" onChange={handleFileUpload} className="upload-input" />
        <button
          className="control-button"
          onClick={captureUploadedImage}
          disabled={!uploadedImage}
        >
          Capture Uploaded Image
        </button>
      </div>
    </div>
  );
};

export default WebcamCapture;
