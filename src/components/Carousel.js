import React from "react";
import Slider from "react-slick";
import "../styles/carousel.css";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import CarouselItem from "./CarouselItem";

function Carousel({ content, onDragStart }) {
  const settings = {
    className: "center",
    centerMode: true,
    centerPadding: "40px", // Adjust this value for desired spacing
    slidesToShow: 3,
    speed: 300,
    dots: true,
    swipe: false,
    infinite: true, // Optional: Set to false if you don't want infinite scrolling
  };

  return (
    <div className="slider-container">
      <Slider {...settings}>
        {[...content.entries()].map(([key, item]) => (
          <CarouselItem 
            key={key}
            draggable
            onDragStart={(e) => onDragStart(e, item)}
            displayUrl={item.imgUrl} />
        ))}
      </Slider>
    </div>
  );
}

export default Carousel;
