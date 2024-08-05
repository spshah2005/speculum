import React, { useState } from "react";
import "../styles/Wardrobe.css";
import Carousel from "../components/CenterMode"
import WardrobeUpload from "../components/WardrobeUpload";

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
      <div className="wardrobe-modifier">
        <div className="playground-container">
          {/* drag and drop  */}
        </div>
        <div className="upload-container">
          <WardrobeUpload/>
        </div>
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
