import React, { useEffect, useRef } from 'react';

const FaceEmbedding = ({ modelImageSrc, userFace, onComplete }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const embedFace = async () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      const modelImg = new Image();
      modelImg.src = modelImageSrc;

      modelImg.onload = () => {
        canvas.width = modelImg.width;
        canvas.height = modelImg.height;
        ctx.drawImage(modelImg, 0, 0);

        // Adjust userFace position and size according to the model's face position
        // For simplicity, let's assume fixed positions
        const faceWidth = 100;
        const faceHeight = 100;
        const faceX = 150;
        const faceY = 50;

        const userImg = new Image();
        userImg.src = userFace;

        userImg.onload = () => {
          ctx.drawImage(userImg, faceX, faceY, faceWidth, faceHeight);
          onComplete(canvas.toDataURL('image/png'));
        };
      };
    };

    if (userFace && modelImageSrc) {
      embedFace();
    }
  }, [modelImageSrc, userFace, onComplete]);

  return <canvas ref={canvasRef} style={{ display: 'none' }} />;
};

export default FaceEmbedding;
