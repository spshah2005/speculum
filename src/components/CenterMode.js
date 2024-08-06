import React from "react";
import Slider from "react-slick";
import "../styles/carousel.css";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function CenterMode({ content }) {
  const settings = {
    className: "center",
    centerMode: true,
    infinite: true,
    centerPadding: "60px",
    slidesToShow: 3,
    speed: 500,
    dots: true
  };

  return (
    <div className="slider-container">
      <Slider {...settings}>
        {[...content.entries()].map(([key, item]) => (
          <div key={key}>
            <img src={item.imgUrl} alt={item.title} style={{ width: '100%', height: 'auto' }} />
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default CenterMode;
