
import React, { useState } from 'react';
//Firebase instances
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { useAuth } from "../context/AuthContext";
// import axios from 'axios'
//gemini api
import { GoogleGenerativeAI } from "@google/generative-ai"

function WardrobeUpload() {
  const [image, setImage] = useState(null);
  const storage = getStorage();
  const {currentUser} = useAuth();

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    // get storage ref to upload
    const storageRef = ref(storage, `wardrobeImages/${image.mame}`);
    let imageUrl = ''
    
    //upload image to firestore storage
    async function uploadToFireCloud() {
      try { 
        await uploadBytes(storageRef, image);
        console.log('Image uploaded successfully!');

        imageUrl = await getDownloadURL(storageRef);
        console.log('Download URL:', imageUrl);
      } catch (error) {
          console.error('Error uploading image:', error);
      }
    }

    // gemini api model
    const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
    
    // converts a file object to a GoogleGenerativeAI.Part object.
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
    
    // gemini prompt and JSON response
    async function geminiClothesDescription() {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generation_config:{"response_mime_type": "application/json"} });
    
        const prompt = `List the colors of the garment, 
        and keywords describing the style of garment, and a title for the garment
        Use the following JSON schema and Provide your answer in JSON form. 
        Reply with only the answer in JSON form and include no other commentary::
        Color = str
        Style = str
        Title = str
        return a list[Title, {colors:list[Color]}, {style:list[Style]} ]
        `
    
        const imagePart = await fileToGenerativePart(image)
        const result = await model.generateContent([prompt, imagePart])
        const response = await result.response;
        return JSON.parse(response.text());
    }
    
    // Save data to Firestore along with image URL
    async function addEntry(data) {
      const db = firebase.firestore(); //modify to create new reference with new user
      const docRef = db.collection('users').doc(currentUser.uid);
      const userDoc = await docRef.get()
      if (!userDoc.exists){
        await docRef.set({})
      }
      const wardrobe = docRef.collection('wardrobe')
      await wardrobe.add({
        title: data[0],
        colors: data[1]['colors'],
        styles: data[2]['style'],
        imgUrl: imageUrl
      })
    }

    uploadToFireCloud();
    const data = await geminiClothesDescription(); // data[0] is colors && data[1] is styles
    console.log(data)
    addEntry(data);
  };

  return (
    <div>
      <input type="file" onChange={handleImageChange} />
      <button onClick={handleUpload}>Upload to Wardrobe</button>
    </div>
  );
}

export default WardrobeUpload;