import { useEffect, useRef, useState } from "react";

export function useIntersectionObserver(
  ref: React.RefObject<HTMLVideoElement>,
  options: IntersectionObserverInit = {
    root: null,
    rootMargin: "100px",
    threshold: 0.5,
  }
): boolean {
  const [isIntersecting, setIsIntersecting] = useState<boolean>(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, options]);

  return isIntersecting;
}

export function useInViewport(options: IntersectionObserverInit = {}) {
  const [isInViewport, setIsInViewport] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInViewport(true);
          observer.disconnect(); // Stop observing after the element is in viewport
        }
      },
      { root: null, rootMargin: "100px", ...options }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [options]);

  return { ref, isInViewport };
}

export default useInViewport;
