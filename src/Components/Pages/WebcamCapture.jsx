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
          // Detect faces in the video stream
          const predictions = await model.estimateFaces(video, false);
    
          const canvas = canvasRef.current;
    
          // Ensure canvasRef.current is not null before using it
          if (!canvas) {
            console.error("Canvas element not available yet");
            return;
          }
    
          const ctx = canvas.getContext('2d');
    
          // Ensure the context is available
          if (!ctx) {
            console.error("Could not get 2D context from canvas");
            return;
          }
    
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
    
          if (predictions.length > 0) {
            predictions.forEach((prediction) => {
              const [x, y] = prediction.topLeft;
              const [rightX, rightY] = prediction.bottomRight;
              const width = rightX - x;
              const height = rightY - y;
    
              // Draw the face bounding box on the canvas for each prediction
              ctx.strokeStyle = 'yellow';
              ctx.lineWidth = 4;
              ctx.strokeRect(x, y, width, height);
    
              // Update the face bounding box state (could store multiple if needed)
              setFaceBoundingBox({ x, y, width, height });
            });
          } else {
            console.log("No faces detected");
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
    canvas.width = faceBoundingBox.width;
    canvas.height = faceBoundingBox.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(
      video,
      faceBoundingBox.x, faceBoundingBox.y,
      faceBoundingBox.width, faceBoundingBox.height,
      0, 0,
      canvas.width, canvas.height
    );

    // Convert the canvas content to a downloadable image
    const imageSrc = canvas.toDataURL('image/png');

    // Create an anchor element to download the image
    const link = document.createElement('a');
    link.href = imageSrc;
    link.download = 'captured-face-image.png';  // Set the file name
    document.body.appendChild(link);  // Append the link to the document
    link.click();  // Programmatically click the link to download the image
    document.body.removeChild(link);  // Clean up the link element

    onCapture(imageSrc);  // Call the onCapture function (optional)
  };
  

  const toggleCamera = () => {
    setIsCameraOn((prev) => !prev);
  };


  

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    console.log("file",file);
    setUploadedImage(file);

    
  };

  const captureUploadedImage = () => {
    if (!uploadedImage ) return;

    const img = new Image();
    img.src = uploadedImage;
    console.log("uploadedImage",uploadedImage)
    onCapture(uploadedImage);
     
 
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
          <img src={uploadedImage} alt="Upload Preview" className="uploaded-image-preview" />
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
        <div className='button-main-upload'>
          <button
            className="control-button"
            onClick={captureUploadedImage}
            disabled={!uploadedImage}
          >
            Upload Image
          </button>
        </div>
      </div>

      {/* Modal HTML */}
      <div id="noFaceModal" className="modal">
        <div className="modal-content">
          <span className="close" onClick={() => document.getElementById('noFaceModal').style.display = 'none'}></span>
          <div className="modal-body">
            <p>No face detected in the uploaded image Only passport size images are allowed.</p>
            <button className="modal-button" onClick={() => document.getElementById('noFaceModal').style.display = 'none'}>OK</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebcamCapture;