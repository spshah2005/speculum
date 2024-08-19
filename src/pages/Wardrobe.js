import React, { useState, useEffect } from "react";
import "../styles/wardrobe.css";
import Carousel from "../components/Carousel"
import WardrobeUpload from "../components/WardrobeUpload";
import Canvas from "../components/Canvas"
import TrashBin from "../components/TrashBin"

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
    Object.defineProperty(item, "key", {value:key})
    setTops((prevTops) => {
      const newTops = new Map(prevTops);
      newTops.set(key, item);
      return newTops;
    });
  };

  const addBottom = (key, item) => {
    Object.defineProperty(item, "key", {value:key})
    setBottoms((prevBottoms) => {
      const newBottoms = new Map(prevBottoms);
      newBottoms.set(key, item);
      return newBottoms;
    });
  };

  const addAccessory = (key, item) => {
    Object.defineProperty(item, "key", {value:key})
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

  const [droppedItems, setDroppedItems] = useState([]);
  
  const deleteDroppedItem = (targetIndex) => {
    const newDroppedItems = droppedItems.filter(item => item.id !== targetIndex);
    setDroppedItems(newDroppedItems); 
  };

  const handleDragStart = (e,item) => {
    e.dataTransfer.setData('item', JSON.stringify(item));
    console.log(item)
  };
  const handleDrop = (e) => {
    e.preventDefault();
    const item = JSON.parse(e.dataTransfer.getData('item'));  
    const canvasRect = e.target.getBoundingClientRect();
    const x = e.clientX - canvasRect.left-50;
    const y = e.clientY - canvasRect.top-50;
    if (!("x"  in item)) {
      item.x = x;
      item.y = y;
      item.id = droppedItems.length;
      setDroppedItems([...droppedItems, item]);
    }
    else {
      const existingId = droppedItems.findIndex(droppedItem => droppedItem.id===item.id);
      deleteDroppedItem(existingId)
      item.x = x;
      item.y = y;
      setDroppedItems([...droppedItems, item])
      console.log(droppedItems);
    }
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    
  };
  
  return (
    <div className="wardrobe-container">
      <div className="wardrobe-modifier">
        <div className="wardrobe-playground">
          <Canvas droppedItems={droppedItems} onDrop={handleDrop} onDragStart={handleDragStart} onDragOver={handleDragOver} />
        </div>
        <div className="menu-container">
          <WardrobeUpload />
          <div className="trash-container">
            <TrashBin />
          </div>
        </div>
      </div>

      <div className="wardrobe">
        {["tops", "bottoms", "dresses", "accessories"].map((section) => (
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
              {section==="tops" && <Carousel content={tops} onDragStart={handleDragStart}/>}
              {section==="bottoms" && <Carousel content={bottoms} onDragStart={handleDragStart}/>}
              {section==="accessories" && <Carousel content={accessories} onDragStart={handleDragStart}/>}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Wardrobe;
