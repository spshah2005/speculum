import React, { useState, useEffect, useRef } from "react";
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
    tops: false,
    bottoms: false,
    dresses: false,
    accessories: false,
  });

  const [tops, setTops] = useState(new Map());
  const [bottoms, setBottoms] = useState(new Map());
  const [accessories, setAccessories] = useState(new Map());
  const [dresses, setDresses] = useState(new Map());

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

  const addDress = (key, item) => {
    Object.defineProperty(item, "key", {value:key})
    setDresses((prevDresses) => {
      const newDresses = new Map(prevDresses);
      newDresses.set(key, item);
      return newDresses;
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
            else if (userData.type.toLowerCase() === "dress"){
              addDress(doc.id, {colors:userData.colors, styles:userData.styles, title:userData.title, imgUrl:userData.imgUrl})
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

  const canvasRef = useRef(null);

  const handleDragStart = (e, item) => {
    // compute pointer offset inside the dragged element so drop keeps relative position
    const target = e.target;
    const rect = target.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    const transferItem = { ...item, offsetX, offsetY };
    e.dataTransfer.setData('item', JSON.stringify(transferItem));

    // Optionally set drag image to improve UX (use the node itself)
    if (e.dataTransfer.setDragImage) {
      // use the element's image if available, else the element
      const img = target.querySelector('img');
      if (img) {
        e.dataTransfer.setDragImage(img, offsetX, offsetY);
      } else {
        e.dataTransfer.setDragImage(target, offsetX, offsetY);
      }
    }
  };
  const snapToGrid = (x, y, grid = 32) => {
  const snappedX = Math.round(x / grid) * grid;
  const snappedY = Math.round(y / grid) * grid;
  return [snappedX, snappedY];
  };

  const handleDrop = (e) => {
    e.preventDefault();

    const raw = e.dataTransfer.getData('item');
    if (!raw) return;
    const item = JSON.parse(raw);

    // Use the canvas's bounding rect so we always calculate coordinates relative to the canvas
    const canvasEl = canvasRef.current;
    const canvasRect = canvasEl ? canvasEl.getBoundingClientRect() : { left: 0, top: 0 };

    const offsetX = item.offsetX ?? 50;
    const offsetY = item.offsetY ?? 50;

    let x = e.clientX - canvasRect.left - offsetX;
    let y = e.clientY - canvasRect.top - offsetY;

    // snap to grid for tidiness
    [x, y] = snapToGrid(x, y, 32);

    if (!('x' in item)) {
      // New item, add to the array
      const newItem = { ...item, x, y, id: droppedItems.length };
      setDroppedItems(prev => [...prev, newItem]);
    } else {
      // Existing item, update position
      const updatedItems = droppedItems.map(droppedItem => 
        droppedItem.id === item.id ? { ...droppedItem, x, y } : droppedItem
      );
      setDroppedItems(updatedItems);
    }
  };

  const handleDropTrash = (e) => {
    e.preventDefault();
    const item = JSON.parse(e.dataTransfer.getData('item'));
    const updatedItems = droppedItems.filter(droppedItem => droppedItem.id !== item.id);
    setDroppedItems(updatedItems);
  }

  const handleDragOver = (e) => {
    e.preventDefault();
    
  };
  
  return (
    <div className="wardrobe-container">
        <div className="wardrobe-modifier">
        <div className="wardrobe-playground">
          <Canvas canvasRef={canvasRef} droppedItems={droppedItems} onDrop={handleDrop} onDragStart={handleDragStart} onDragOver={handleDragOver} />
        </div>
        <div className="menu-container">
          <WardrobeUpload />
          <div className="trash-container">
            <TrashBin onDrop={handleDropTrash}/>
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
              {section==="dresses" && <Carousel content={dresses} onDragStart={handleDragStart}/>}
              {section==="accessories" && <Carousel content={accessories} onDragStart={handleDragStart}/>}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Wardrobe;
