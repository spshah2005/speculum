import React from 'react';

const CarouselItem = ({ draggable, onDragStart, displayUrl }) => {

  return (
    <div
      draggable={draggable}
      onDragStart={(e) => onDragStart(e)}
      style={{ cursor: 'grab'}} 
    >
      <img
        src={displayUrl}
        alt="Carousel Item"
        style={{
          margin: '0 auto',
          pointerEvents: 'none', // Prevent the image itself from interfering with dragging
          objectFit: "contain"
        }}
      />
    </div>
  );
};

export default CarouselItem;
