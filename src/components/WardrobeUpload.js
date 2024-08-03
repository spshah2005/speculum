
import React, { useState } from 'react';
//Firebase instances
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// import firebase from 'firebase/compat/app';
// import 'firebase/compat/firestore';
// import axios from 'axios'
//gemini api
import { GoogleGenerativeAI } from "@google/generative-ai"

function WardrobeUpload() {
  const [image, setImage] = useState(null);
  const storage = getStorage();

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    // 1. Upload Image to Firebase Storage
    const storageRef = ref(storage, `wardrobeImages/${image.mame}`);
    let imageUrl = ''
    try {  // Upload the image
        await uploadBytes(storageRef, image);
        console.log('Image uploaded successfully!');

        // Get the download URL for the uploaded image
        imageUrl = await getDownloadURL(storageRef);
        console.log('Download URL:', imageUrl);
        // You can now use the download URL to display the image in your app
    } catch (error) {
        console.error('Error uploading image:', error);
    }

    // 2. Call Gemini API for Image Analysis (you'll need your API key)
    const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
    // Converts a File object to a GoogleGenerativeAI.Part object.
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
    
    async function run() {
        // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generation_config:{"response_mime_type": "application/json"} });
    
        const prompt = `List the colors of the garment, 
        and keywords describing the style of garment, 
        Use the following JSON schema and Provide your answer in JSON form. 
        Reply with only the answer in JSON form and include no other commentary::
        Color = str
        Style = str
        return a list[ {colors:list[Color]}, {style:list[Style]} ]
        `
    
        const imagePart = await fileToGenerativePart(image)
    
        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        return JSON.parse(response.text());
    }
    
    const data = run(); // data[0] is colors && data[1] is styles
    console.log('colors', data[0])
    console.log('styles', data[1])
    // // 3. Extract Gemini data (garment type, colors, etc.) 
    // const geminiData = response.data; 
    // // ... (process Gemini's response to get relevant data)
    // console.log(geminiData)
    // // 4. Save to Firestore along with image URL
    // const db = firebase.firestore();
    // await db.collection('wardrobes').add({
    //   userId: 'currentUserId', // Get current user ID from Firebase Auth
    //   imageUrl: imageUrl,
    //   garmentType: geminiData.garmentType, // Example
    //   colors: geminiData.colors,        // Example
    //   // ... other extracted attributes 
    // });
  };

  return (
    <div>
      <input type="file" onChange={handleImageChange} />
      <button onClick={handleUpload}>Upload to Wardrobe</button>
    </div>
  );
}

export default WardrobeUpload;