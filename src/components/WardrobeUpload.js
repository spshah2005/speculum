import React, { useState } from 'react';
import '../styles/UploadBox.css'; // Assuming your CSS file is named UploadBox.css
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { useAuth } from "../context/AuthContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { GoogleGenerativeAI } from "@google/generative-ai";


function WardrobeUpload() {
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

      // Google Generative AI model
      const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

      async function fileToGenerativePart(file) {
        const base64EncodedDataPromise = new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result.split(',')[1]);
          reader.readAsDataURL(file);
        });
        return {
          inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
        };
      }

      async function geminiClothesDescription() {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generation_config: {"response_mime_type": "application/json"} });

        const prompt = `List the colors of the garment, 
        and keywords describing the style of garment, and a title for the garment,
        and classify the top as one of the following: top, bottom, accessory
        Use the following JSON schema and Provide your answer in JSON form. 
        Reply with only the answer in JSON form and include no other commentary::
        Color = str
        Style = str
        Title = str
        Type = str
        return a list[Title, Type, {colors:list[Color]}, {style:list[Style]} ]
        `;

        const imagePart = await fileToGenerativePart(image);
        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        return JSON.parse(response.text());
      }

      async function addEntry(data) {
        const db = firebase.firestore();
        const docRef = db.collection('users').doc(currentUser.uid);
        const userDoc = await docRef.get();
        if (!userDoc.exists) {
          await docRef.set({});
        }
        const wardrobe = docRef.collection('wardrobe');
        await wardrobe.add({
          title: data[0],
          type: data[1],
          colors: data[2]['colors'],
          styles: data[3]['style'],
          imgUrl: imageUrl
        });
      }

      // Process and save data
      const data = await geminiClothesDescription();
      console.log(data); //TO DO try again until valid JSON.parse
      await addEntry(data);
    } catch (error) {
      console.error('Error handling upload:', error);
    } finally {
      setImage(null); // Reset the image state
    }
  };

  return (
    <div className="upload-container" id = 'upload-container'> 
      {image && <img src={image.src} alt='removed back'/>}
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
    <button className="upload-button" onClick={handleUpload}>upload</button>
    </div>
    
  );
}

export default WardrobeUpload;
