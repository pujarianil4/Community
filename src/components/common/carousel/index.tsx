"use client";
import React, { useState } from "react";
import "./index.scss";
import Media from "@/components/feedPost/media";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

const ONE_SECOND = 1000;
const AUTO_DELAY = ONE_SECOND * 10;
const DRAG_BUFFER = 50;

const SPRING_OPTIONS = {
  type: "spring",
  mass: 3,
  stiffness: 400,
  damping: 50,
};

interface IProps {
  assets: string[];
}

const SwipeCarousel = ({ assets }: IProps) => {
  const [imgIndex, setImgIndex] = useState(0);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const handleExpand = (
    val: boolean,
    event: React.MouseEvent<HTMLImageElement>
  ) => {
    event.stopPropagation();
    setExpanded(val);
  };

  const handleDragStart = (event: React.TouchEvent<HTMLDivElement>) => {
    setDragStartX(event.touches[0].clientX);
    setDragging(true);
  };

  const handleDragMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (dragging) {
      const moveX = event.touches[0].clientX;
      const diff = moveX - dragStartX;
      const currentIndex = imgIndex;

      if (diff >= DRAG_BUFFER && currentIndex > 0) {
        setImgIndex(currentIndex - 1);
        setDragging(false);
      } else if (diff <= -DRAG_BUFFER && currentIndex < assets?.length - 1) {
        setImgIndex(currentIndex + 1);
        setDragging(false);
      }
    }
  };

  const handleDragEnd = () => {
    setDragging(false);
  };

  const goToPrevious = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (imgIndex > 0) {
      setImgIndex(imgIndex - 1);
    }
  };

  const goToNext = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (imgIndex < assets?.length - 1) {
      setImgIndex(imgIndex + 1);
    }
  };

  return (
    <>
      <div
        className='carousel-container'
        onClick={(event: React.MouseEvent<HTMLImageElement>) =>
          handleExpand(true, event)
        }
      >
        {imgIndex > 0 && (
          <button className='nav_button prev' onClick={goToPrevious}>
            <FaChevronLeft size={16} />
          </button>
        )}
        {imgIndex < assets?.length - 1 && (
          <button className='nav_button next' onClick={goToNext}>
            <FaChevronRight size={16} />
          </button>
        )}
        <div
          className='carousel'
          onTouchStart={handleDragStart}
          onTouchMove={handleDragMove}
          onTouchEnd={handleDragEnd}
          style={{
            transform: `translateX(-${imgIndex * 100}%)`,
            transition: dragging
              ? "none"
              : `transform ${SPRING_OPTIONS.type} ${SPRING_OPTIONS.stiffness}ms ${SPRING_OPTIONS.damping}ms`,
          }}
        >
          {assets?.map((imgSrc, idx) => (
            <Media
              key={idx}
              asset={imgSrc}
              totalAssets={assets?.length}
              className='carousel_image'
            />
          ))}
        </div>
        {assets?.length > 1 && (
          <Dots
            totalDots={assets?.length || 1}
            imgIndex={imgIndex}
            setImgIndex={setImgIndex}
          />
        )}
        <GradientEdges />
      </div>
      {expanded && (
        <div className='expanded_view'>
          <span
            className='close_icon'
            onClick={(event: React.MouseEvent<HTMLImageElement>) =>
              handleExpand(false, event)
            }
          >
            &#x2715;
          </span>
          <div className='carousel_container_expanded'>
            {imgIndex > 0 && (
              <button className='nav_button prev' onClick={goToPrevious}>
                <FaChevronLeft size={16} />
              </button>
            )}
            {imgIndex < assets?.length - 1 && (
              <button className='nav_button next' onClick={goToNext}>
                <FaChevronRight size={16} />
              </button>
            )}
            <div
              className='carousel'
              onTouchStart={handleDragStart}
              onTouchMove={handleDragMove}
              onTouchEnd={handleDragEnd}
              style={{
                transform: `translateX(-${imgIndex * 100}%)`,
                transition: dragging
                  ? "none"
                  : `transform ${SPRING_OPTIONS.type} ${SPRING_OPTIONS.stiffness}ms ${SPRING_OPTIONS.damping}ms`,
              }}
            >
              {assets?.map((imgSrc, idx) => (
                <Media
                  key={idx}
                  asset={imgSrc}
                  totalAssets={assets?.length}
                  className='carousel_image expanded_media'
                />
              ))}
            </div>
            {assets?.length > 1 && (
              <Dots
                totalDots={assets?.length || 1}
                imgIndex={imgIndex}
                setImgIndex={setImgIndex}
              />
            )}
            <GradientEdges />
          </div>
        </div>
      )}
    </>
  );
};

const Dots = ({ totalDots, imgIndex, setImgIndex }: any) => {
  return (
    <div className='dots'>
      {new Array(totalDots).fill(1)?.map((_, idx) => (
        <button
          key={idx}
          onClick={(event) => {
            event.stopPropagation();
            setImgIndex(idx);
          }}
          className={`dot ${idx === imgIndex ? "active" : ""}`}
        />
      ))}
    </div>
  );
};

const GradientEdges = () => {
  return (
    <>
      <div className='gradient-left' />
      <div className='gradient-right' />
    </>
  );
};

export default SwipeCarousel;
