import { useEffect, useRef } from "react";
import { Image as KonvaImage } from "react-konva";
import Konva from "konva";

interface VideoCaptureProps {
  videoElement: HTMLVideoElement | null;
  width: number;
  height: number;
  onImageRef: (node: Konva.Image) => void;
  onCaptureEnded?: () => void;
  scale?: number;
  x?: number;
  y?: number;
  onDragEnd?: (e: Konva.KonvaEventObject<MouseEvent>) => void;
}

export const VideoCapture = ({
  videoElement,
  width,
  height,
  onImageRef,
  onCaptureEnded,
  scale = 1,
  x = 0,
  y = 0,
}: VideoCaptureProps) => {
  const imageRef = useRef<Konva.Image | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!videoElement) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }

    const handleVideoEnded = () => {
      if (onCaptureEnded) {
        onCaptureEnded();
      }
    };

    videoElement.addEventListener("ended", handleVideoEnded);

    const updateVideoFrame = () => {
      if (imageRef.current) {
        const layer = imageRef.current.getLayer();
        if (layer) {
          layer.batchDraw();
        }
      }

      animationRef.current = requestAnimationFrame(updateVideoFrame);
    };

    updateVideoFrame();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      videoElement.removeEventListener("ended", handleVideoEnded);
    };
  }, [videoElement, onCaptureEnded]);

  const handleImageRef = (node: Konva.Image) => {
    imageRef.current = node;
    onImageRef(node);
  };

  if (!videoElement) return null;

  const videoWidth = videoElement.videoWidth || width;
  const videoHeight = videoElement.videoHeight || height;

  return (
    <KonvaImage
      ref={handleImageRef}
      image={videoElement}
      x={x}
      y={y}
      width={videoWidth * scale}
      height={videoHeight * scale}
    />
  );
};
