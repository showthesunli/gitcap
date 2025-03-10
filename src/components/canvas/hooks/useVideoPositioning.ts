import { useState, useEffect } from "react";
import Konva from "konva";

interface UseVideoPositioningProps {
  videoElement: HTMLVideoElement | null;
  canvasWidth: number;
  canvasHeight: number;
}

export function useVideoPositioning({ 
  videoElement, 
  canvasWidth, 
  canvasHeight 
}: UseVideoPositioningProps) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (videoElement) {
      const videoWidth = videoElement.videoWidth || canvasWidth;
      const videoHeight = videoElement.videoHeight || canvasHeight;

      const scaleX = canvasWidth / videoWidth;
      const scaleY = canvasHeight / videoHeight;
      const newScale = Math.min(scaleX, scaleY, 1);

      const newX = (canvasWidth - videoWidth * newScale) / 2;
      const newY = (canvasHeight - videoHeight * newScale) / 2;

      setScale(newScale);
      setPosition({ x: newX, y: newY });
    }
  }, [videoElement, canvasWidth, canvasHeight]);

  const handleDragEnd = (e: Konva.KonvaEventObject<MouseEvent>) => {
    setPosition({
      x: e.target.x(),
      y: e.target.y(),
    });
  };

  return {
    scale,
    position,
    handleDragEnd
  };
}
