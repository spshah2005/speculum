import React, { useState, useEffect } from "react";
import "../styles/Wardrobe.css";
import Carousel from "../components/CenterMode"
import WardrobeUpload from "../components/WardrobeUpload";

//firebase
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

//auth
import { useAuth } from "../context/AuthContext"

const Wardrobe = () => {
  const [openSections, setOpenSections] = useState({
    Tops: false,
    Bottoms: false,
    Accessories: false,
  });

  const [tops, setTops] = useState(new Map());
  const [bottoms, setBottoms] = useState(new Map());
  const [accessories, setAccessories] = useState(new Map());

  const {currentUser} = useAuth()

  const addTop = (key, item) => {
    setTops((prevTops) => {
      const newTops = new Map(prevTops);
      newTops.set(key, item);
      return newTops;
    });
  };

  const addBottom = (key, item) => {
    setBottoms((prevBottoms) => {
      const newBottoms = new Map(prevBottoms);
      newBottoms.set(key, item);
      return newBottoms;
    });
  };

  const addAccessory = (key, item) => {
    setAccessories((prevAccessories) => {
      const newAccessories = new Map(prevAccessories);
      newAccessories.set(key, item);
      return newAccessories;
    });
  };

  useEffect(() => {
    const db = firebase.firestore();
    const docRef = db.collection('users').doc(currentUser.uid)
    async function checkIfExists() {
      const userDoc = await docRef.get();
      return userDoc.exists
    }
    if (checkIfExists()) {
      docRef.collection('wardrobe').get()
      .then(snapshot => {
        snapshot.docs.forEach(doc => {
            const userData = doc.data()
            if (userData.type.toLowerCase() === "top"){
              addTop(doc.id, {colors:userData.colors, styles:userData.styles, title:userData.title, imgUrl:userData.imgUrl})
            }
            else if (userData.type.toLowerCase() === "bottom"){
              addBottom(doc.id, {colors:userData.colors, styles:userData.styles, title:userData.title, imgUrl:userData.imgUrl})
            }
            else if (userData.type.toLowerCase() === "accessory"){
              addAccessory(doc.id, {colors:userData.colors, styles:userData.styles, title:userData.title, imgUrl:userData.imgUrl})
            }
        });
      })
      .catch(error => {
        console.error("Error getting documents: ", error);
      });
    }

  }, [])

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
              {section==="tops" && <Carousel content={tops}/>}
              {section==="bottoms" && <Carousel content={bottoms}/>}
              {section==="accessories" && <Carousel content={accessories}/>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wardrobe;
