import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const BackgroundCanvas = () => {
  const canvasRef = useRef(null);
  const frames = useRef({
    currentIndex: 0,
    maxIndex: 120
  }).current;

  const images = useRef([]);
  const imagesLoaded = useRef(0);

  const loadImage = (index) => {
    if (index >= 0 && index < frames.maxIndex && canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      const img = images.current[index];
      
      if (!img) return;

      // Set canvas size to match window
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const scaleX = canvas.width / img.width;
      const scaleY = canvas.height / img.height;
      const scale = Math.max(scaleX, scaleY);

      const newWidth = img.width * scale;
      const newHeight = img.height * scale;
      const offsetX = (canvas.width - newWidth) / 2;
      const offsetY = (canvas.height - newHeight) / 2;

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.imageSmoothingQuality = 'high';
      context.imageSmoothingEnabled = true;
      context.drawImage(img, offsetX, offsetY, newWidth, newHeight);
      frames.currentIndex = index;
    }
  };

  const startAnimation = () => {
    gsap.timeline({
      scrollTrigger: {
        trigger: ".scroll-area",
        start: "top top",
        end: "bottom top",
        scrub: 2
      }
    }).to(frames, {
      currentIndex: frames.maxIndex - 1,
      onUpdate: () => {
        loadImage(Math.floor(frames.currentIndex));
      }
    });
  };

  const preloadImages = () => {
    for (let i = 1; i <= frames.maxIndex; i++) {
      const imageURL = `/FRAMES/frame_${i.toString().padStart(4, "0")}.jpeg`;
      const img = new Image();
      img.src = imageURL;
      img.onload = () => {
        imagesLoaded.current++;
        if (imagesLoaded.current === frames.maxIndex) {
          loadImage(frames.currentIndex);
          startAnimation();
        }
      };
      img.onerror = () => {
        console.warn(`Failed to load frame: ${imageURL}`);
        imagesLoaded.current++;
        if (imagesLoaded.current === frames.maxIndex) {
          loadImage(frames.currentIndex);
          startAnimation();
        }
      };
      images.current.push(img);
    }
  };

  // Handle window resize
  const handleResize = () => {
    if (canvasRef.current) {
      loadImage(frames.currentIndex);
    }
  };

  useEffect(() => {
    preloadImages();
    
    // Add resize listener for mobile orientation changes
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-screen h-screen z-0 grayscale"
      id="frame"
      style={{
        // Prevent canvas from interfering with touch events on mobile
        touchAction: 'none',
        // Optimize for mobile performance
        willChange: 'transform'
      }}
    />
  );
};

export default BackgroundCanvas;