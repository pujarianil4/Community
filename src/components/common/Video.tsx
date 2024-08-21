import { useIntersectionObserver } from "@/hooks/useIntersection";
import { useEffect, useRef } from "react";

interface VideoFeedProps {
  src: string;
  className?: string;
}

const CVideo: React.FC<VideoFeedProps> = ({ src, className }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isVisible = useIntersectionObserver(videoRef);

  useEffect(() => {
    if (videoRef.current) {
      if (isVisible) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [isVisible]);

  return (
    <>
      <video
        ref={videoRef}
        src={src}
        width='100%'
        controls
        playsInline
        className={`media ${className}`}
        preload='auto'
        muted
      />
    </>
  );
};
export default CVideo;
