import React, { useState } from 'react';
import '../styles/upload-box.css'; // Assuming your CSS file is named UploadBox.css
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { useAuth } from "../context/AuthContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
// Removed Gemini import


function WardrobeUpload() {
  const [clothingType, setClothingType] = useState('top');
  const [image, setImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const storage = getStorage();
  const { currentUser } = useAuth();

  const handleDragEnter = () => setIsDragging(true);
  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files[0]) {
      setImage(e.dataTransfer.files[0]);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const removeBg = async (img) => {
    const apiKey = process.env.REACT_APP_REMOVEBG_API_KEY;
    const apiUrl = "https://api.remove.bg/v1.0/removebg";

    const formData = new FormData();
    formData.append("image_file", img, img.name);
    formData.append("size", 'auto');

    try {
        const res = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'X-Api-Key': apiKey
            },
            body: formData
        });

        const data = await res.blob();
        return data
    } catch (error) {
        console.log(error);
    }
  };

  const handleUpload = async () => {
    if (!image) return;

    const storageRef = ref(storage, `wardrobeImages/${image.name}`);
    let imageUrl = '';

    try {
      //remove background of image
      const processed = await removeBg(image)
      // Upload the processed image to Firebase Storage
      await uploadBytes(storageRef, processed);

      // Get the download URL of the uploaded image
      imageUrl = await getDownloadURL(storageRef);

      // Save entry using user-selected clothing type
      const db = firebase.firestore();
      const docRef = db.collection('users').doc(currentUser.uid);
      const userDoc = await docRef.get();
      if (!userDoc.exists) {
        await docRef.set({});
      }
      const wardrobe = docRef.collection('wardrobe');
      await wardrobe.add({
        title: image.name,
        type: clothingType,
        colors: [],
        styles: [],
        imgUrl: imageUrl
      });
    } catch (error) {
      console.error('Error handling upload:', error);
    } finally {
      setImage(null); // Reset the image state
    }
  };

  return (
    <div className="upload-container" id='upload-container'>
      <div
        className={`upload-box ${isDragging ? 'dragging' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <input
          type="file"
          className="file-input"
          accept=".jpg, .jpeg"
          onChange={handleImageChange}
        />
        <FontAwesomeIcon icon={faCamera} size="3x" className="upload-icon" />
        {image && <p>{image.name}</p>}
      </div>
      <div style={{ margin: '10px 0' }}>
        <label htmlFor="clothing-type-select">Type:</label>
        <select
          id="clothing-type-select"
          value={clothingType}
          onChange={e => setClothingType(e.target.value)}
          style={{ marginLeft: '8px', padding: '4px' }}
        >
          <option value="top">Top</option>
          <option value="bottom">Bottom</option>
          <option value="dress">Dress</option>
          <option value="accessory">Accessory</option>
        </select>
      </div>
      <button className="upload-button" onClick={handleUpload}>Upload</button>
    </div>
  );
}

export default WardrobeUpload;
