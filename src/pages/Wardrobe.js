import React, { useState } from "react";
import "../styles/Wardrobe.css";
import Carousel from "../components/CenterMode"
const Wardrobe = () => {
  const [openSections, setOpenSections] = useState({
    Tops: false,
    Bottoms: false,
    Accessories: false,
  });

  const toggleSection = (section) => {
    setOpenSections((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  return (
    <div className="wardrobe-container">
      <div className="empty-section">
        {/* Empty section for future use */}
      </div>
      <div className="wardrobe">
        {["tops", "bottoms", "accessories"].map((section) => (
          <div
            key={section}
            className={`wardrobe-section ${
              openSections[section] ? "open" : "closed"
            }`}
          >
            <button onClick={() => toggleSection(section)} className="toggle-button">
              {openSections[section] ? "close" : `${section}`}
            </button>
            <div className="wardrobe-content">
              <Carousel />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wardrobe;
